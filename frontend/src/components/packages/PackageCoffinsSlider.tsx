'use client'

import Image from 'next/image'
import { useRef, useState } from 'react'
import type { Swiper as SwiperType } from 'swiper'
import { A11y, Keyboard, Navigation, Pagination, Thumbs } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import { ArrowBtn } from '@/components/landing/ArrowBtn'
import type { Coffin } from '@/types/landing.types'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/thumbs'

type PackageCoffinsSliderProps = {
	coffins: Coffin[]
	packageTitle: string
}

export function PackageCoffinsSlider({
	coffins,
	packageTitle
}: PackageCoffinsSliderProps) {
	const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null)
	const [mainSwiper, setMainSwiper] = useState<SwiperType | null>(null)
	const [activeIndex, setActiveIndex] = useState(0)

	const mainPrevRef = useRef<HTMLButtonElement | null>(null)
	const mainNextRef = useRef<HTMLButtonElement | null>(null)

	if (!coffins.length) {
		return (
			<div className='rounded-2xl border border-black/10 bg-[#fafafa] p-5 text-sm text-black/60'>
				Фотографии гробов для этого пакета пока не добавлены.
			</div>
		)
	}

	return (
		<div className='rounded-2xl border border-black/10 bg-[#fafafa] p-4 sm:p-5'>
			<div className='mb-4 flex flex-wrap items-center justify-between gap-3'>
				<p className='text-sm text-black/65'>
					{packageTitle}: вариант {activeIndex + 1} из {coffins.length}
				</p>
				<strong className='text-sm sm:text-base'>
					{coffins[activeIndex]?.name ?? 'Выберите вариант'}
				</strong>
			</div>

			<div className='relative overflow-hidden rounded-2xl border border-black/10 bg-white'>
				<Swiper
					modules={[Navigation, Pagination, Keyboard, Thumbs, A11y]}
					onSwiper={setMainSwiper}
					slidesPerView={1}
					spaceBetween={16}
					keyboard={{ enabled: true }}
					a11y={{ enabled: true }}
					pagination={{ clickable: true }}
					thumbs={{
						swiper:
							thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null
					}}
					onSlideChange={swiper => setActiveIndex(swiper.activeIndex)}
					onBeforeInit={swiper => {
						const nav = (swiper.params.navigation ?? {}) as Record<
							string,
							unknown
						>

						swiper.params.navigation = {
							...nav,
							prevEl: mainPrevRef.current,
							nextEl: mainNextRef.current
						}
					}}
					className='!pb-10'
				>
					{coffins.map((coffin, index) => (
						<SwiperSlide key={`${coffin.id}-${index}`}>
							<div className='grid min-h-[300px] place-items-center p-5 sm:min-h-[420px] lg:min-h-[520px]'>
								<Image
									src={coffin.url}
									alt={coffin.name}
									width={1280}
									height={720}
									className='h-full max-h-[460px] w-auto rounded-2xl object-contain'
									priority={index === 0}
								/>
							</div>
						</SwiperSlide>
					))}

					<div className='pointer-events-none absolute inset-y-0 left-3 right-3 z-10'>
						<button
							ref={mainPrevRef}
							type='button'
							className='pointer-events-auto absolute left-0 top-1/2 -translate-y-1/2'
							aria-label='Предыдущий гроб'
						>
							<ArrowBtn dir='prev' />
						</button>
						<button
							ref={mainNextRef}
							type='button'
							className='pointer-events-auto absolute right-0 top-1/2 -translate-y-1/2'
							aria-label='Следующий гроб'
						>
							<ArrowBtn dir='next' />
						</button>
					</div>
				</Swiper>
			</div>

			<div className='mt-4 rounded-2xl border border-black/10 bg-white px-3 py-3'>
				<Swiper
					modules={[Thumbs, A11y]}
					onSwiper={setThumbsSwiper}
					watchSlidesProgress
					slideToClickedSlide
					spaceBetween={10}
					slidesPerView={3}
					breakpoints={{
						520: { slidesPerView: 4 },
						760: { slidesPerView: 5 },
						1100: { slidesPerView: 6 }
					}}
					className='!pb-1'
				>
					{coffins.map((coffin, index) => (
						<SwiperSlide key={`${coffin.id}-thumb-${index}`}>
							<button
								type='button'
								onClick={() => mainSwiper?.slideTo(index)}
								className={[
									'grid w-full gap-1.5 rounded-xl border bg-white p-2 text-left transition',
									index === activeIndex
										? 'border-[rgba(31,61,58,0.35)] shadow-[0_10px_26px_rgba(31,61,58,0.08)]'
										: 'border-black/10 hover:border-black/20'
								].join(' ')}
								aria-label={`Показать ${coffin.name}`}
							>
								<div className='relative h-[56px] overflow-hidden rounded-lg border border-black/10 bg-[#f6f8f9]'>
									<Image
										src={coffin.url}
										alt={coffin.name}
										fill
										sizes='(max-width: 768px) 33vw, 16vw'
										className='rounded-lg object-cover'
									/>
								</div>
								<div className='line-clamp-2 text-[11px] text-black/60'>
									{coffin.name}
								</div>
							</button>
						</SwiperSlide>
					))}
				</Swiper>
			</div>
		</div>
	)
}
