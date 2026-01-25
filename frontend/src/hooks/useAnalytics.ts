import { useQuery } from '@tanstack/react-query'

import { analyticsService } from '@/services/analytics.service'

export function useAnalytics(startDate?: string, endDate?: string) {
	const { data, isLoading, isSuccess } = useQuery({
		queryKey: ['analytics', startDate, endDate],
		queryFn: () =>
			analyticsService.getAnalytics(startDate ?? '', endDate ?? ''),
		enabled: Boolean(startDate && endDate)
	})

	return { data, isLoading, isSuccess }
}
