import type { Metadata } from 'next'

import { Heading } from '@/components/ui/Heading'

import { NO_INDEX_PAGE } from '@/constants/seo.constants'

import { Articles } from './Articles'

export const metadata: Metadata = {
	title: 'Статьи',
	...NO_INDEX_PAGE
}

export default function ArticlesPage() {
	return (
		<div>
			<Heading title='Статьи' />
			<Articles />
		</div>
	)
}
