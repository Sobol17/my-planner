import { Image as ImageIcon } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ArticleCard } from '@/components/landing/ArticleCard'
import { Footer } from '@/components/landing/Footer'
import { Header } from '@/components/landing/Header'
import { SectionHeading } from '@/components/landing/SectionHeading'

import {
	getPublicArticleBySlug,
	getPublicArticles
} from '@/services/public-articles.service'

export const dynamic = 'force-dynamic'

type ArticlePageProps = {
	params: {
		slug: string
	}
}

export async function generateMetadata({
	params
}: ArticlePageProps): Promise<Metadata> {
	const article = await getPublicArticleBySlug(params.slug)

	if (!article) {
		return {
			title: 'Статья не найдена'
		}
	}

	return {
		title: article.title,
		description: article.excerpt
	}
}

export default async function ArticlePage({ params }: ArticlePageProps) {
	const article = await getPublicArticleBySlug(params.slug)

	if (!article) {
		notFound()
	}

	const articles = await getPublicArticles()
	const otherArticles = articles.filter(item => item.id !== article.id).slice(0, 2)

	return (
		<div className='bg-white text-[#1f1f1f] antialiased'>
			<Header />
			<main>
				<section className='py-[80px]'>
					<div className='mx-auto max-w-6xl px-6'>
						<nav className='mb-6 text-xs text-black/50'>
							<Link
								href='/'
								className='transition hover:text-black'
							>
								Главная
							</Link>
							<span className='px-2'>/</span>
							<Link
								href='/articles'
								className='transition hover:text-black'
							>
								Статьи
							</Link>
						</nav>

						<div className='grid gap-10 lg:grid-cols-[1.15fr_0.85fr]'>
							<div>
								<h1 className='text-[34px] font-semibold leading-[1.2] tracking-[-0.01em] sm:text-[40px]'>
									{article.title}
								</h1>
								<div className='mt-4 flex items-center gap-2 text-xs text-black/50'>
									<span>{article.date}</span>
									<span
										className='h-1 w-1 rounded-full bg-black/30'
										aria-hidden='true'
									/>
									<span>{article.readTime}</span>
								</div>
								<p className='mt-5 text-[17px] text-black/60'>
									{article.excerpt}
								</p>
							</div>

							<div className='relative h-[240px] overflow-hidden rounded-2xl border border-black/10 bg-[linear-gradient(135deg,rgba(31,61,58,0.16),rgba(31,61,58,0.04))] lg:h-[260px]'>
								{article.imageUrl ? (
									<img
										src={article.imageUrl}
										alt={article.title}
										className='h-full w-full object-cover'
									/>
								) : (
									<>
										<div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(31,61,58,0.22),rgba(31,61,58,0))]' />
										<div className='absolute inset-0 grid place-items-center text-black/45'>
											<div className='grid place-items-center gap-2 text-xs uppercase tracking-[0.2em]'>
												<ImageIcon className='h-7 w-7' />
												<span>Изображение</span>
											</div>
										</div>
									</>
								)}
								<div className='absolute left-4 top-4 inline-flex items-center rounded-full border border-black/10 bg-white/80 px-3 py-1 text-[11px] uppercase tracking-[0.12em] text-black/60'>
									{article.tag}
								</div>
							</div>
						</div>

						<div className='mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]'>
							<article className='rounded-2xl border border-black/10 bg-white p-6 sm:p-8'>
								<div
									className='space-y-4 text-[15px] leading-relaxed text-black/70 [&_blockquote]:border-l-2 [&_blockquote]:border-black/10 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-black/60 [&_h2]:mb-2 [&_h2]:mt-6 [&_h2]:text-[20px] [&_h2]:font-semibold [&_h2]:text-black [&_h3]:text-[18px] [&_h3]:font-semibold [&_h3]:text-black [&_li]:mb-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-5'
									dangerouslySetInnerHTML={{ __html: article.contentHtml }}
								/>
							</article>

							<div className='space-y-5'>
								<div className='rounded-2xl border border-black/10 bg-white p-6'>
									<h3 className='text-[18px] font-semibold'>
										Нужна консультация
									</h3>
									<p className='mt-2 text-sm text-black/60'>
										Подскажем, какие документы нужны, и согласуем удобное время.
									</p>
									<a
										href='tel:+79500550266'
										className='mt-4 inline-flex items-center justify-center rounded-xl bg-accent-land px-4 py-2.5 text-sm font-medium text-white transition hover:bg-primaryDark'
									>
										Позвонить
									</a>
								</div>
							</div>
						</div>

						{otherArticles.length ? (
							<div className='mt-14'>
								<SectionHeading
									title='Другие статьи'
									subtitle='Ещё материалы, которые могут быть полезны.'
									margin
								/>
								<div className='grid gap-5 md:grid-cols-2'>
									{otherArticles.map(item => (
										<ArticleCard
											key={item.id}
											article={item}
											showCta
											href={`/articles/${item.slug}`}
										/>
									))}
								</div>
							</div>
						) : null}
					</div>
				</section>
			</main>
			<Footer />
		</div>
	)
}
