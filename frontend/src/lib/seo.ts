import type { Metadata } from 'next'

import { BUSINESS_INFO, SITE_NAME, SITE_URL } from '@/config/site.config'

export type OpenGraphType = 'website' | 'article'

export type BreadcrumbItem = {
	name: string
	path: string
}

type SeoMetadataInput = {
	title: string
	description: string
	path: string
	type?: OpenGraphType
}

function normalizePath(path: string) {
	if (!path) return '/'
	return path.startsWith('/') ? path : `/${path}`
}

export function toAbsoluteUrl(path: string) {
	return `${SITE_URL}${normalizePath(path)}`
}

export function buildSeoMetadata({
	title,
	description,
	path,
	type = 'website'
}: SeoMetadataInput): Metadata {
	const canonical = toAbsoluteUrl(path)

	return {
		title: { absolute: title },
		description,
		alternates: {
			canonical
		},
		openGraph: {
			title,
			description,
			url: canonical,
			type,
			siteName: SITE_NAME,
			locale: 'ru_RU'
		},
		twitter: {
			card: 'summary_large_image',
			title,
			description
		}
	}
}

export function createBreadcrumbSchema(items: BreadcrumbItem[]) {
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: items.map((item, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			name: item.name,
			item: toAbsoluteUrl(item.path)
		}))
	}
}

export function createLocalBusinessSchema(path: string) {
	return {
		'@context': 'https://schema.org',
		'@type': ['LocalBusiness', 'Organization'],
		'@id': `${toAbsoluteUrl(path)}#organization`,
		url: toAbsoluteUrl(path),
		name: BUSINESS_INFO.name,
		legalName: BUSINESS_INFO.legalName,
		telephone: BUSINESS_INFO.phonePrimary,
		contactPoint: [
			{
				'@type': 'ContactPoint',
				telephone: BUSINESS_INFO.phonePrimary,
				contactType: 'customer support',
				areaServed: 'RU',
				availableLanguage: ['ru']
			},
			{
				'@type': 'ContactPoint',
				telephone: BUSINESS_INFO.phoneSecondary,
				contactType: 'customer support',
				areaServed: 'RU',
				availableLanguage: ['ru']
			}
		],
		email: BUSINESS_INFO.email,
		openingHours: BUSINESS_INFO.openingHours,
		address: {
			'@type': 'PostalAddress',
			...BUSINESS_INFO.address
		},
		geo: {
			'@type': 'GeoCoordinates',
			latitude: BUSINESS_INFO.geo.latitude,
			longitude: BUSINESS_INFO.geo.longitude
		},
		areaServed: ['Иркутск', 'Иркутская область']
	}
}
