'use client'

import { TRUST_ITEMS } from '@/constants/landing.constants'

import { SectionHeading } from './SectionHeading'

export function Trust() {
	return (
		<section
			className='bg-white py-[88px]'
			id='trust'
		>
			<div className='mx-auto max-w-6xl px-6'>
				<SectionHeading
					title='Почему нам доверяют'
					subtitle=''
				/>

				<div className='grid gap-4 lg:grid-cols-2'>
					{TRUST_ITEMS.map(text => (
						<div
							key={text}
							className='rounded-2xl border border-black/10 bg-white/90 p-5 text-[16px]'
						>
							{text}
						</div>
					))}
				</div>
			</div>
		</section>
	)
}
