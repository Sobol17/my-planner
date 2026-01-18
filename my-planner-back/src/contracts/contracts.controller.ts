import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	Res,
	UsePipes,
	ValidationPipe,
	HttpCode
} from '@nestjs/common'
import { Response } from 'express'
import { ContractsService } from './contracts.service'
import { UpdateContractDto } from './dto/update-contract.dto'
import * as fs from 'fs'
import { CreateContractDto } from './dto/create-contract.dto'
import { Auth } from '../auth/decorators/auth.decorator'

@Controller('contracts')
export class ContractsController {
	constructor(private readonly contractsService: ContractsService) {}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post()
	@Auth()
	async createContract(@Body() dto: CreateContractDto) {
		return this.contractsService.createContract(dto)
	}

	@Get(':id/download')
	@Auth()
	async download(@Param('id') id: string, @Res() res: Response) {
		const info = await this.contractsService.getDownloadInfo(id)

		res.setHeader('Content-Type', info.mimeType)
		res.setHeader(
			'Content-Disposition',
			`attachment; filename="${info.downloadName}"`
		)

		fs.createReadStream(info.filePath).pipe(res)
	}

	@Get()
	@Auth()
	findAll() {
		return this.contractsService.findAll()
	}

	@Get(':id')
	@Auth()
	findOne(@Param('id') id: string) {
		return this.contractsService.findOne(id)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Patch(':id')
	@Auth()
	update(
		@Param('id') id: string,
		@Body() updateContractDto: UpdateContractDto
	) {
		return this.contractsService.update(id, updateContractDto)
	}

	@HttpCode(200)
	@Delete(':id')
	@Auth()
	remove(@Param('id') id: string) {
		return this.contractsService.remove(id)
	}
}
