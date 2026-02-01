'use client'

import type { FenceState, PackageData, PackageId } from '@/types/landing.types'
import { BENEFIT, rub } from '@/utils/landing'

import { PackageCard } from './PackageCard'
import { SectionHeading } from './SectionHeading'

type PackagesSectionProps = {
	packages: PackageData[]
	fenceIncluded: FenceState
	onFenceIncludedChange: (id: PackageId, next: boolean) => void
	onOpenCoffins: (id: PackageId) => void
}

export function PackagesSection({
	packages,
	fenceIncluded,
	onFenceIncludedChange,
	onOpenCoffins
}: PackagesSectionProps) {
	return (
		<section
			className='bg-white py-[88px]'
			id='packages'
		>
			<div className='mx-auto max-w-6xl px-6'>
				<SectionHeading
					title='Пакеты услуг'
					subtitle='В каждом пакете — выбор гробов.'
				/>

				<div className='mb-4 max-w-[80ch] text-[13px] text-black/60'>
					Цены указаны{' '}
					<strong className='text-black'>с учётом пособия</strong> (−{' '}
					{rub(BENEFIT)}).
				</div>

				<div className='grid items-start gap-5 lg:grid-cols-2'>
					{packages.map(pkg => (
						<PackageCard
							key={pkg.id}
							pkg={pkg}
							fenceIncluded={fenceIncluded[pkg.id]}
							onFenceIncludedChange={next =>
								onFenceIncludedChange(pkg.id, next)
							}
							onOpenCoffins={() => onOpenCoffins(pkg.id)}
						/>
					))}
				</div>
			</div>
		</section>
	)
}
