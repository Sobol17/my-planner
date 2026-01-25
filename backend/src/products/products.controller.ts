import { Controller, Get, Post, Body, Param, Delete, UsePipes, ValidationPipe, HttpCode, Put } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Auth } from '../auth/decorators/auth.decorator'

@Controller('products')
export class ProductsController {
	constructor(private readonly productsService: ProductsService) {}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post()
	@Auth()
	async create(@Body() dto: CreateProductDto) {
		return this.productsService.create(dto)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put(':id')
	@Auth()
	async update(@Body() dto: UpdateProductDto, @Param('id') id: string) {
		return this.productsService.update(id, dto)
	}

	@Get()
	@Auth()
	async getAll() {
		return this.productsService.findAll()
	}

	@Get(':id')
	@Auth()
	async getOne(@Param('id') id: string) {
		return this.productsService.findOne(id)
	}

	@HttpCode(200)
	@Delete(':id')
	@Auth()
	async delete(@Param('id') id: string) {
		return this.productsService.delete(id)
	}
}
