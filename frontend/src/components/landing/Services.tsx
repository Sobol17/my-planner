'use client'

import {
	BusFront,
	ClipboardMinus,
	FilePlusIcon,
	HandHelping
} from 'lucide-react'
import Link from 'next/link'

import { SERVICES } from '@/constants/landing.constants'
import type { ServiceItem } from '@/types/landing.types'

import { SectionHeading } from './SectionHeading'

const Icon = ({ kind }: { kind: ServiceItem['icon'] }) => {
	if (kind === 'home') {
		return <HandHelping />
	}
	if (kind === 'doc') {
		return <ClipboardMinus />
	}
	if (kind === 'car') {
		return <BusFront />
	}
	if (kind === 'flame') {
		return (
			<svg
				xmlns='http://www.w3.org/2000/svg'
				width='24'
				height='24'
				viewBox='0 0 24 24'
				fill='none'
				stroke='currentColor'
				strokeWidth='2'
				strokeLinecap='round'
				strokeLinejoin='round'
			>
				<path d='M6 8l1.5 11a2 2 0 0 0 2 1.5h5a2 2 0 0 0 2 -1.5l1.5 -11' />
				<path d='M4 8h16' />
				<path d='M16 8v-2a3 3 0 0 0 -3 -3h-2a3 3 0 0 0 -3 3v2' />
				<path d='M10 3v-1h4v1' />
			</svg>
		)
	}
	if (kind === 'drop') {
		return (
			<svg
				xmlns='http://www.w3.org/2000/svg'
				width='24'
				height='24'
				viewBox='0 0 24 24'
				fill='none'
				stroke='currentColor'
				strokeWidth='2'
				strokeLinecap='round'
				strokeLinejoin='round'
			>
				<path d='M12 4a2.5 2.5 0 0 0-2.5 2 2.5 2.5 0 0 0-2.5 3 2.5 2.5 0 0 0-1 3.5 2.5 2.5 0 0 0 1.5 3 2.5 2.5 0 0 0 2.5 2' />
				<path d='M12 4a2.5 2.5 0 0 1 2.5 2 2.5 2.5 0 0 1 2.5 3 2.5 2.5 0 0 1 1 3.5 2.5 2.5 0 0 1-1.5 3 2.5 2.5 0 0 1-2.5 2' />
				<path d='M12 17v2' />
				<path d='M9 18l-3 4' />
				<path d='M15 18l3 4' />
			</svg>
		)
	}

	return <FilePlusIcon />
}

export function Services() {
	return (
		<section
			className='bg-white py-[88px]'
			id='services'
		>
			<div className='mx-auto max-w-6xl px-6'>
				<SectionHeading
					title='Наши услуги'
					subtitle='Только то, что действительно нужно — без лишнего и навязчивого.'
				/>

				<div className='grid gap-5 lg:grid-cols-3'>
					{SERVICES.map(it => (
						<Link
							key={it.title}
							href={it.href}
							aria-label={`Перейти на страницу услуги: ${it.title}`}
							className='rounded-2xl border border-black/10 bg-white/85 p-6 transition hover:-translate-y-0.5 hover:border-black/15 hover:bg-white'
						>
							<div className='mb-2 flex items-center gap-3'>
								<div
									className='grid h-10 w-10 place-items-center rounded-xl border border-black/10 bg-primarySoft'
									aria-hidden='true'
								>
									<Icon kind={it.icon} />
								</div>
								<h3 className='text-[18px] font-semibold leading-[1.25]'>
									{it.title}
								</h3>
							</div>
							<p className='text-sm text-black/60'>{it.desc}</p>
						</Link>
					))}
				</div>
			</div>
		</section>
	)
}
