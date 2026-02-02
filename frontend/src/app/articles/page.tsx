import type { Metadata } from 'next'
import Link from 'next/link'

import { ArticleCard } from '@/components/landing/ArticleCard'
import { Footer } from '@/components/landing/Footer'
import { Header } from '@/components/landing/Header'
import { SectionHeading } from '@/components/landing/SectionHeading'

import { ARTICLES } from '@/constants/landing.constants'

export const metadata: Metadata = {
	title: 'Статьи',
	description:
		'Полезные материалы о ритуальных услугах, документах и организации прощания.'
}

export default function ArticlesPage() {
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
							{ARTICLES.map(article => (
								<ArticleCard
									key={article.id}
									article={article}
									showCta
								/>
							))}
						</div>
					</div>
				</section>
			</main>
			<Footer />
		</div>
	)
}
