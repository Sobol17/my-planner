import { Controller, Get, Query } from '@nestjs/common'
import { AnalyticsService } from './analytics.service'
import { AnalyticsQueryDto } from './dto/analytics.dto'
import { Auth } from '../auth/decorators/auth.decorator'

@Controller('analytics')
export class AnalyticsController {
	constructor(private readonly analyticsService: AnalyticsService) {}

	@Get()
	@Auth()
	getStats(@Query() query: AnalyticsQueryDto) {
		return this.analyticsService.getStats(query)
	}
}
