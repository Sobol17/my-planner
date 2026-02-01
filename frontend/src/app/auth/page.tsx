import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { NO_INDEX_PAGE } from '@/constants/seo.constants'

export const metadata: Metadata = {
	title: 'Вход в кабинет',
	...NO_INDEX_PAGE
}

export default function AuthPage() {
	// return <Auth />
	redirect('/')
}
