import type { MetadataRoute } from 'next'

import { SITE_URL } from '@/config/site.config'
import { REQUIRED_SEO_PATHS } from '@/data/seo-pages.data'

export default function sitemap(): MetadataRoute.Sitemap {
	const now = new Date()
	const uniquePaths = Array.from(new Set(REQUIRED_SEO_PATHS))

	return uniquePaths.map(path => ({
		url: `${SITE_URL}${path}`,
		lastModified: now,
		changeFrequency: path === '/' ? 'daily' : 'weekly',
		priority: path === '/' ? 1 : path === '/pohorony-pod-klyuch' ? 0.95 : 0.8
	}))
}
