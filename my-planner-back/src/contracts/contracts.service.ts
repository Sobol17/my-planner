import {
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
			comment: dto.comment ?? ''
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

		const created = await this.prisma.$transaction(async (tx) => {
			const contract = await tx.contract.create({
				data: {
					contractNumber: dto.contractNumber,
					contractDate: dto.contractDate,
					clientFullName: dto.clientFullName,
					clientPassport: dto.clientPassport,
					price: dto.price,
					comment: dto.comment
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
		return this.prisma.contract.update({
			where: {
				id: id
			},
			data: updateContractDto
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
			if (contract.document) {
				await tx.document.delete({
					where: { id: contract.document.id }
				})
			}
			return tx.contract.delete({ where: { id } })
		})
	}
}
