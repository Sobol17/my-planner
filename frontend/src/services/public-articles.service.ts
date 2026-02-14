import 'server-only'
import axios from 'axios'

import { ArticleDto, PublicArticle } from '@/types/articles.types'

import { extractArticleIdFromSlug, makeArticleSlug } from '@/utils/article-slug'

const API_BASE_URL =
	process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4200/api'

const serverAxios = axios.create({
	baseURL: API_BASE_URL,
	timeout: 10000,
	headers: {
		'Content-Type': 'application/json'
	}
})

const mapArticle = (dto: ArticleDto): PublicArticle => ({
	id: dto.id,
	slug: makeArticleSlug(dto.title, dto.id),
	title: dto.title,
	excerpt: dto.excerpt,
	tag: dto.tag,
	date: dto.date,
	readTime: dto.read_time,
	contentHtml: dto.content_html,
	imageUrl: dto.image_url,
	createdAt: dto.created_at,
	updatedAt: dto.updated_at
})

export async function getPublicArticles(): Promise<PublicArticle[]> {
	try {
		const response = await serverAxios.get<ArticleDto[]>('/client/articles')
		const data = response.data

		if (!Array.isArray(data)) return []

		return data.map(item => mapArticle(item))
	} catch (error) {
		if (process.env.NODE_ENV !== 'production') {
			console.error('Failed to load public articles', error)
		}
		return []
	}
}

export const getPublicArticleBySlug = async (slug: string) => {
	const articles = await getPublicArticles()
	const articleId = extractArticleIdFromSlug(slug)

	if (articleId) return articles.find(item => item.id === articleId)

	return articles.find(item => item.slug === slug)
}
