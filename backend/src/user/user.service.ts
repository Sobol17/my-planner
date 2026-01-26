import { BadGatewayException, Injectable } from '@nestjs/common'
import { hash } from 'argon2'
import { AuthDto } from 'src/auth/dto/auth.dto'
import { PrismaService } from 'src/prisma.service'
import { UserDto } from './dto/user.dto.js'

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {}

	getById(id: string) {
		return this.prisma.user.findUnique({
			where: { id }
		})
	}

	getByPhone(phone: string) {
		return this.prisma.user.findUnique({
			where: { phone }
		})
	}

	async getProfileWithStats(id: string) {
		const profile = await this.getById(id)

		if (!profile) throw new BadGatewayException('User profile not found')

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password, ...profileWithOutPassword } = profile

		return {
			user: profileWithOutPassword
		}
	}

	async create(dto: AuthDto) {
		const user = {
			phone: dto.phone,
			name: '',
			password: await hash(dto.password)
		}

		return this.prisma.user.create({
			data: user
		})
	}

	async update(id: string, dto: UserDto) {
		let data = dto

		if (dto.password) {
			data = { ...dto, password: await hash(dto.password) }
		}

		return this.prisma.user.update({
			where: {
				id
			},
			data,
			select: {
				name: true,
				phone: true
			}
		})
	}
}
