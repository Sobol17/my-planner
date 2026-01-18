import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	NotFoundException
} from '@nestjs/common'
import { CreateContractDto } from './dto/create-contract.dto'
import { UpdateContractDto } from './dto/update-contract.dto'
import * as path from 'path'
import * as fs from 'fs/promises'
import Docxtemplater from 'docxtemplater'
import PizZip from 'pizzip'
import { randomUUID } from 'crypto'
import { PrismaService } from '../prisma.service'
import type { Prisma } from '../generated/prisma/client.js'

const toDateTime = (value: string, fieldLabel: string) => {
	const isDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(value)
	const date = new Date(isDateOnly ? `${value}T00:00:00.000Z` : value)
	if (Number.isNaN(date.getTime())) {
		throw new BadRequestException(`Неверный формат даты для ${fieldLabel}`)
	}
	return date
}

@Injectable()
export class ContractsService {
	constructor(private readonly prisma: PrismaService) {}

	private templatePath = path.join(
		process.cwd(),
		'templates',
		'contract-template.docx'
	)
	private outDir = path.join(process.cwd(), 'storage', 'generated')

	async createContract(dto: CreateContractDto) {
		const deadmanBirthday = toDateTime(dto.deadmanBirthday, 'deadmanBirthday')
		const deadmanDeathDay = toDateTime(dto.deadmanDeathDay, 'deadmanDeathDay')

		const serviceIds = dto.services.map((item) => item.serviceId)
		const productIds = dto.products.map((item) => item.productId)

		const uniqueServiceIds = [...new Set(serviceIds)]
		const uniqueProductIds = [...new Set(productIds)]

		if (uniqueServiceIds.length !== serviceIds.length) {
			throw new BadRequestException('Услуги должны быть уникальными')
		}
		if (uniqueProductIds.length !== productIds.length) {
			throw new BadRequestException('Товары должны быть уникальными')
		}

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
			contract_date: dto.contractDate,
			client_full_name: dto.clientFullName,
			client_passport: dto.clientPassport,
			price: dto.price,
			comment: dto.comment ?? '',
			deadman_address: dto.deadmanAddress,
			deadman_age: dto.deadmanAge,
			deadman_birthday: dto.deadmanBirthday,
			deadman_death_day: dto.deadmanDeathDay
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
			created = await this.prisma.$transaction(async (tx) => {
				const [services, products] = await Promise.all([
					tx.service.findMany({
						where: { id: { in: uniqueServiceIds } },
						select: { id: true, name: true, defaultPrice: true }
					}),
					tx.product.findMany({
						where: { id: { in: uniqueProductIds } },
						select: { id: true, name: true, price: true }
					})
				])

				if (services.length !== uniqueServiceIds.length) {
					const found = new Set(services.map((service) => service.id))
					const missing = uniqueServiceIds.filter((id) => !found.has(id))
					throw new NotFoundException(
						`Не найдены услуги: ${missing.join(', ')}`
					)
				}

				if (products.length !== uniqueProductIds.length) {
					const found = new Set(products.map((product) => product.id))
					const missing = uniqueProductIds.filter((id) => !found.has(id))
					throw new NotFoundException(
						`Не найдены товары: ${missing.join(', ')}`
					)
				}

				const serviceById = new Map(
					services.map((service) => [service.id, service])
				)
				const productById = new Map(
					products.map((product) => [product.id, product])
				)

				const servicesForCreate = dto.services.map((item) => {
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

				const productsForCreate = dto.products.map((item) => {
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

				const contract = await tx.contract.create({
					data: {
						contractNumber: dto.contractNumber,
						contractDate: dto.contractDate,
						clientFullName: dto.clientFullName,
						clientPassport: dto.clientPassport,
						price: dto.price,
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

		return this.prisma.$transaction(async (tx) => {
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
