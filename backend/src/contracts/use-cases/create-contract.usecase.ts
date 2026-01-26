import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { convert as convertNumberToWordsRu } from 'number-to-words-ru'
import * as path from 'path'
import { PrismaService } from '../../prisma.service'
import { formatYmdToDmy } from '../../utils/date'
import { CreateContractDto } from '../dto/create-contract.dto'
import { ContractCalculator } from '../domain/contract-calculator'
import { ContractTemplateMapper } from '../domain/contract-template.mapper'
import { ensureUniqueIds, getDateParts, toDateTime } from '../domain/validators'
import { DocxTemplateService } from '../infrastructure/docx-template.service'
import { FileStorageService } from '../infrastructure/file-storage.service'

@Injectable()
export class CreateContractUseCase {
	private readonly templatePath = path.join(
		process.cwd(),
		'templates',
		'main-template.docx'
	)

	constructor(
		private readonly prisma: PrismaService,
		private readonly calculator: ContractCalculator,
		private readonly templateMapper: ContractTemplateMapper,
		private readonly docxTemplate: DocxTemplateService,
		private readonly fileStorage: FileStorageService
	) {}

	async execute(dto: CreateContractDto) {
		let formattedContractDate: string
		try {
			formattedContractDate = formatYmdToDmy(dto.contractDate)
		} catch {
			throw new BadRequestException('Неверный формат даты для contractDate')
		}
		const contractDateParts = getDateParts(dto.contractDate, 'contractDate')
		const deadmanBirthday = toDateTime(dto.deadmanBirthday, 'deadmanBirthday')
		const deadmanDeathDay = toDateTime(dto.deadmanDeathDay, 'deadmanDeathDay')

		const serviceIds = dto.services.map(item => item.serviceId)
		const productIds = dto.products.map(item => item.productId)

		const uniqueServiceIds = ensureUniqueIds(
			serviceIds,
			'Услуги должны быть уникальными'
		)
		const uniqueProductIds = ensureUniqueIds(
			productIds,
			'Товары должны быть уникальными'
		)

		const [services, products] = await Promise.all([
			this.prisma.service.findMany({
				where: { id: { in: uniqueServiceIds } },
				select: { id: true, name: true, defaultPrice: true }
			}),
			this.prisma.product.findMany({
				where: { id: { in: uniqueProductIds } },
				select: { id: true, name: true, price: true }
			})
		])

		if (services.length !== uniqueServiceIds.length) {
			const found = new Set(services.map(service => service.id))
			const missing = uniqueServiceIds.filter(id => !found.has(id))
			throw new NotFoundException(`Не найдены услуги: ${missing.join(', ')}`)
		}

		if (products.length !== uniqueProductIds.length) {
			const found = new Set(products.map(product => product.id))
			const missing = uniqueProductIds.filter(id => !found.has(id))
			throw new NotFoundException(`Не найдены товары: ${missing.join(', ')}`)
		}

		const serviceById = new Map(services.map(service => [service.id, service]))
		const productById = new Map(products.map(product => [product.id, product]))

		const servicesForCreate = dto.services.map(item => {
			const service = serviceById.get(item.serviceId)
			if (!service) {
				throw new NotFoundException('Услуга не найдена')
			}
			return {
				serviceId: service.id,
				price: item.price ?? service.defaultPrice,
				comment: item.comment,
				serviceNameSnapshot: service.name
			}
		})

		const productsForCreate = dto.products.map(item => {
			const product = productById.get(item.productId)
			if (!product) {
				throw new NotFoundException('Товар не найден')
			}
			return {
				productId: product.id,
				quantity: item.quantity ?? 1,
				unitPrice: item.unitPrice ?? product.price,
				comment: item.comment,
				nameSnapshot: product.name
			}
		})

		const totals = this.calculator.totals(servicesForCreate, productsForCreate)
		const totalInWords = convertNumberToWordsRu(totals.total)

		const data = this.templateMapper.toTemplateData({
			dto,
			formattedContractDate,
			contractDateParts,
			servicesForCreate,
			productsForCreate,
			totals,
			formatNumber: value => this.calculator.formatNumber(value),
			totalInWords,
			deadmanBirthday: formatYmdToDmy(dto.deadmanBirthday),
			deadmanDeathDay: formatYmdToDmy(dto.deadmanDeathDay)
		})

		const outBuf = await this.docxTemplate.render(this.templatePath, data)

		const { storageName, storagePath, sizeBytes } =
			await this.fileStorage.save(outBuf, { ext: 'docx' })

		const originalName = `contract_${dto.contractNumber}.docx`
		const mimeType =
			'application/vnd.openxmlformats-officedocument.wordprocessingml.document'

		let created: { contractId: string; documentId: string }

		try {
			created = await this.prisma.$transaction(async tx => {
				const contract = await tx.contract.create({
					data: {
						contractNumber: dto.contractNumber,
						contractDate: dto.contractDate,
						clientFullName: dto.clientFullName,
						clientPhone: dto.clientPhone,
						price: totals.total,
						comment: dto.comment,
						deadmanAddress: dto.deadmanAddress,
						deadmanAge: dto.deadmanAge,
						deadmanBirthday,
						deadmanDeathDay,
						services: { create: servicesForCreate },
						products: { create: productsForCreate }
					},
					select: { id: true }
				})

				const document = await tx.document.create({
					data: {
						kind: 'contract',
						originalName,
						storageName,
						mimeType,
						sizeBytes,
						contract: {
							connect: {
								id: contract.id
							}
						}
					},
					select: { id: true }
				})

				return { contractId: contract.id, documentId: document.id }
			})
		} catch (error) {
			try {
				await this.fileStorage.remove(storagePath)
			} catch {
				// ignore cleanup errors
			}
			throw error
		}

		return {
			id: created.contractId,
			documentId: created.documentId,
			url: `/contracts/${created.contractId}/download`
		}
	}
}
