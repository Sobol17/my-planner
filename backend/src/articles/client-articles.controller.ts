import { Controller, Get, Param, Res } from '@nestjs/common'
import { ArticlesService } from './articles.service'
import { Response } from 'express'

@Controller('client/articles')
export class ClientArticlesController {
	constructor(private readonly articlesService: ArticlesService) {}

	@Get()
	async getAll() {
		return this.articlesService.findAll()
	}

	@Get('images/:storageName')
	async getImage(
		@Param('storageName') storageName: string,
		@Res() res: Response
	) {
		const filePath = await this.articlesService.getImagePath(storageName)
		res.sendFile(filePath)
	}

	@Get(':id')
	async getOne(@Param('id') id: string) {
		return this.articlesService.findOne(id)
	}
}
