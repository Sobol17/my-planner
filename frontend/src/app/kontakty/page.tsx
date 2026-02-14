import type { Metadata } from 'next'

import { SeoPageTemplate } from '@/components/seo/SeoPageTemplate'

import { TOP_LEVEL_PAGES } from '@/data/seo-pages.data'
import { buildSeoMetadata, createLocalBusinessSchema } from '@/lib/seo'

const page = TOP_LEVEL_PAGES['/kontakty']

export const metadata: Metadata = buildSeoMetadata({
	title: page.title,
	description: page.description,
	path: page.path,
	type: page.type
})

export default function ContactsPage() {
	return (
		<SeoPageTemplate
			breadcrumbs={page.breadcrumbs}
			h1={page.h1}
			lead={page.lead}
			sections={page.sections}
			faq={page.faq}
			relatedLinks={page.relatedLinks}
			relatedTitle={page.relatedTitle}
			extraSchemas={[createLocalBusinessSchema(page.path)]}
		/>
	)
}
