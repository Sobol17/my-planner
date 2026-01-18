import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service'
import { CreateServiceDto } from './dto/create-service.dto'
import { UpdateServiceDto } from './dto/update-service.dto'

@Injectable()
export class ServicesService {
	constructor(private prisma: PrismaService) {}

	async create(data: CreateServiceDto) {
		return this.prisma.service.create({
			data: data
		})
	}

	async findAll() {
		return this.prisma.service.findMany({
			orderBy: {
				updatedAt: 'asc'
			}
		})
	}

	async findOne(serviceId: string) {
		return this.prisma.service.findUnique({
			where: {
				id: serviceId
			}
		})
	}

	async update(id: string, data: UpdateServiceDto) {
		return this.prisma.service.update({
			where: {
				id: id
			},
			data: data
		})
	}

	async delete(serviceId: string) {
		return this.prisma.service.delete({
			where: {
				id: serviceId
			}
		})
	}
}
