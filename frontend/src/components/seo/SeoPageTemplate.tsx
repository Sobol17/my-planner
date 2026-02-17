import Link from 'next/link'

import { Footer } from '@/components/landing/Footer'
import { Header } from '@/components/landing/Header'
import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { JsonLd } from '@/components/seo/JsonLd'

import { BUSINESS_INFO } from '@/config/site.config'

import type { BreadcrumbItem } from '@/lib/seo'
import { createBreadcrumbSchema } from '@/lib/seo'

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
	relatedTitle = 'Смотрите также',
	relatedLinks,
	extraSchemas
}: SeoPageTemplateProps) {
	const schemas: Record<string, unknown>[] = []
	const phoneHref = `tel:${BUSINESS_INFO.phonePrimary.replace(/[^\d+]/g, '')}`

	if (breadcrumbs.length > 1) {
		schemas.push(createBreadcrumbSchema(breadcrumbs))
	}

	if (extraSchemas?.length) {
		schemas.push(...extraSchemas)
	}

	return (
		<div className='bg-white text-[#1f1f1f] antialiased'>
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
							<p className='mt-4 text-[16px] leading-relaxed text-black/65'>
								{lead}
							</p>
							<div className='mt-5 flex flex-wrap gap-2 text-xs'>
								<span className='rounded-full border border-black/10 bg-[#fafafa] px-3 py-1.5 text-black/70'>
									Иркутск и Иркутская область
								</span>
								<span className='rounded-full border border-black/10 bg-[#fafafa] px-3 py-1.5 text-black/70'>
									Поддержка 24/7
								</span>
								<span className='rounded-full border border-black/10 bg-[#fafafa] px-3 py-1.5 text-black/70'>
									Понятный порядок действий
								</span>
							</div>

							<div className='mt-8 space-y-7'>
								{sections.map(section => (
									<section key={section.title}>
										<h2 className='text-[22px] font-semibold'>
											{section.title}
										</h2>
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
							<section className='mt-10 rounded-2xl border border-[#d6e6de] bg-[#f7faf8] p-5 sm:p-6'>
								<h2 className='text-[22px] font-semibold'>
									Как мы можем помочь дальше
								</h2>
								<p className='mt-3 text-[15px] leading-relaxed text-black/70'>
									Если хотите, можно за один звонок сверить порядок действий и
									получить спокойный план под вашу ситуацию.
								</p>
								<ul className='mt-4 list-disc space-y-2 pl-5 text-[15px] text-black/70'>
									<li>Подскажем, какие шаги нужны в первую очередь.</li>
									<li>Объясним, какие услуги можно выбрать отдельно.</li>
									<li>Поможем согласовать удобный и понятный формат.</li>
								</ul>
								<div className='mt-5 flex flex-wrap gap-3'>
									<a
										href={phoneHref}
										className='inline-flex items-center justify-center rounded-xl bg-accent-land px-4 py-2.5 text-sm font-medium text-white transition hover:bg-primaryDark'
									>
										Позвонить сейчас
									</a>
									<Link
										href='/kontakty'
										className='inline-flex items-center justify-center rounded-xl border border-black/15 bg-white px-4 py-2.5 text-sm font-medium text-black/80 transition hover:border-black/25 hover:bg-[#fafafa]'
									>
										Открыть контакты
									</Link>
								</div>
							</section>

							{faq?.length ? (
								<section className='mt-10'>
									<h2 className='text-[22px] font-semibold'>Частые вопросы</h2>
									<div className='mt-4 space-y-4'>
										{faq.map(item => (
											<article
												key={item.question}
												className='rounded-xl border border-black/10 bg-light p-4'
											>
												<h3 className='text-[17px] font-medium'>
													{item.question}
												</h3>
												<p className='mt-2 text-[15px] text-black/70'>
													{item.answer}
												</p>
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
												className='rounded-xl border border-black/10 bg-light p-4 transition hover:border-black/20 hover:bg-white'
											>
												<p className='font-medium text-title'>{link.label}</p>
												{link.description ? (
													<p className='mt-1 text-sm text-secondary-land'>
														{link.description}
													</p>
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
