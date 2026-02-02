'use client'

import { STEPS } from '@/constants/landing.constants'

import { SectionHeading } from './SectionHeading'

export function Steps() {
	return (
		<section
			className='py-[88px]'
			id='steps'
		>
			<div className='mx-auto max-w-6xl px-6'>
				<SectionHeading
					title='Как мы работаем'
					subtitle='Четкий порядок снижает тревожность. Вы понимаете, что будет дальше.'
				/>

				<div className='relative pt-2'>
					<div className='relative grid gap-5 lg:grid-cols-4'>
						<div className='lg:absolute lg:left-8 lg:right-8 lg:top-[28px] lg:block lg:h-px bg-primary/10' />

						{STEPS.map(step => (
							<div
								key={step.n}
								className='relative z-10 text-center'
							>
								<div className='mx-auto mb-3 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-accent-land font-semibold text-white ring-bg'>
									{step.n}
								</div>
								<div className='font-semibold'>{step.title}</div>
								<div className='mt-1 text-sm text-black/60'>{step.desc}</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	)
}
