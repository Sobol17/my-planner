import {
	Injectable,
	InternalServerErrorException,
	NotFoundException
} from '@nestjs/common'
import type { Prisma } from '../generated/prisma/client.js'
import { PrismaService } from '../prisma.service'
import { CreateContractUseCase } from './use-cases/create-contract.usecase'
import { CreateContractDto } from './dto/create-contract.dto'
import { UpdateContractDto } from './dto/update-contract.dto'
import { toDateTime } from './domain/validators'
import { FileStorageService } from './infrastructure/file-storage.service'

@Injectable()
export class ContractsService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly createContract: CreateContractUseCase,
		private readonly fileStorage: FileStorageService
	) {}

	create(dto: CreateContractDto) {
		return this.createContract.execute(dto)
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

		const filePath = this.fileStorage.resolvePath(
			contract.document.storageName
		)

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
			const filePath = this.fileStorage.resolvePath(
				contract.document.storageName
			)
			try {
				await this.fileStorage.remove(filePath)
			} catch {
				throw new InternalServerErrorException(
					'Не удалось удалить файл документа'
				)
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
