import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { TimerRoundDto, TimerSessionDto } from './dto/timer.dto'

@Injectable()
export class TimerService {
	constructor(private prisma: PrismaService) {}

	async getTodaySession(userId: string) {
		const today = new Date().toISOString().split('T')[0]

		return this.prisma.pomodoroSession.findFirst({
			where: {
				createdAt: {
					gte: new Date(today)
				},
				userId: userId
			},
			include: {
				pomodoroRounds: {
					orderBy: {
						id: 'asc'
					}
				}
			}
		})
	}

	async create(userId: string) {
		const todaySession = await this.getTodaySession(userId)

		if (todaySession) return todaySession

		// TODO: отрефакторить и перенести логику в user.service
		const user = await this.prisma.user.findUnique({
			where: {
				id: userId
			},
			select: {
				intervalsCount: true
			}
		})

		if (!user) throw new NotFoundException('User not found')

		if (!user.intervalsCount)
			throw new NotFoundException(
				'User doesn`t has a pomodoro session intervals'
			)

		return this.prisma.pomodoroSession.create({
			data: {
				pomodoroRounds: {
					createMany: {
						data: Array.from({ length: user.intervalsCount }, () => ({
							totalSeconds: 0
						}))
					}
				},
				user: {
					connect: {
						id: userId
					}
				}
			},
			include: {
				pomodoroRounds: true
			}
		})
	}

	async update(
		dto: Partial<TimerSessionDto>,
		sessionId: string,
		userId: string
	) {
		return this.prisma.pomodoroSession.update({
			where: {
				id: sessionId,
				userId
			},
			data: dto
		})
	}

	async updateRound(dto: Partial<TimerRoundDto>, roundId: string) {
		return this.prisma.pomodoroRound.update({
			where: {
				id: roundId
			},
			data: dto
		})
	}

	async deleteSession(sessionId: string, userId: string) {
		return this.prisma.pomodoroSession.delete({
			where: {
				id: sessionId,
				userId
			}
		})
	}
}
