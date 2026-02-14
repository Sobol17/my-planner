import { Metadata } from 'next'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/thumbs'

import { JsonLd } from '@/components/seo/JsonLd'
import { LandingPageClient } from '@/components/landing/LandingPageClient'
import { HOME_SEO } from '@/data/seo-pages.data'
import { buildSeoMetadata, createLocalBusinessSchema } from '@/lib/seo'
import { getPublicArticles } from '@/services/public-articles.service'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = buildSeoMetadata({
	title: HOME_SEO.title,
	description: HOME_SEO.description,
	path: HOME_SEO.path
})

export default async function Home() {
	const articles = await getPublicArticles()

	return (
		<>
			<JsonLd data={createLocalBusinessSchema('/')} />
			<LandingPageClient articles={articles} />
		</>
	)
}
