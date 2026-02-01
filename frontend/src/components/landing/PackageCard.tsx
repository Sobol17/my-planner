'use client'

import { CheckItem } from '@/components/landing/CheckItem'
import type { PackageData } from '@/types/landing.types'
import { computePackagePrice, rub } from '@/utils/landing'

type PackageCardProps = {
	pkg: PackageData
	fenceIncluded: boolean
	onFenceIncludedChange: (next: boolean) => void
	onOpenCoffins: () => void
}

export function PackageCard({
	pkg,
	fenceIncluded,
	onFenceIncludedChange,
	onOpenCoffins
}: PackageCardProps) {
	const price = computePackagePrice(
		pkg.basePrice,
		fenceIncluded,
		pkg.fence ?? 10000,
		pkg.hasFenceToggle
	)

	return (
		<article
			className={[
				'grid grid-rows-[auto_auto_auto_1fr_auto] gap-3.5 rounded-[18px] bg-white/95 p-6 min-h-[510px]',
				pkg.tagTone === 'primary'
					? 'border border-[rgba(31,61,58,0.35)] shadow-[0_12px_34px_rgba(31,61,58,0.08)]'
					: 'border border-black/10'
			].join(' ')}
		>
			<div className='flex items-start justify-between gap-3'>
				<h3 className='text-[18px] font-semibold'>{pkg.title}</h3>
				<span
					className={[
						'whitespace-nowrap rounded-full border px-3 py-1.5 text-xs',
						pkg.tagTone === 'primary'
							? 'border-[rgba(31,61,58,0.18)] bg-[rgba(31,61,58,0.08)] text-primary'
							: 'border-black/10 bg-black/[0.04] text-black/60'
					].join(' ')}
				>
					{pkg.tag}
				</span>
			</div>

			<div className='flex flex-wrap items-baseline justify-between gap-3'>
				<div className='text-[28px] font-semibold tracking-[-0.02em]'>
					{rub(price)}{' '}
					<small className='font-normal text-black/60 line-through text-muted-land'>
						/ {rub(pkg.basePrice)}
					</small>
				</div>
			</div>

			{pkg.hasFenceToggle ? (
				<label
					className='mt-1 inline-flex w-fit select-none items-center gap-2 rounded-full border border-black/10 bg-white/85 px-3 py-2.5'
					title='Уберите оградку — стоимость уменьшится на 6 000 ₽'
				>
					<input
						type='checkbox'
						className='peer sr-only'
						checked={fenceIncluded}
						onChange={e => onFenceIncludedChange(e.target.checked)}
					/>
					<span className='relative h-7 w-11 rounded-full border border-[rgba(31,61,58,0.16)] bg-[rgba(31,61,58,0.12)] transition peer-checked:bg-accent-land peer-checked:[&>span]:translate-x-[15px]'>
						<span className='absolute left-0.5 top-0.5 h-[22px] w-[22px] rounded-full border border-black/10 bg-white transition' />
					</span>

					<span className='text-[13px] leading-tight'>
						<span className='text-black'>Оградка включена</span>
						<small className='block text-[12px] text-black/60'>
							Убрать − {rub(pkg.fence ?? 1000)}
						</small>
					</span>
				</label>
			) : null}

			<div className='flex items-center justify-between gap-3 rounded-2xl border border-[rgba(31,61,58,0.12)] bg-primarySoft p-3'>
				<div className='grid gap-0.5'>
					<strong className='text-sm font-semibold'>Гробы на выбор</strong>
					<span className='text-xs text-black/60'>
						{pkg.coffins.length} вариантов
					</span>
				</div>
				<button
					type='button'
					onClick={onOpenCoffins}
					className='inline-flex items-center justify-center rounded-xl border border-black/10 bg-white/75 px-4 py-2.5 font-medium text-black transition hover:border-black/15 hover:bg-white active:translate-y-[1px]'
				>
					Смотреть
				</button>
			</div>

			<ul className='grid list-none gap-2.5'>
				{pkg.highlights.map(t => (
					<CheckItem key={t}>{t}</CheckItem>
				))}
			</ul>

			<details className='group rounded-2xl border border-black/10 bg-white/70 p-3'>
				<summary className='flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-medium'>
					Показать все услуги ({pkg.allServicesCountLabel})
					<span
						className='grid h-7 w-7 place-items-center rounded-xl border border-black/10 bg-white/85 transition group-open:rotate-180'
						aria-hidden='true'
					>
						<svg
							viewBox='0 0 24 24'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'
							className='h-5 w-5'
						>
							<path
								d='M6 9l6 6 6-6'
								stroke='rgba(31,31,31,0.55)'
								strokeWidth='2'
								strokeLinecap='round'
								strokeLinejoin='round'
							/>
						</svg>
					</span>
				</summary>
				<div className='h-2.5' />
				<ul className='grid list-none gap-2.5'>
					{pkg.allServices.map(t => (
						<CheckItem key={t}>{t}</CheckItem>
					))}
				</ul>
			</details>

			<div className='mt-1 grid gap-2 sm:grid-cols-2'>
				<a
					href='tel:+70000000000'
					className='inline-flex w-full items-center justify-center rounded-xl bg-accent-land px-4 py-3 font-medium text-white transition active:translate-y-[1px] hover:bg-primaryDark'
				>
					Позвонить
				</a>
				<button
					type='button'
					onClick={onOpenCoffins}
					className='inline-flex w-full items-center justify-center rounded-xl border border-[rgba(31,61,58,0.35)] bg-white/85 px-4 py-3 font-medium text-primary transition active:translate-y-[1px] hover:border-[rgba(31,61,58,0.55)] hover:bg-primarySoft'
				>
					Выбрать гроб
				</button>
			</div>
		</article>
	)
}
