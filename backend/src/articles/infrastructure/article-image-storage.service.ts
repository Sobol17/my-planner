import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { randomUUID } from 'crypto'
import * as fs from 'fs/promises'
import * as path from 'path'

@Injectable()
export class ArticleImageStorageService {
	private readonly baseDir: string

	constructor(private readonly configService: ConfigService) {
		const configured = this.configService.get<string>(
			'ARTICLE_IMAGE_STORAGE_BASE_DIR'
		)

		this.baseDir =
			configured && configured.trim().length > 0
				? configured
				: path.join(process.cwd(), 'storage', 'articles')
	}

	async save(buffer: Buffer, options: { originalName?: string; mimeType?: string }) {
		await fs.mkdir(this.baseDir, { recursive: true })

		const ext = this.resolveExtension(options)
		const storageName = `article_${randomUUID()}.${ext}`
		const storagePath = this.resolvePath(storageName)

		await fs.writeFile(storagePath, buffer)

		return { storageName, storagePath, sizeBytes: buffer.byteLength }
	}

	resolvePath(storageName: string) {
		this.ensureValidStorageName(storageName)
		return path.join(this.baseDir, storageName)
	}

	async exists(storageName: string) {
		try {
			await fs.access(this.resolvePath(storageName))
			return true
		} catch {
			return false
		}
	}

	async remove(storageName: string) {
		try {
			await fs.unlink(this.resolvePath(storageName))
		} catch (error: any) {
			if (error?.code !== 'ENOENT') throw error
		}
	}

	private ensureValidStorageName(storageName: string) {
		const isSafe = /^[a-zA-Z0-9._-]+$/.test(storageName)
		if (!isSafe) {
			throw new BadRequestException('Invalid image file name')
		}
	}

	private resolveExtension(options: { originalName?: string; mimeType?: string }) {
		const fromName = options.originalName
			? path.extname(options.originalName).replace(/^\./, '')
			: ''
		if (fromName) return fromName

		switch (options.mimeType) {
			case 'image/jpeg':
				return 'jpg'
			case 'image/png':
				return 'png'
			case 'image/webp':
				return 'webp'
			case 'image/gif':
				return 'gif'
			case 'image/svg+xml':
				return 'svg'
			default:
				return 'bin'
		}
	}
}
