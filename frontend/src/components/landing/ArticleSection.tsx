'use client'

import { ARTICLES } from '@/constants/landing.constants'

import { ArticleCard } from './ArticleCard'
import { SectionHeading } from './SectionHeading'

export function ArticleSection() {
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
					{ARTICLES.map(article => (
						<ArticleCard
							key={article.id}
							article={article}
						/>
					))}
				</div>
			</div>
		</section>
	)
}
