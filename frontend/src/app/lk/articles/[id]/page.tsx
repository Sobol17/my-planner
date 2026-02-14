import type { Metadata } from 'next'

import { NO_INDEX_PAGE } from '@/constants/seo.constants'

import { ArticleEditor } from './ArticleEditor'

export const metadata: Metadata = {
	title: 'Статья',
	...NO_INDEX_PAGE
}

interface ArticlePageProps {
	params: {
		id: string
	}
}

export default function ArticlePage({ params }: ArticlePageProps) {
	return <ArticleEditor id={params.id} />
}
