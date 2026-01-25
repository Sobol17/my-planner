'use client'

import Loader from '@/components/ui/Loader'

import { useAnalytics } from '@/hooks/useAnalytics'

export function Statistics() {
	const { data, isLoading } = useAnalytics('01.01.2026', '31.01.2026')

	return isLoading ? (
		<Loader />
	) : (
		<div className='grid grid-cols-4 gap-12 mt-7'>
			{data ? (
				<>
					<div className='bg-primary/10 rounded p-layout hover:-translate-y-3 transition-transform duration-500'>
						<div className='text-xl'>Количество договоров</div>
						<div className='text-3xl font-semibold'>{data.contractsCount}</div>
					</div>

					<div className='bg-primary/10 rounded p-layout hover:-translate-y-3 transition-transform duration-500'>
						<div className='text-xl'>Общая выручка</div>
						<div className='text-3xl font-semibold'>{data.turnover}</div>
					</div>
				</>
			) : (
				<div>Произошла ошибка на сервере</div>
			)}
		</div>
	)
}
