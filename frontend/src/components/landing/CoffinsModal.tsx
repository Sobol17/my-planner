'use client'

import Image from 'next/image'
import { A11y, Keyboard, Navigation, Pagination, Thumbs } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import { useCoffinsModal } from '@/hooks/landing/useCoffinsModal'
import type { PackageData } from '@/types/landing.types'

import { ArrowBtn } from './ArrowBtn'
import { CoffinPreview } from './CoffinPreview'

type CoffinsModalProps = {
	open: boolean
	pkg: PackageData | null
	priceText: string
	onClose: () => void
}

export function CoffinsModal({
	open,
	pkg,
	priceText,
	onClose
}: CoffinsModalProps) {
	const {
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
	} = useCoffinsModal({ open, pkg, onClose })

	if (!open || !pkg) return null

	return (
		<div className='fixed inset-0 z-[100]'>
			<button
				className='absolute inset-0 bg-black/55 backdrop-blur-[6px]'
				onClick={onClose}
				aria-label='Закрыть'
			/>

			<div
				ref={containerRef}
				tabIndex={-1}
				role='dialog'
				aria-modal='true'
				aria-label='Выбор гроба'
				className='relative mx-auto mt-[6vh] w-[min(920px,92vw)] overflow-hidden rounded-[18px] border border-white/40 bg-white/95 shadow-[0_18px_60px_rgba(12,16,20,0.25)] outline-none'
			>
				<div className='flex items-start justify-between gap-4 px-5 pb-0 pt-5'>
					<div className='grid gap-0.5'>
						<strong className='text-[18px] font-semibold'>{pkg.title}</strong>
						<span className='text-[13px] text-black/60'>
							Выберите подходящий вариант гроба
						</span>
					</div>
					<button
						className='grid h-11 w-11 place-items-center rounded-2xl border border-black/10 bg-white/90 transition hover:bg-primarySoft'
						onClick={onClose}
						aria-label='Закрыть'
					>
						<svg
							viewBox='0 0 24 24'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'
							aria-hidden='true'
							className='h-5 w-5'
						>
							<path
								d='M7 7l10 10M17 7L7 17'
								stroke='rgba(31,31,31,0.70)'
								strokeWidth='2'
								strokeLinecap='round'
							/>
						</svg>
					</button>
				</div>

				<div className='grid gap-4 px-5 pb-5 pt-4 lg:grid-cols-[1.1fr_0.9fr]'>
					<div
						className='relative overflow-hidden rounded-2xl border border-black/10 bg-gradient-to-br from-[rgba(31,61,58,0.06)] to-[rgba(36,52,71,0.06)]'
						aria-label='Карусель'
					>
						<div className='relative'>
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
										thumbsSwiper && !thumbsSwiper.destroyed
											? thumbsSwiper
											: null
								}}
								onSlideChange={s => setActiveIndex(s.activeIndex)}
								onBeforeInit={s => {
									const nav = (s.params.navigation ?? {}) as Record<
										string,
										unknown
									>

									s.params.navigation = {
										...nav,
										prevEl: mainPrevRef.current,
										nextEl: mainNextRef.current
									}
								}}
								className='!pb-10'
							>
								{coffins.map(c => (
									<SwiperSlide key={c.id}>
										<div className='grid min-h-[300px] place-items-center p-5 lg:min-h-[360px]'>
											<CoffinPreview
												tone={c.tone}
												url={c.url}
												name={c.name}
											/>
										</div>
									</SwiperSlide>
								))}

								<div className='pointer-events-none absolute bottom-4 left-4 right-4 z-10 flex justify-between gap-3'>
									<button
										ref={mainPrevRef}
										type='button'
										className='pointer-events-auto'
										aria-label='Предыдущий'
									>
										<ArrowBtn dir='prev' />
									</button>
									<button
										ref={mainNextRef}
										type='button'
										className='pointer-events-auto'
										aria-label='Следующий'
									>
										<ArrowBtn dir='next' />
									</button>
								</div>
							</Swiper>
						</div>

						<div className='border-t border-black/10 bg-white/60 px-4 py-4'>
							<Swiper
								modules={[Thumbs, A11y]}
								onSwiper={setThumbsSwiper}
								watchSlidesProgress
								slideToClickedSlide
								spaceBetween={10}
								slidesPerView={3}
								breakpoints={{
									520: { slidesPerView: 4 },
									760: { slidesPerView: 5 }
								}}
								className='!pb-1'
							>
								{coffins.map((c, i) => (
									<SwiperSlide key={`${c.id}-thumb`}>
										<button
											type='button'
											onClick={() => mainSwiper?.slideTo(i)}
											className={[
												'grid w-full gap-1.5 rounded-2xl border bg-white/85 p-2.5 text-left transition hover:border-black/15 hover:bg-white active:translate-y-[1px]',
												i === activeIndex
													? 'border-[rgba(31,61,58,0.35)] shadow-[0_10px_26px_rgba(31,61,58,0.08)]'
													: 'border-black/10'
											].join(' ')}
											aria-label={c.name}
										>
											<div className='grid h-[54px] place-items-center overflow-hidden rounded-xl border border-black/10 bg-[rgba(31,61,58,0.05)]'>
												<Image
													className='object-fit h-full'
													src={c.url}
													width={360}
													height={200}
													alt={c.name}
												/>
											</div>
											<div className='text-[12px] leading-tight text-black/60 line-clamp-2'>
												{c.name}
											</div>
										</button>
									</SwiperSlide>
								))}
							</Swiper>
						</div>
					</div>

					<aside className='grid gap-3 rounded-2xl border border-black/10 bg-white/70 p-4'>
						<div>
							<div className='font-semibold'>Цена пакета</div>
							<div className='mt-2 text-[24px] font-semibold tracking-[-0.02em]'>
								{priceText}
							</div>
							<div className='mt-1 text-xs text-black/60'>
								Гроб идет без креста на крышке
							</div>
						</div>

						<div>
							<div className='font-semibold'>Выбранный вариант</div>
							<div className='mt-1 text-black/60'>{active?.name ?? '—'}</div>
						</div>

						<a
							href='tel:+70000000000'
							className='mt-1 inline-flex items-center justify-center rounded-xl bg-accent-land px-4 py-3 font-medium text-white transition active:translate-y-[1px] hover:bg-primaryDark'
						>
							Позвонить и уточнить
						</a>
					</aside>
				</div>
			</div>
		</div>
	)
}
