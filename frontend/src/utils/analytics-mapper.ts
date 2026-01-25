import { AnalyticsDto, IAnalytics } from '@/types/analytics.types'

export function analyticsMapper(rawObject: AnalyticsDto): IAnalytics {
	return {
		contractsCount: rawObject.contracts_count,
		turnover: rawObject.turnover
	}
}
