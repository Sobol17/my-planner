import { Injectable, InternalServerErrorException } from '@nestjs/common'
import Docxtemplater from 'docxtemplater'
import * as fs from 'fs/promises'
import PizZip from 'pizzip'

@Injectable()
export class DocxTemplateService {
	async render(templatePath: string, data: any): Promise<Buffer> {
		const templateBuf = await fs.readFile(templatePath)

		let doc: Docxtemplater
		try {
			const zip = new PizZip(templateBuf)
			doc = new Docxtemplater(zip, {
				paragraphLoop: true,
				linebreaks: true,
				delimiters: { start: '{{', end: '}}' }
			})
		} catch {
			throw new InternalServerErrorException(
				'Не удалось прочитать DOCX-шаблон'
			)
		}

		try {
			doc.render(data)
		} catch (error: any) {
			throw new InternalServerErrorException({
				message: 'Ошибка подстановки данных в DOCX шаблон',
				details: error?.message
			})
		}

		return doc.getZip().generate({ type: 'nodebuffer', compression: 'DEFLATE' })
	}
}
