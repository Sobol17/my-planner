import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { CreateArticleDto } from './dto/create-article.dto'
import { UpdateArticleDto } from './dto/update-article.dto'
import { ArticleImageStorageService } from './infrastructure/article-image-storage.service'

interface UploadedImageFile {
	buffer: Buffer
	originalname: string
	mimetype: string
	size: number
}

@Injectable()
export class ArticlesService {
	private readonly localImagePathPrefix = '/api/client/articles/images/'

	constructor(
		private prisma: PrismaService,
		private articleImageStorage: ArticleImageStorageService
	) {}

	async create(
		data: CreateArticleDto,
		image?: UploadedImageFile,
		baseUrl?: string
	) {
		let imageUrl = data.imageUrl

		if (image) {
			const { storageName } = await this.articleImageStorage.save(image.buffer, {
				originalName: image.originalname,
				mimeType: image.mimetype
			})
			const safeBaseUrl = baseUrl && baseUrl.length > 0 ? baseUrl : 'http://localhost:4200'
			imageUrl = `${safeBaseUrl}${this.localImagePathPrefix}${storageName}`
		}

		return this.prisma.article.create({
			data: {
				...data,
				imageUrl: imageUrl || null
			}
		})
	}

	async findAll() {
		return this.prisma.article.findMany({
			orderBy: {
				updatedAt: 'desc'
			}
		})
	}

	async findOne(articleId: string) {
		return this.prisma.article.findUnique({
			where: {
				id: articleId
			}
		})
	}

	async update(id: string, data: UpdateArticleDto) {
		const existing = await this.prisma.article.findUnique({ where: { id } })
		if (!existing) throw new NotFoundException('Статья не найдена')

		const updated = await this.prisma.article.update({
			where: {
				id
			},
			data: {
				...data,
				...(data.imageUrl !== undefined ? { imageUrl: data.imageUrl || null } : {})
			}
		})

		const previousStorageName = this.extractStorageName(existing.imageUrl)
		const nextStorageName = this.extractStorageName(updated.imageUrl)

		if (previousStorageName && previousStorageName !== nextStorageName) {
			await this.articleImageStorage.remove(previousStorageName)
		}

		return updated
	}

	async delete(articleId: string) {
		const article = await this.prisma.article.findUnique({
			where: { id: articleId }
		})

		if (!article) throw new NotFoundException('Статья не найдена')

		const storageName = this.extractStorageName(article.imageUrl)
		if (storageName) {
			await this.articleImageStorage.remove(storageName)
		}

		return this.prisma.article.delete({
			where: {
				id: articleId
			}
		})
	}

	async getImagePath(storageName: string) {
		const exists = await this.articleImageStorage.exists(storageName)

		if (!exists) throw new NotFoundException('Изображение не найдено')

		return this.articleImageStorage.resolvePath(storageName)
	}

	private extractStorageName(imageUrl?: string | null) {
		if (!imageUrl) return null

		const rawPath = this.extractPathname(imageUrl)
		if (!rawPath.startsWith(this.localImagePathPrefix)) return null

		const storageName = rawPath.slice(this.localImagePathPrefix.length)
		if (!storageName || storageName.includes('/') || storageName.includes('\\')) {
			return null
		}

		return storageName
	}

	private extractPathname(value: string) {
		try {
			return new URL(value).pathname
		} catch {
			return value.split('?')[0]
		}
	}
}
