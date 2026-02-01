import { useEffect, useState } from 'react'
import type { Swiper as SwiperType } from 'swiper/types'

export function useReviewsNavigation() {
	const [swiper, setSwiper] = useState<SwiperType | null>(null)
	const [prevEl, setPrevEl] = useState<HTMLButtonElement | null>(null)
	const [nextEl, setNextEl] = useState<HTMLButtonElement | null>(null)

	useEffect(() => {
		if (!swiper || !prevEl || !nextEl) return
		const nav = (swiper.params.navigation ?? {}) as Record<string, unknown>
		swiper.params.navigation = {
			...nav,
			prevEl,
			nextEl
		}
		swiper.navigation?.destroy?.()
		swiper.navigation?.init?.()
		swiper.navigation?.update?.()
	}, [swiper, prevEl, nextEl])

	return {
		swiper,
		setSwiper,
		prevEl,
		setPrevEl,
		nextEl,
		setNextEl
	}
}
