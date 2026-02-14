import { IBase } from './root.types'

export interface ArticleDto extends IBase {
	id: string
	title: string
	excerpt: string
	tag: string
	date: string
	read_time: string
	content_html: string
	image_url?: string
}

export interface ArticleCreateDto {
	title: string
	excerpt: string
	tag: string
	date: string
	read_time: string
	content_html: string
	image_url?: string
}

export interface PublicArticle {
	id: string
	slug: string
	title: string
	excerpt: string
	tag: string
	date: string
	readTime: string
	contentHtml: string
	imageUrl?: string
	createdAt: string
	updatedAt?: string
}
