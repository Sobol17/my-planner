import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

import { ArticleDto } from '@/types/articles.types'

import { articlesService } from '@/services/articles.service'

export function useArticles() {
	const { data, isLoading, error } = useQuery({
		queryKey: ['articles'],
		queryFn: () => articlesService.getAll()
	})

	const [items, setItems] = useState<ArticleDto[]>([])

	useEffect(() => {
		setItems(data ?? [])
	}, [data])

	return { items, setItems, isLoading, error }
}
