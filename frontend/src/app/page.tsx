import { Metadata } from 'next'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/thumbs'

import { LandingPageClient } from '@/components/landing/LandingPageClient'

export const metadata: Metadata = {
	title: 'Агентство ритуальных услуг в Иркутске | «Архангел»',
	description:
		'Ритуальное агентство АРХАНГЕЛ. Предоставляем полный комплекс услуг по захоронению в Иркутске и Иркутской области.'
}

export default function Home() {
	return <LandingPageClient />
}
