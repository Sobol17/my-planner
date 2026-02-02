'use client'

import Image from 'next/image'

import { HERO_BADGES } from '@/constants/landing.constants'

export function Hero() {
	return (
		<section
			className='py-[84px] pb-[72px]'
			id='top'
		>
			<div className='mx-auto grid max-w-6xl items-center gap-14 px-6 lg:grid-cols-[1.15fr_1fr]'>
				<div>
					<h1 className='mb-4 text-[38px] font-semibold leading-[1.12] tracking-[-0.02em] sm:text-[48px]'>
						Ритуальные услуги
						<br />
						без лишних сложностей
					</h1>
					<p className='mb-7 max-w-[52ch] text-[18px] text-black/60 text-second'>
						Организуем всё спокойно, прозрачно и точно в срок. На связи
						круглосуточно — вы получите понятный план действий и поддержку на
						каждом шаге.
					</p>

					<div className='mb-7 mt-4 flex flex-wrap gap-2.5'>
						{HERO_BADGES.map(text => (
							<span
								key={text}
								className='rounded-full border border-black/10 bg-white/85 px-3 py-2 text-[13px] text-black/60'
							>
								{text}
							</span>
						))}
					</div>

					<div className='flex flex-wrap items-center gap-3'>
						<a
							href='tel:+79500550266'
							className='inline-flex items-center justify-center gap-2 rounded-xl bg-accent-land px-6 py-3.5 font-medium text-white transition active:translate-y-[1px] hover:bg-primaryDark w-full sm:w-auto'
						>
							Позвонить сейчас
							<svg
								viewBox='0 0 24 24'
								fill='none'
								xmlns='http://www.w3.org/2000/svg'
								aria-hidden='true'
								className='h-5 w-5'
							>
								<path
									d='M5 12h12'
									stroke='white'
									strokeWidth='2'
									strokeLinecap='round'
								/>
								<path
									d='M13 6l6 6-6 6'
									stroke='white'
									strokeWidth='2'
									strokeLinecap='round'
									strokeLinejoin='round'
								/>
							</svg>
						</a>
						<a
							href='#contacts'
							className='inline-flex items-center justify-center rounded-xl border border-[rgba(31,61,58,0.35)] bg-white/85 px-6 py-3.5 font-medium text-primary transition active:translate-y-[1px] hover:border-[rgba(31,61,58,0.55)] hover:bg-primarySoft w-full sm:w-auto'
						>
							Получить консультацию
						</a>
					</div>
				</div>

				<div
					className='relative min-h-[320px] overflow-hidden rounded-[18px] border border-black/10 bg-gradient-to-br from-[rgba(31,61,58,0.08)] to-[rgba(36,52,71,0.07)] lg:min-h-[360px]'
					role='img'
					aria-label='Абстрактная минимальная композиция'
				>
					<div className='pointer-events-none absolute -right-20 -top-16 h-[280px] w-[280px] rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(31,61,58,0.18),rgba(31,61,58,0))]' />

					<Image
						src='/images/hero1.png'
						alt='hero-block'
						className='w-full h-[360px] object-cover'
						width={520}
						height={360}
					/>

					<div className='absolute bottom-4 left-4 right-4 grid grid-cols-[1fr_auto] items-center gap-3 rounded-2xl border border-black/10 bg-white/85 p-4'>
						<div>
							<strong className='font-semibold'>
								Понятный план действий за 5–10 минут
							</strong>
							<small className='mt-1 block text-black/60'>
								Коротко уточним детали и предложим варианты.
							</small>
						</div>
						<a
							href='tel:+79500550266'
							className='inline-flex items-center justify-center rounded-xl bg-accent-land px-4 py-2.5 font-medium text-white transition active:translate-y-[1px] hover:bg-primaryDark'
						>
							Связаться
						</a>
					</div>
				</div>
			</div>
		</section>
	)
}
