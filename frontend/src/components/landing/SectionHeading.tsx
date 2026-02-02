'use client'

type SectionHeadingProps = {
	title: string
	subtitle: string
	margin?: boolean
	additionalText?: string
}

export function SectionHeading({
	title,
	subtitle,
	margin,
	additionalText
}: SectionHeadingProps) {
	return (
		<div
			className={`${margin ? 'mb-4' : 'mb-11'} flex items-end justify-between gap-4`}
		>
			<div>
				<h2 className='text-[32px] font-semibold tracking-[-0.01em]'>
					{title}
				</h2>
				<div className='mt-2 text-black/60 max-w-[700px]'>{subtitle}</div>
				<div className='mt-2 italic text-black max-w-[700px]'>
					{additionalText}
				</div>
			</div>
		</div>
	)
}
