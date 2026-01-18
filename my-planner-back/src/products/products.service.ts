import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../prisma.service'

@Injectable()
export class ProductsService {
	constructor(private prisma: PrismaService) {}

	async create(data: CreateProductDto) {
		return this.prisma.product.create({
			data: data
		})
	}

	async findAll() {
		return this.prisma.product.findMany({
			orderBy: {
				updatedAt: 'asc'
			}
		})
	}

	async findOne(serviceId: string) {
		return this.prisma.product.findUnique({
			where: {
				id: serviceId
			}
		})
	}

	async update(id: string, data: UpdateProductDto) {
		return this.prisma.product.update({
			where: {
				id: id
			},
			data: data
		})
	}

	async delete(serviceId: string) {
		return this.prisma.product.delete({
			where: {
				id: serviceId
			}
		})
	}
}
