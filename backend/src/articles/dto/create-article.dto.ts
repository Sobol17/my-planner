import { IsOptional, IsString } from 'class-validator'

export class CreateArticleDto {
	@IsString()
	title: string

	@IsString()
	excerpt: string

	@IsString()
	tag: string

	@IsString()
	date: string

	@IsString()
	readTime: string

	@IsString()
	contentHtml: string

	@IsOptional()
	@IsString()
	imageUrl?: string
}
