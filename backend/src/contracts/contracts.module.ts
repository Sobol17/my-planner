import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaService } from '../prisma.service'
import { ContractsController } from './contracts.controller'
import { ContractsService } from './contracts.service'
import { ContractCalculator } from './domain/contract-calculator'
import { ContractTemplateMapper } from './domain/contract-template.mapper'
import { DocxTemplateService } from './infrastructure/docx-template.service'
import { FileStorageService } from './infrastructure/file-storage.service'
import { CreateContractUseCase } from './use-cases/create-contract.usecase'

@Module({
	imports: [ConfigModule],
	controllers: [ContractsController],
	providers: [
		ContractsService,
		CreateContractUseCase,
		ContractCalculator,
		ContractTemplateMapper,
		DocxTemplateService,
		FileStorageService,
		PrismaService
	]
})
export class ContractsModule {}
