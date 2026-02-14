'use client'

import Link from 'next/link'

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
					additionalText='В пакеты не входит стоимость могилы.'
				/>

				<div className='max-w-[80ch] text-[13px] text-black/60'>
					Цены указаны{' '}
					<strong className='text-black'>
						с учетом вычета пособия на погребение
					</strong>{' '}
					(− {rub(BENEFIT)}).
				</div>
				<div className='mb-4 max-w-[80ch] text-[13px] text-black/60'>
					Доплата за нестандартные размеры (вес тела свыше 100 кг / длина гроба
					свыше 2 м) {rub(3500)}.
				</div>
				<Link
					href='/pakety-uslug'
					className='mb-5 inline-flex items-center rounded-xl border border-black/10 bg-[#fafafa] px-4 py-2.5 text-sm font-medium text-black/75 transition hover:border-black/20 hover:bg-white'
				>
					Сравнить пакеты на отдельной странице
				</Link>

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
