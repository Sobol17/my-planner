import {
	Controller,
	Get,
	Post,
	Body,
	Param,
	Delete,
	HttpCode,
	ValidationPipe,
	UsePipes,
	Put
} from '@nestjs/common'
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { Auth } from '../auth/decorators/auth.decorator'
import { UpdateServiceDto } from './dto/update-service.dto'

@Controller('services')
export class ServicesController {
	constructor(private readonly servicesService: ServicesService) {}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post()
	@Auth()
	async create(@Body() dto: CreateServiceDto) {
		return this.servicesService.create(dto)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put(':id')
	@Auth()
	async update(@Body() dto: UpdateServiceDto, @Param('id') id: string) {
		return this.servicesService.update(id, dto)
	}

	@Get()
	@Auth()
	async getAll() {
		return this.servicesService.findAll()
	}

	@Get(':id')
	@Auth()
	async getOne(@Param('id') id: string) {
		return this.servicesService.findOne(id)
	}

	@HttpCode(200)
	@Delete(':id')
	@Auth()
	async delete(@Param('id') id: string) {
		return this.servicesService.delete(id)
	}
}
