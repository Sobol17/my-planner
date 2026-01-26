import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { randomUUID } from 'crypto'
import * as fs from 'fs/promises'
import * as path from 'path'

@Injectable()
export class FileStorageService {
	private readonly baseDir: string

	constructor(private readonly configService: ConfigService) {
		const configured = this.configService.get<string>('FILE_STORAGE_BASE_DIR')
		this.baseDir =
			configured && configured.trim().length > 0
				? configured
				: path.join(process.cwd(), 'storage', 'generated')
	}

	async save(buffer: Buffer, options: { ext: string }) {
		await fs.mkdir(this.baseDir, { recursive: true })
		const ext = options.ext.replace(/^\./, '')
		const storageName = `doc_${randomUUID()}.${ext}`
		const storagePath = path.join(this.baseDir, storageName)
		await fs.writeFile(storagePath, buffer)
		return { storageName, storagePath, sizeBytes: buffer.byteLength }
	}

	resolvePath(storageName: string) {
		return path.join(this.baseDir, storageName)
	}

	async remove(filePath: string) {
		try {
			await fs.unlink(filePath)
		} catch (error: any) {
			if (error?.code !== 'ENOENT') throw error
		}
	}
}
