import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	NotFoundException
} from '@nestjs/common'
import { randomUUID } from 'crypto'
import Docxtemplater from 'docxtemplater'
import * as fs from 'fs/promises'
import { convert as convertNumberToWordsRu } from 'number-to-words-ru'
import * as path from 'path'
import PizZip from 'pizzip'
import type { Prisma } from '../generated/prisma/client.js'
import { PrismaService } from '../prisma.service'
import { formatYmdToDmy } from '../utils/date'
import { CreateContractDto } from './dto/create-contract.dto'
import { UpdateContractDto } from './dto/update-contract.dto'

const toDateTime = (value: string, fieldLabel: string) => {
	const isDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(value)
	const date = new Date(isDateOnly ? `${value}T00:00:00.000Z` : value)
	if (Number.isNaN(date.getTime())) {
		throw new BadRequestException(`Неверный формат даты для ${fieldLabel}`)
	}
	return date
}

const monthNames = [
	'январь',
	'февраль',
	'март',
	'апрель',
	'май',
	'июнь',
	'июль',
	'август',
	'сентябрь',
	'октябрь',
	'ноябрь',
	'декабрь'
]

const getDateParts = (value: string, fieldLabel: string) => {
	const dateOnlyMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
	if (dateOnlyMatch) {
		toDateTime(value, fieldLabel)
		const [, year, month, day] = dateOnlyMatch
		const monthIndex = Number(month) - 1
		return {
			day: String(Number(day)),
			month: monthNames[monthIndex] ?? '',
			year: year.slice(-2)
		}
	}
	const date = toDateTime(value, fieldLabel)
	return {
		day: String(date.getUTCDate()),
		month: monthNames[date.getUTCMonth()] ?? '',
		year: String(date.getUTCFullYear()).slice(-2)
	}
}

@Injectable()
export class ContractsService {
	constructor(private readonly prisma: PrismaService) {}

	private templatePath = path.join(
		process.cwd(),
		'templates',
		'main-template.docx'
	)
	private outDir = path.join(process.cwd(), 'storage', 'generated')

	async createContract(dto: CreateContractDto) {
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

		const uniqueServiceIds = [...new Set(serviceIds)]
		const uniqueProductIds = [...new Set(productIds)]

		if (uniqueServiceIds.length !== serviceIds.length) {
			throw new BadRequestException('Услуги должны быть уникальными')
		}
		if (uniqueProductIds.length !== productIds.length) {
			throw new BadRequestException('Товары должны быть уникальными')
		}

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

		const servicesTotal = servicesForCreate.reduce(
			(sum, item) => sum + item.price,
			0
		)
		const productsTotal = productsForCreate.reduce(
			(sum, item) => sum + item.quantity * item.unitPrice,
			0
		)
		const totalPrice = servicesTotal + productsTotal

		const formattedTotalPrice = () => {
			return new Intl.NumberFormat('ru-RU', {
				maximumFractionDigits: 0
			}).format(totalPrice)
		}

		const totalPriceInWords = convertNumberToWordsRu(totalPrice)

		const servicesForTemplate = servicesForCreate.map((item, index) => ({
			index: index + 1,
			service_id: item.serviceId,
			service_name: item.serviceNameSnapshot,
			name: item.serviceNameSnapshot,
			price: item.price,
			comment: item.comment ?? ''
		}))

		const productsForTemplate = productsForCreate.map((item, index) => ({
			index: index + 1,
			product_id: item.productId,
			product_name: item.nameSnapshot,
			name: item.nameSnapshot,
			quantity: item.quantity,
			unit_price: item.unitPrice,
			total: item.quantity * item.unitPrice,
			comment: item.comment ?? ''
		}))

		await fs.mkdir(this.outDir, { recursive: true })

		const templateBuf = await fs.readFile(this.templatePath)

		let doc: Docxtemplater
		try {
			const zip = new PizZip(templateBuf)
			doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true })
		} catch {
			throw new InternalServerErrorException('Не удалось прочитать DOCX-шаблон')
		}

		const data = {
			contract_number: dto.contractNumber,
			contract_date: formattedContractDate,
			contract_day: contractDateParts.day,
			contract_month: contractDateParts.month,
			contract_year: contractDateParts.year,
			client_full_name: dto.clientFullName,
			client_passport: dto.clientPassport, //Убрать, не используется в договоре
			price: formattedTotalPrice(),
			price_in_words: totalPriceInWords,
			services_total: servicesTotal,
			products_total: productsTotal,
			comment: dto.comment ?? '',
			deadman_full_name: dto.deadmanFullName,
			deadman_address: dto.deadmanAddress,
			deadman_age: dto.deadmanAge,
			deadman_birthday: formatYmdToDmy(dto.deadmanBirthday),
			deadman_death_day: formatYmdToDmy(dto.deadmanDeathDay),
			services: servicesForTemplate,
			products: productsForTemplate
		}

		try {
			doc.render(data)
		} catch (e: any) {
			throw new InternalServerErrorException({
				message: 'Ошибка подстановки данных в шаблон',
				details: e?.message
			})
		}

		// eslint-disable-next-line @typescript-eslint/no-unsafe-call
		const outBuf = doc
			.getZip()
			.generate({ type: 'nodebuffer', compression: 'DEFLATE' })

		const storageName = `doc_${randomUUID()}.docx` // безопасное имя для хранения
		const storagePath = path.join(this.outDir, storageName)

		await fs.writeFile(storagePath, outBuf)

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
						clientPassport: dto.clientPassport,
						price: totalPrice,
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
						sizeBytes: outBuf.byteLength,
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
				await fs.unlink(storagePath)
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

	async getDownloadInfo(id: string) {
		const contract = await this.prisma.contract.findUnique({
			where: { id },
			include: {
				document: true
			}
		})
		if (!contract) throw new NotFoundException('Договор не найден')
		if (!contract.document) throw new NotFoundException('Документ не найден')

		const filePath = path.join(this.outDir, contract.document.storageName)

		return {
			filePath,
			mimeType: contract.document.mimeType,
			downloadName: contract.document.originalName
		}
	}

	async findAll() {
		return this.prisma.contract.findMany({
			orderBy: {
				updatedAt: 'asc'
			},
			include: {
				services: true,
				products: true,
				document: {
					select: {
						id: true,
						originalName: true,
						createdAt: true
					}
				}
			}
		})
	}

	async findOne(id: string) {
		const contract = await this.prisma.contract.findUnique({
			where: { id },
			include: {
				services: true,
				products: true,
				document: {
					select: {
						id: true,
						originalName: true,
						createdAt: true
					}
				}
			}
		})

		if (!contract) throw new NotFoundException('Договор не найден')

		return contract
	}

	async update(id: string, updateContractDto: UpdateContractDto) {
		const data: Prisma.ContractUpdateInput = { ...updateContractDto }

		if (updateContractDto.deadmanBirthday) {
			data.deadmanBirthday = toDateTime(
				updateContractDto.deadmanBirthday,
				'deadmanBirthday'
			)
		}
		if (updateContractDto.deadmanDeathDay) {
			data.deadmanDeathDay = toDateTime(
				updateContractDto.deadmanDeathDay,
				'deadmanDeathDay'
			)
		}

		return this.prisma.contract.update({
			where: {
				id: id
			},
			data
		})
	}

	async remove(id: string) {
		const contract = await this.prisma.contract.findUnique({
			where: { id },
			include: { document: true }
		})
		if (!contract) throw new NotFoundException('Договор не найден')

		if (contract.document) {
			const filePath = path.join(this.outDir, contract.document.storageName)
			try {
				await fs.unlink(filePath)
			} catch (error: any) {
				if (error?.code !== 'ENOENT') {
					throw new InternalServerErrorException(
						'Не удалось удалить файл документа'
					)
				}
			}
		}

		return this.prisma.$transaction(async tx => {
			await tx.contractService.deleteMany({
				where: { contractId: id }
			})
			await tx.contractProduct.deleteMany({
				where: { contractId: id }
			})
			if (contract.document) {
				await tx.document.delete({
					where: { id: contract.document.id }
				})
			}
			return tx.contract.delete({ where: { id } })
		})
	}
}
