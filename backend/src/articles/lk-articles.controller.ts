import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	Req,
	UploadedFile,
	UsePipes,
	ValidationPipe,
	UseInterceptors,
	BadRequestException
} from '@nestjs/common'
import { Auth } from '../auth/decorators/auth.decorator'
import { ArticlesService } from './articles.service'
import { CreateArticleDto } from './dto/create-article.dto'
import { UpdateArticleDto } from './dto/update-article.dto'
import { FileInterceptor } from '@nestjs/platform-express'
import { Request } from 'express'

interface UploadedImageFile {
	buffer: Buffer
	originalname: string
	mimetype: string
	size: number
}

@Controller('lk/articles')
export class LkArticlesController {
	constructor(private readonly articlesService: ArticlesService) {}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post()
	@UseInterceptors(
		FileInterceptor('image', {
			limits: {
				fileSize: 10 * 1024 * 1024
			},
			fileFilter: (_req, file, callback) => {
				if (!file.mimetype?.startsWith('image/')) {
					return callback(
						new BadRequestException('Разрешены только изображения'),
						false
					)
				}

				return callback(null, true)
			}
		})
	)
	@Auth()
	async create(
		@Body() dto: CreateArticleDto,
		@UploadedFile() image: UploadedImageFile | undefined,
		@Req() req: Request
	) {
		const baseUrl = `${req.protocol}://${req.get('host')}`
		return this.articlesService.create(dto, image, baseUrl)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put(':id')
	@Auth()
	async update(@Body() dto: UpdateArticleDto, @Param('id') id: string) {
		return this.articlesService.update(id, dto)
	}

	@Get()
	@Auth()
	async getAll() {
		return this.articlesService.findAll()
	}

	@Get(':id')
	@Auth()
	async getOne(@Param('id') id: string) {
		return this.articlesService.findOne(id)
	}

	@HttpCode(200)
	@Delete(':id')
	@Auth()
	async delete(@Param('id') id: string) {
		return this.articlesService.delete(id)
	}
}
