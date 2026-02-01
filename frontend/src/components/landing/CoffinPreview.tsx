'use client'

import Image from 'next/image'

export function CoffinPreview({
	tone: _tone,
	url,
	name
}: {
	tone: number
	url: string
	name: string
}) {
	return (
		<div className='relative grid w-[min(360px,92%)] place-items-center overflow-hidden rounded-2xl border border-black/10 bg-white/55 aspect-[4/2.2]'>
			<div className='pointer-events-none absolute -left-10 -top-10 h-[220px] w-[220px] rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(31,61,58,0.18),rgba(31,61,58,0))]' />
			<Image
				className='object-cover h-full'
				src={url}
				width={360}
				height={200}
				alt={name}
			/>
		</div>
	)
}
