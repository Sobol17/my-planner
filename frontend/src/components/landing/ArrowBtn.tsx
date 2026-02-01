'use client'

export function ArrowBtn({ dir }: { dir: 'prev' | 'next' }) {
	const isPrev = dir === 'prev'
	return (
		<span
			className={[
				'pointer-events-auto grid h-12 w-12 place-items-center rounded-2xl border border-black/10 bg-white/85 transition hover:bg-white active:translate-y-[1px]',
				'shadow-[0_10px_26px_rgba(12,16,20,0.10)]'
			].join(' ')}
			aria-hidden='true'
		>
			<svg
				viewBox='0 0 24 24'
				fill='none'
				xmlns='http://www.w3.org/2000/svg'
				className='h-5 w-5'
			>
				{isPrev ? (
					<path
						d='M14 6l-6 6 6 6'
						stroke='rgba(31,31,31,0.65)'
						strokeWidth='2'
						strokeLinecap='round'
						strokeLinejoin='round'
					/>
				) : (
					<path
						d='M10 6l6 6-6 6'
						stroke='rgba(31,31,31,0.65)'
						strokeWidth='2'
						strokeLinecap='round'
						strokeLinejoin='round'
					/>
				)}
			</svg>
		</span>
	)
}
