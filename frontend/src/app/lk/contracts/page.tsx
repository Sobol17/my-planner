import type { Metadata } from 'next'

import { Heading } from '@/components/ui/Heading'

import { NO_INDEX_PAGE } from '@/constants/seo.constants'

import { Contracts } from './Contracts'

export const metadata: Metadata = {
	title: 'Договоры',
	...NO_INDEX_PAGE
}

export default async function ContractsPage() {
	return (
		<div>
			<Heading title='Работа с договорами' />
			<Contracts />
		</div>
	)
}
