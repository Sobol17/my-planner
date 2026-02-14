import Link from 'next/link'

import { Footer } from '@/components/landing/Footer'
import { Header } from '@/components/landing/Header'
import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { JsonLd } from '@/components/seo/JsonLd'

import { createBreadcrumbSchema } from '@/lib/seo'
import type { BreadcrumbItem } from '@/lib/seo'

type PageSection = {
	title: string
	paragraphs: string[]
	list?: string[]
}

type FaqItem = {
	question: string
	answer: string
}

type RelatedLink = {
	href: string
	label: string
	description?: string
}

type SeoPageTemplateProps = {
	breadcrumbs: BreadcrumbItem[]
	h1: string
	lead: string
	sections: PageSection[]
	faq?: FaqItem[]
	relatedTitle?: string
	relatedLinks?: RelatedLink[]
	extraSchemas?: Record<string, unknown>[]
}

export function SeoPageTemplate({
	breadcrumbs,
	h1,
	lead,
	sections,
	faq,
	relatedTitle = 'Смежные страницы',
	relatedLinks,
	extraSchemas
}: SeoPageTemplateProps) {
	const schemas: Record<string, unknown>[] = []

	if (breadcrumbs.length > 1) {
		schemas.push(createBreadcrumbSchema(breadcrumbs))
	}

	if (extraSchemas?.length) {
		schemas.push(...extraSchemas)
	}

	return (
		<div className='bg-[#f4f5f6] text-[#1f1f1f] antialiased'>
			{schemas.map((schema, index) => (
				<JsonLd
					key={index}
					data={schema}
				/>
			))}
			<Header />
			<main>
				<section className='py-[70px]'>
					<div className='mx-auto max-w-5xl px-6'>
						<Breadcrumbs items={breadcrumbs} />

						<div className='rounded-2xl border border-black/10 bg-white p-6 sm:p-8'>
							<h1 className='text-[30px] font-semibold leading-[1.2] tracking-[-0.01em] sm:text-[36px]'>
								{h1}
							</h1>
							<p className='mt-4 text-[16px] leading-relaxed text-black/65'>{lead}</p>

							<div className='mt-8 space-y-7'>
								{sections.map(section => (
									<section key={section.title}>
										<h2 className='text-[22px] font-semibold'>{section.title}</h2>
										<div className='mt-3 space-y-3 text-[15px] leading-relaxed text-black/70'>
											{section.paragraphs.map(paragraph => (
												<p key={paragraph}>{paragraph}</p>
											))}
										</div>
										{section.list?.length ? (
											<ul className='mt-3 list-disc space-y-2 pl-5 text-[15px] text-black/70'>
												{section.list.map(item => (
													<li key={item}>{item}</li>
												))}
											</ul>
										) : null}
									</section>
								))}
							</div>

							{faq?.length ? (
								<section className='mt-10'>
									<h2 className='text-[22px] font-semibold'>Частые вопросы</h2>
									<div className='mt-4 space-y-4'>
										{faq.map(item => (
											<article
												key={item.question}
												className='rounded-xl border border-black/10 bg-[#fafafa] p-4'
											>
												<h3 className='text-[17px] font-medium'>{item.question}</h3>
												<p className='mt-2 text-[15px] text-black/70'>{item.answer}</p>
											</article>
										))}
									</div>
								</section>
							) : null}

							{relatedLinks?.length ? (
								<section className='mt-10'>
									<h2 className='text-[22px] font-semibold'>{relatedTitle}</h2>
									<div className='mt-4 grid gap-3 sm:grid-cols-2'>
										{relatedLinks.map(link => (
											<Link
												key={link.href}
												href={link.href}
												className='rounded-xl border border-black/10 bg-[#fafafa] p-4 transition hover:border-black/20 hover:bg-white'
											>
												<p className='font-medium text-black'>{link.label}</p>
												{link.description ? (
													<p className='mt-1 text-sm text-black/60'>{link.description}</p>
												) : null}
											</Link>
										))}
									</div>
								</section>
							) : null}
						</div>
					</div>
				</section>
			</main>
			<Footer />
		</div>
	)
}

export type { FaqItem, PageSection, RelatedLink }
