'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { ArticleCreateDto, ArticleDto } from '@/types/articles.types'

import { DASHBOARD_PAGES } from '@/config/pages-url.config'

import { articlesService } from '@/services/articles.service'

export type ArticleFormValues = ArticleCreateDto

interface UseArticleDetailsOptions {
	id: string
}

const getTodayIsoDate = () => {
	const today = new Date()
	today.setHours(12, 0, 0, 0)
	return today.toISOString()
}

const EMPTY_VALUES: ArticleFormValues = {
	title: '',
	excerpt: '',
	tag: '',
	date: getTodayIsoDate(),
	read_time: '',
	content_html: '',
	image_url: ''
}

export function useArticleDetails({ id }: UseArticleDetailsOptions) {
	const isCreate = id === 'new' || id === 'create'
	const router = useRouter()
	const queryClient = useQueryClient()

	const {
		register,
		handleSubmit,
		control,
		reset,
		setValue,
		watch,
		formState: { errors }
	} = useForm<ArticleFormValues>({
		mode: 'onChange',
		defaultValues: EMPTY_VALUES
	})

	const {
		data: article,
		isLoading,
		isError
	} = useQuery({
		queryKey: ['article', id],
		queryFn: () => articlesService.getById(id),
		enabled: !isCreate
	})

	useEffect(() => {
		if (!article) return

		const payload: ArticleFormValues = {
			title: article.title,
			excerpt: article.excerpt,
			tag: article.tag,
			date: article.date || getTodayIsoDate(),
			read_time: article.read_time,
			content_html: article.content_html,
			image_url: article.image_url || ''
		}

		reset(payload)
	}, [article, reset])

	const { mutate: createArticle, isPending: isCreating } = useMutation({
		mutationKey: ['create article'],
		mutationFn: (payload: FormData) => articlesService.create(payload),
		onSuccess: () => {
			toast.success('Статья создана')
			queryClient.invalidateQueries({ queryKey: ['articles'] })
			router.push(DASHBOARD_PAGES.ARTICLES)
		},
		onError: () => {
			toast.error('Не удалось создать статью')
		}
	})

	const { mutate: updateArticle, isPending: isUpdating } = useMutation({
		mutationKey: ['update article', id],
		mutationFn: (payload: ArticleCreateDto) =>
			articlesService.update(id, payload),
		onSuccess: (updated: ArticleDto) => {
			toast.success('Статья обновлена')
			queryClient.invalidateQueries({ queryKey: ['articles'] })
			queryClient.setQueryData(['article', id], updated)
		},
		onError: () => {
			toast.error('Не удалось обновить статью')
		}
	})

	const onSubmit = (data: ArticleFormValues, imageFile?: File | null) => {
		if (isCreate) {
			if (!imageFile) {
				toast.error('Добавьте изображение статьи')
				return
			}

			const payload = new FormData()

			payload.append('title', data.title)
			payload.append('excerpt', data.excerpt)
			payload.append('tag', data.tag)
			payload.append('date', data.date)
			payload.append('readTime', data.read_time)
			payload.append('contentHtml', data.content_html)
			payload.append('image', imageFile)

			createArticle(payload)
			return
		}
		updateArticle(data)
	}

	return {
		isCreate,
		isLoading,
		isError,
		isPending: isCreating || isUpdating,
		register,
		handleSubmit,
		control,
		setValue,
		watch,
		errors,
		onSubmit
	}
}

export type UseArticleDetailsReturn = ReturnType<typeof useArticleDetails>
