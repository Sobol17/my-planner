import { IsString, Matches } from 'class-validator'

export class AnalyticsQueryDto {
	@IsString()
	@Matches(/^\d{2}\.\d{2}\.\d{4}$/, {
		message: 'startDate должен быть в формате DD.MM.YYYY'
	})
	startDate: string

	@IsString()
	@Matches(/^\d{2}\.\d{2}\.\d{4}$/, {
		message: 'endDate должен быть в формате DD.MM.YYYY'
	})
	endDate: string
}

export class AnalyticsStatsDto {
	contractsCount: number
	turnover: number
}
