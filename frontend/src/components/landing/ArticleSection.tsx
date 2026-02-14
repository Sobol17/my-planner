'use client'

import { PublicArticle } from '@/types/articles.types'

import { ArticleCard } from './ArticleCard'
import { SectionHeading } from './SectionHeading'

interface ArticleSectionProps {
	articles: PublicArticle[]
}

export function ArticleSection({ articles }: ArticleSectionProps) {
	const shortArticles = articles.slice(0, 3)

	return (
		<section
			className='py-[88px]'
			id='articles'
		>
			<div className='mx-auto max-w-6xl px-6'>
				<SectionHeading
					title='Полезные статьи'
					subtitle='Короткие материалы, которые помогают разобраться в процессах похорон и ответить на часто возникающие вопросы.'
				/>

				<div className='grid gap-5 md:grid-cols-2 lg:grid-cols-3'>
					{shortArticles.map(article => (
						<ArticleCard
							key={article.id}
							article={article}
							href={`/articles/${article.slug}`}
						/>
					))}
				</div>

				{!shortArticles.length ? (
					<p className='mt-5 rounded-xl border border-black/10 bg-white/70 px-4 py-3 text-sm text-black/60'>
						Пока нет опубликованных статей.
					</p>
				) : null}
			</div>
		</section>
	)
}
