'use client'

import { useRouter } from 'next/navigation'

import Loader from '@/components/ui/Loader'
import { Button } from '@/components/ui/buttons/Button'

import type { IContract } from '@/types/contracts.types'

import { DASHBOARD_PAGES } from '@/config/pages-url.config'

import { columns } from './columns'
import { DataTable } from './data-table'
import { useContracts } from './hooks/useContracts'

export function Contracts() {
	const { items, isLoading } = useContracts()
	const { push } = useRouter()

	return isLoading ? (
		<Loader />
	) : (
		<div>
			<div className='w-full text-end'>
				<Button
					onClick={() => push('contracts/new')}
					className='ml-auto'
				>
					+ Новый договор
				</Button>
			</div>
			<div className='grid grid-cols-1 gap-12 mt-7'>
				{items ? (
					<>
						<DataTable
							columns={columns}
							data={items}
							onRowClick={(contract: IContract) =>
								push(`${DASHBOARD_PAGES.CONTRACTS}/${contract.id}`)
							}
						/>
					</>
				) : (
					<div>Произошла ошибка на сервере</div>
				)}
			</div>
		</div>
	)
}
