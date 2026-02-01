import { useEffect, useRef, useState } from 'react'
import type { Swiper as SwiperType } from 'swiper/types'

import type { PackageData } from '@/types/landing.types'

type UseCoffinsModalArgs = {
	open: boolean
	pkg: PackageData | null
	onClose: () => void
}

export function useCoffinsModal({ open, pkg, onClose }: UseCoffinsModalArgs) {
	const containerRef = useRef<HTMLDivElement | null>(null)
	const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null)
	const [mainSwiper, setMainSwiper] = useState<SwiperType | null>(null)
	const [activeIndex, setActiveIndex] = useState(0)

	const mainPrevRef = useRef<HTMLButtonElement | null>(null)
	const mainNextRef = useRef<HTMLButtonElement | null>(null)

	const coffins = pkg?.coffins ?? []
	const active = coffins[activeIndex] ?? null

	useEffect(() => {
		if (!open) return
		containerRef.current?.focus()
		const prevOverflow = document.body.style.overflow
		document.body.style.overflow = 'hidden'
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onClose()
		}
		window.addEventListener('keydown', onKeyDown)

		return () => {
			document.body.style.overflow = prevOverflow
			window.removeEventListener('keydown', onKeyDown)
		}
	}, [open, onClose])

	useEffect(() => {
		if (!open) return
		setActiveIndex(0)
		mainSwiper?.slideTo(0, 0)
		thumbsSwiper?.slideTo(0, 0)
	}, [open, pkg?.id, mainSwiper, thumbsSwiper])

	useEffect(() => {
		if (!thumbsSwiper || thumbsSwiper.destroyed) return
		const target = Math.max(0, activeIndex - 1)
		thumbsSwiper.slideTo(target)
	}, [activeIndex, thumbsSwiper])

	return {
		containerRef,
		thumbsSwiper,
		setThumbsSwiper,
		mainSwiper,
		setMainSwiper,
		activeIndex,
		setActiveIndex,
		mainPrevRef,
		mainNextRef,
		coffins,
		active
	}
}
