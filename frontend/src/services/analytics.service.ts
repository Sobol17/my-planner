import { AnalyticsDto, IAnalytics } from '@/types/analytics.types'

import { analyticsMapper } from '@/utils/analytics-mapper'

import { axiosWithAuth } from '@/api/interceptors'

class AnalyticsService {
	private BASE_URL = '/analytics'

	async getAnalytics(startDate: string, endDate: string): Promise<IAnalytics> {
		const res = await axiosWithAuth.get<AnalyticsDto>(this.BASE_URL, {
			params: { startDate, endDate }
		})
		return analyticsMapper(res.data)
	}
}

export const analyticsService = new AnalyticsService()
