'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'
import { toast } from 'sonner'

import Loader from '@/components/ui/Loader'
import { Button } from '@/components/ui/buttons/Button'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table'

import { ArticleDto } from '@/types/articles.types'

import { DASHBOARD_PAGES } from '@/config/pages-url.config'

import { articlesService } from '@/services/articles.service'

import { formatDate } from '@/utils/formatDate'

import { useArticles } from './hooks/useArticles'

export function Articles() {
	const { items, isLoading } = useArticles()
	const { push } = useRouter()
	const queryClient = useQueryClient()

	const { mutate: removeArticle, isPending: isDeleting } = useMutation({
		mutationKey: ['delete article'],
		mutationFn: (id: string) => articlesService.delete(id),
		onSuccess: () => {
			toast.success('Статья удалена')
			queryClient.invalidateQueries({ queryKey: ['articles'] })
		},
		onError: () => {
			toast.error('Не удалось удалить статью')
		}
	})

	const sortedItems = useMemo(() => {
		return [...items].sort((first, second) => {
			const firstDate = new Date(
				first.updated_at || first.created_at
			).getTime()
			const secondDate = new Date(
				second.updated_at || second.created_at
			).getTime()
			return secondDate - firstDate
		})
	}, [items])

	const handleDelete = (id: string) => {
		if (isDeleting) return
		const confirmDelete = window.confirm('Удалить эту статью?')
		if (!confirmDelete) return
		removeArticle(id)
	}

	const handleEdit = (id: string) => {
		push(`${DASHBOARD_PAGES.ARTICLES}/${id}`)
	}

	return isLoading ? (
		<Loader />
	) : (
		<div>
			<div className='w-full text-end'>
				<Button
					onClick={() => push(`${DASHBOARD_PAGES.ARTICLES}/new`)}
					className='ml-auto'
				>
					+ Новая статья
				</Button>
			</div>
			<div className='grid grid-cols-1 gap-8 mt-7'>
				{sortedItems.length ? (
					<div className='overflow-hidden rounded-md border font-[400]'>
						<Table>
							<TableHeader className='bg-brand-100/20'>
								<TableRow>
									<TableHead>Заголовок</TableHead>
									<TableHead>Тег</TableHead>
									<TableHead>Дата</TableHead>
									<TableHead>Чтение</TableHead>
									<TableHead>Обновлено</TableHead>
									<TableHead className='text-right'>Действия</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{sortedItems.map((article: ArticleDto) => (
									<TableRow
											key={article.id}
											className='cursor-pointer'
											onClick={() => handleEdit(article.id)}
										>
											<TableCell className='font-medium'>
												{article.title}
											</TableCell>
											<TableCell>{article.tag}</TableCell>
											<TableCell>{article.date}</TableCell>
											<TableCell>{article.read_time}</TableCell>
											<TableCell>
												{formatDate(article.updated_at || article.created_at)}
											</TableCell>
											<TableCell className='text-right'>
												<div className='flex justify-end gap-2'>
													<Button
														onClick={event => {
															event.stopPropagation()
															handleEdit(article.id)
														}}
														className='px-3 py-1 text-xs'
													>
														Изменить
													</Button>
													<Button
														onClick={event => {
															event.stopPropagation()
															handleDelete(article.id)
														}}
														className='px-3 py-1 text-xs'
														disabled={isDeleting}
													>
														Удалить
													</Button>
												</div>
											</TableCell>
										</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				) : (
					<div className='text-sm text-primary/60'>
						Статей пока нет. Создайте первую.
					</div>
				)}
			</div>
		</div>
	)
}
