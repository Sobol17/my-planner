import type { Metadata } from 'next'

import { NO_INDEX_PAGE } from '@/constants/seo.constants'

import { ContractDetails } from './ContractDetails'

export const metadata: Metadata = {
	title: 'Договор',
	...NO_INDEX_PAGE
}

interface ContractPageProps {
	params: {
		id: string
	}
}

export default function ContractPage({ params }: ContractPageProps) {
	return <ContractDetails id={params.id} />
}
