'use client'

type SectionHeadingProps = {
	title: string
	subtitle: string
}

export function SectionHeading({ title, subtitle }: SectionHeadingProps) {
	return (
		<div className='mb-11 flex items-end justify-between gap-4'>
			<div>
				<h2 className='text-[32px] font-semibold tracking-[-0.01em]'>
					{title}
				</h2>
				<div className='mt-2 text-black/60'>{subtitle}</div>
			</div>
		</div>
	)
}
