'use client'

import Link from 'next/link'
import { BookOpen, Image as ImageIcon } from 'lucide-react'

import type { ArticlePreview } from '@/types/landing.types'

type ArticleCardProps = {
	article: ArticlePreview
	showCta?: boolean
	href?: string
}

export function ArticleCard({
	article,
	showCta = false,
	href
}: ArticleCardProps) {
	const target = href ?? `/articles/${article.id}`

	return (
		<Link
			href={target}
			className='group block rounded-2xl border border-black/10 bg-white/85 transition hover:-translate-y-0.5 hover:border-black/15 hover:bg-white'
			aria-label={`Открыть статью: ${article.title}`}
		>
			<div className='relative mb-4 h-[220px] overflow-hidden rounded-2xl border border-black/10 bg-[linear-gradient(135deg,rgba(31,61,58,0.16),rgba(31,61,58,0.04))]'>
				<div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(31,61,58,0.22),rgba(31,61,58,0))]' />
				<div className='absolute inset-0 grid place-items-center text-black/45'>
					<div className='grid place-items-center gap-2 text-xs uppercase tracking-[0.2em]'>
						<ImageIcon className='h-6 w-6' />
						<span>Изображение</span>
					</div>
				</div>
				<div className='absolute left-4 top-4 inline-flex items-center rounded-full border border-black/10 bg-white/80 px-3 py-1 text-[11px] uppercase tracking-[0.12em] text-black/60'>
					{article.tag}
				</div>
				<div className='absolute bottom-3 right-3 grid h-10 w-10 place-items-center rounded-2xl border border-black/10 bg-white/85 text-primary transition group-hover:translate-x-0.5'>
					<BookOpen className='h-5 w-5' />
				</div>
			</div>

			<div className='p-5'>
				<div className='flex items-center gap-2 text-xs text-black/50'>
					<span>{article.date}</span>
					<span
						className='h-1 w-1 rounded-full bg-black/30'
						aria-hidden='true'
					/>
					<span>{article.readTime}</span>
				</div>
				<h3 className='mt-3 text-[18px] font-semibold leading-[1.3]'>
					{article.title}
				</h3>
				<p className='mt-2 text-sm text-black/60 [display:-webkit-box] [-webkit-line-clamp:3] [-webkit-box-orient:vertical] overflow-hidden'>
					{article.excerpt}
				</p>
				{showCta ? (
					<span className='mt-4 inline-flex items-center text-xs font-medium text-black/60 transition group-hover:text-black'>
						Читать статью
						<span className='ml-2 text-black/40'>→</span>
					</span>
				) : null}
			</div>
		</Link>
	)
}
