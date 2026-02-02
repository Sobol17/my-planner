'use client'

import { useState } from 'react'
import { A11y, Keyboard, Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import { REVIEWS } from '@/constants/landing.constants'

import { useReviewsNavigation } from '@/hooks/landing/useReviewsNavigation'

import { ArrowBtn } from './ArrowBtn'
import { ReviewCard } from './ReviewCard'
import { SectionHeading } from './SectionHeading'

export function Reviews() {
	const { prevEl, nextEl, setSwiper, setPrevEl, setNextEl } =
		useReviewsNavigation()
	const [activeReviewId, setActiveReviewId] = useState<string | null>(null)

	return (
		<section
			className='py-[88px]'
			id='reviews'
		>
			<div className='mx-auto max-w-6xl px-6'>
				<SectionHeading
					title='Отзывы'
					subtitle='Что о нас говорят'
					margin
				/>
				<div className='mb-4'>
					Все отзывы Вы можете посмотреть{' '}
					<a
						href='https://2gis.ru/irkutsk/firm/70000001044403974/tab/reviews?m=104.314689%2C52.265302%2F16.18'
						target='_blank'
						className='italic text-brand-400 border-b border-brand-400'
					>
						здесь
					</a>
				</div>
				<div className='pointer-events-none justify-end z-10 gap-2 flex mb-4'>
					<button
						ref={setPrevEl}
						type='button'
						className='pointer-events-auto'
						aria-label='Предыдущий отзыв'
					>
						<ArrowBtn dir='prev' />
					</button>
					<button
						ref={setNextEl}
						type='button'
						className='pointer-events-auto'
						aria-label='Следующий отзыв'
					>
						<ArrowBtn dir='next' />
					</button>
				</div>
				<div className='relative'>
					<Swiper
						modules={[Navigation, Pagination, Keyboard, A11y]}
						slidesPerView={1}
						spaceBetween={16}
						keyboard={{ enabled: true }}
						a11y={{ enabled: true }}
						pagination={{ clickable: true }}
						navigation={{ prevEl, nextEl }}
						breakpoints={{
							740: { slidesPerView: 2 },
							1024: { slidesPerView: 3 }
						}}
						onSwiper={setSwiper}
						className='!pb-10'
						loop
					>
						{REVIEWS.map(r => {
							const reviewId = `${r.name}-${r.city}`
							return (
								<SwiperSlide key={reviewId}>
									<ReviewCard
										review={r}
										expanded={activeReviewId === reviewId}
										onToggle={() =>
											setActiveReviewId(prev =>
												prev === reviewId ? null : reviewId
											)
										}
									/>
								</SwiperSlide>
							)
						})}
					</Swiper>
				</div>
			</div>
		</section>
	)
}
