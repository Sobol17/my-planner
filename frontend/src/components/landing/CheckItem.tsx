'use client'

interface Props {
	children: React.ReactNode
}

export function CheckItem({ children }: Props) {
	return (
		<li className='grid grid-cols-[18px_1fr] items-start gap-2.5 text-sm text-black/60'>
			<span
				className='grid h-[18px] w-[18px] place-items-center rounded-md border border-[rgba(31,61,58,0.16)] bg-[rgba(31,61,58,0.10)]'
				aria-hidden='true'
			>
				<svg
					viewBox='0 0 24 24'
					fill='none'
					xmlns='http://www.w3.org/2000/svg'
					className='h-3 w-3'
				>
					<path
						d='M6 12l4 4 8-8'
						stroke='rgba(31,61,58,0.95)'
						strokeWidth='2'
						strokeLinecap='round'
						strokeLinejoin='round'
					/>
				</svg>
			</span>
			{children}
		</li>
	)
}
