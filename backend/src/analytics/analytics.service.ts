import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { AnalyticsQueryDto, AnalyticsStatsDto } from './dto/analytics.dto'

const parseRangeDate = (value: string, fieldLabel: string, isEnd: boolean) => {
	const match = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(value)
	if (!match) {
		throw new BadRequestException(`Неверный формат даты для ${fieldLabel}`)
	}
	const [, day, month, year] = match
	const date = new Date(
		Date.UTC(
			Number(year),
			Number(month) - 1,
			Number(day),
			isEnd ? 23 : 0,
			isEnd ? 59 : 0,
			isEnd ? 59 : 0,
			isEnd ? 999 : 0
		)
	)
	if (
		Number.isNaN(date.getTime()) ||
		date.getUTCFullYear() !== Number(year) ||
		date.getUTCMonth() + 1 !== Number(month) ||
		date.getUTCDate() !== Number(day)
	) {
		throw new BadRequestException(`Неверная дата для ${fieldLabel}`)
	}
	return date
}

@Injectable()
export class AnalyticsService {
	constructor(private readonly prisma: PrismaService) {}

	async getStats(query: AnalyticsQueryDto): Promise<AnalyticsStatsDto> {
		const start = parseRangeDate(query.startDate, 'startDate', false)
		const end = parseRangeDate(query.endDate, 'endDate', true)

		if (end < start) {
			throw new BadRequestException('Дата окончания меньше даты начала периода')
		}

		const stats = await this.prisma.contract.aggregate({
			where: {
				createdAt: {
					gte: start,
					lte: end
				}
			},
			_count: { _all: true },
			_sum: { price: true }
		})

		return {
			contractsCount: stats._count._all,
			turnover: stats._sum.price ?? 0
		}
	}
}
