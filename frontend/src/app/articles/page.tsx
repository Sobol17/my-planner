import type { Metadata } from 'next'
import Link from 'next/link'

import { ArticleCard } from '@/components/landing/ArticleCard'
import { Footer } from '@/components/landing/Footer'
import { Header } from '@/components/landing/Header'
import { SectionHeading } from '@/components/landing/SectionHeading'

import { getPublicArticles } from '@/services/public-articles.service'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
	title: 'Статьи',
	description:
		'Полезные материалы о ритуальных услугах, документах и организации прощания.'
}

export default async function ArticlesPage() {
	const articles = await getPublicArticles()

	return (
		<div className='bg-white text-[#1f1f1f] antialiased'>
			<Header />
			<main>
				<section className='py-[60px]'>
					<div className='mx-auto max-w-6xl px-6'>
						<nav className='mb-6 text-xs text-black/50'>
							<Link
								href='/'
								className='transition hover:text-black'
							>
								Главная
							</Link>
							<span className='px-2'>/</span>
							<span className='text-black/70'>Статьи</span>
						</nav>
						<SectionHeading
							title='Статьи'
							subtitle='Все материалы по документам, организации и поддержке — коротко и по делу.'
						/>

						<div className='grid gap-5 md:grid-cols-2 lg:grid-cols-3'>
							{articles.map(article => (
								<ArticleCard
									key={article.id}
									article={article}
									showCta
									href={`/articles/${article.slug}`}
								/>
							))}
						</div>

						{!articles.length ? (
							<p className='mt-5 rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-black/60'>
								Список статей пока пуст.
							</p>
						) : null}
					</div>
				</section>
			</main>
			<Footer />
		</div>
	)
}
