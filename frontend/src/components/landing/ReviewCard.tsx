'use client'

import type { Review } from '@/types/landing.types'
import { useReviewCard } from '@/hooks/landing/useReviewCard'

type ReviewCardProps = {
	review: Review
	expanded: boolean
	onToggle: () => void
}

export function ReviewCard({ review, expanded, onToggle }: ReviewCardProps) {
	const { canExpand, textRef } = useReviewCard(review.text, expanded)

	return (
		<div className='grid h-full gap-3 rounded-[18px] border border-black/10 bg-white/85 p-6 min-h-[225px]'>
			<div
				className='flex gap-1 opacity-90'
				aria-label='Оценка 5 из 5'
				title='5/5'
			>
				{Array.from({ length: 5 }).map((_, i) => (
					<svg
						key={i}
						viewBox='0 0 24 24'
						fill='rgba(31,61,58,0.85)'
						xmlns='http://www.w3.org/2000/svg'
						className='h-4 w-4'
					>
						<path d='M12 2l3 7 7 .6-5.3 4.6 1.7 7-6.4-3.9-6.4 3.9 1.7-7L2 9.6 9 9l3-7z' />
					</svg>
				))}
			</div>
			<div className='grid gap-2'>
				<p
					ref={textRef}
					className={[
						'text-sm text-black/60',
						expanded
							? ''
							: '[display:-webkit-box] [-webkit-line-clamp:3] [-webkit-box-orient:vertical] overflow-hidden'
					].join(' ')}
				>
					{review.text}
				</p>
				{canExpand ? (
					<button
						type='button'
						onClick={onToggle}
						className='w-fit text-xs font-medium text-black/60 transition hover:text-black '
						aria-expanded={expanded}
					>
						{expanded ? 'Скрыть' : 'Подробнее'}
					</button>
				) : null}
			</div>
			<div className='mt-1 flex items-baseline justify-between gap-3'>
				<strong className='font-semibold'>{review.name}</strong>
				<span className='text-xs text-black/60'>{review.city}</span>
			</div>
		</div>
	)
}
