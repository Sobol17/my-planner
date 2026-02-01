import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { NO_INDEX_PAGE } from '@/constants/seo.constants'

export const metadata: Metadata = {
	title: 'Dashboard',
	...NO_INDEX_PAGE
}

export default function DashboardPage() {
	// return (
	// 	<div>
	// 		<Heading title='Аналитика' />
	// 		<Statistics />
	// 	</div>
	// )
	redirect('/')
}
