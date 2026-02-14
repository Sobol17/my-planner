import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { SeoPageTemplate } from '@/components/seo/SeoPageTemplate'

import { PRODUCT_PAGES } from '@/data/seo-pages.data'
import { buildSeoMetadata } from '@/lib/seo'

type ProductPageProps = {
	params: {
		slug: string
	}
}

export const dynamicParams = false

export function generateStaticParams() {
	return Object.keys(PRODUCT_PAGES).map(slug => ({ slug }))
}

export function generateMetadata({ params }: ProductPageProps): Metadata {
	const page = PRODUCT_PAGES[params.slug]

	if (!page) {
		return {
			title: { absolute: 'Страница не найдена' },
			robots: { index: false, follow: false }
		}
	}

	return buildSeoMetadata({
		title: page.title,
		description: page.description,
		path: page.path,
		type: page.type
	})
}

export default function ProductPage({ params }: ProductPageProps) {
	const page = PRODUCT_PAGES[params.slug]

	if (!page) {
		notFound()
	}

	return (
		<SeoPageTemplate
			breadcrumbs={page.breadcrumbs}
			h1={page.h1}
			lead={page.lead}
			sections={page.sections}
			faq={page.faq}
			relatedLinks={page.relatedLinks}
			relatedTitle={page.relatedTitle}
		/>
	)
}
