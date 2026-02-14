import { ArticleCreateDto, ArticleDto } from '@/types/articles.types'

import { axiosWithAuth } from '@/api/interceptors'

class ArticlesService {
	private BASE_URL = '/lk/articles'

	async getAll(): Promise<ArticleDto[]> {
		const res = await axiosWithAuth.get<ArticleDto[]>(this.BASE_URL)
		return res.data
	}

	async getById(id: string): Promise<ArticleDto> {
		const res = await axiosWithAuth.get<ArticleDto>(`${this.BASE_URL}/${id}`)
		return res.data
	}

	async create(data: FormData): Promise<ArticleDto> {
		const res = await axiosWithAuth.post<ArticleDto>(this.BASE_URL, data)
		return res.data
	}

	async update(id: string, data: ArticleCreateDto): Promise<ArticleDto> {
		const res = await axiosWithAuth.put<ArticleDto>(`${this.BASE_URL}/${id}`, data)
		return res.data
	}

	async delete(id: string): Promise<ArticleDto> {
		const res = await axiosWithAuth.delete<ArticleDto>(`${this.BASE_URL}/${id}`)
		return res.data
	}
}

export const articlesService = new ArticlesService()
