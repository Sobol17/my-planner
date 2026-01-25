import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

import { IContract } from '@/types/contracts.types'

import { contractService } from '@/services/contracts.service'

export function useContracts() {
	const { data, isLoading, error } = useQuery({
		queryKey: ['contracts'],
		queryFn: () => contractService.getAll()
	})

	const [items, setItems] = useState<IContract[]>([])

	useEffect(() => {
		setItems(data ?? [])
	}, [data])

	return { items, setItems, isLoading, error }
}
