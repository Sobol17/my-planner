'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import {
	SubmitHandler,
	type Resolver,
	useFieldArray,
	useForm
} from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { ContractCreateDto } from '@/types/contracts.types'

import { DASHBOARD_PAGES } from '@/config/pages-url.config'

import { contractService } from '@/services/contracts.service'

import { contractDetailsSchema } from './contract-details.schema'

const emptyService = { service_id: '', price: 0, comment: '' }
const emptyProduct = { product_id: '', quantity: 1, unit_price: 0 }

interface UseContractDetailsOptions {
	id: string
}

const mapZodErrors = (error: z.ZodError) => {
	const fieldErrors: Record<string, unknown> = {}

	for (const issue of error.issues) {
		if (!issue.path.length) continue

		let cursor: Record<string, unknown> | unknown[] = fieldErrors

		issue.path.forEach((segment, index) => {
			const key = segment as string | number
			const recordKey = typeof key === 'number' ? String(key) : key
			const isLast = index === issue.path.length - 1

			if (isLast) {
				if (Array.isArray(cursor)) {
					if (!cursor[key as number]) {
						cursor[key as number] = { type: 'validation', message: issue.message }
					}
				} else if (!cursor[recordKey]) {
					cursor[recordKey] = { type: 'validation', message: issue.message }
				}
				return
			}

			const nextKey = issue.path[index + 1]
			const shouldBeArray = typeof nextKey === 'number'

			if (Array.isArray(cursor)) {
				if (!cursor[key as number]) cursor[key as number] = shouldBeArray ? [] : {}
				cursor = cursor[key as number] as Record<string, unknown> | unknown[]
				return
			}

			if (!cursor[recordKey]) cursor[recordKey] = shouldBeArray ? [] : {}
			cursor = cursor[recordKey] as Record<string, unknown> | unknown[]
		})
	}

	return fieldErrors
}

const contractDetailsResolver: Resolver<ContractCreateDto> = async values => {
	const result = contractDetailsSchema.safeParse(values)

	if (result.success) {
		return {
			values: result.data,
			errors: {}
		}
	}

	return {
		values: {},
		errors: mapZodErrors(result.error)
	}
}

export function useContractDetails({ id }: UseContractDetailsOptions) {
	const isCreate = id === 'new' || id === 'create'

	const router = useRouter()
	const queryClient = useQueryClient()

	const {
		register,
		handleSubmit,
		reset,
		control,
		formState: { errors }
	} = useForm<ContractCreateDto>(
		{
			mode: 'onChange',
			resolver: contractDetailsResolver,
			defaultValues: {
				contract_number: '',
				contract_date: '',
				client_full_name: '',
				client_passport: '',
				price: 0,
				comment: '',
				deadman_address: '',
				deadman_full_name: '',
				deadman_age: 0,
				deadman_birthday: '',
				deadman_death_day: '',
				services: [emptyService],
				products: [emptyProduct]
			}
		}
	)

	const {
		fields: serviceFields,
		append: appendService,
		remove: removeService
	} = useFieldArray({
		control,
		name: 'services'
	})

	const {
		fields: productFields,
		append: appendProduct,
		remove: removeProduct
	} = useFieldArray({
		control,
		name: 'products'
	})

	const { mutate, isPending } = useMutation({
		mutationKey: ['create contract'],
		mutationFn: (data: ContractCreateDto) => contractService.create(data),
		onSuccess: async response => {
			toast.success('Договор успешно создан')
			queryClient.invalidateQueries({ queryKey: ['contracts'] })
			reset()

			try {
				if (response?.url) {
					const { blob, filename } = await contractService.downloadFromUrl(
						response.url
					)
					const downloadName = filename || 'document'
					const url = window.URL.createObjectURL(blob)
					const link = window.document.createElement('a')

					link.href = url
					link.download = downloadName
					window.document.body.appendChild(link)
					link.click()
					link.remove()
					window.URL.revokeObjectURL(url)
				}
			} catch {
				toast.error('Не удалось скачать документ')
			} finally {
				router.push(DASHBOARD_PAGES.CONTRACTS)
			}
		},
		onError() {
			toast.error('Не удалось создать договор')
		}
	})

	const {
		data: contract,
		isLoading,
		isError
	} = useQuery({
		queryKey: ['contract', id],
		queryFn: () => contractService.getById(id),
		enabled: !isCreate
	})

	const onSubmit: SubmitHandler<ContractCreateDto> = data => {
		mutate(data)
	}

	const downloadDocument = async (documentName?: string) => {
		if (!id || isCreate) return

		try {
			const { blob, filename } = await contractService.downloadDocument(id)
			const downloadName = filename || documentName || 'document'
			const url = window.URL.createObjectURL(blob)
			const link = window.document.createElement('a')

			link.href = url
			link.download = downloadName
			window.document.body.appendChild(link)
			link.click()
			link.remove()
			window.URL.revokeObjectURL(url)
		} catch {
			toast.error('Не удалось скачать документ')
		}
	}

	return {
		isCreate,
		contract,
		isLoading,
		isError,
		isPending,
		errors,
		register,
		handleSubmit,
		serviceFields,
		appendService,
		removeService,
		productFields,
		appendProduct,
		removeProduct,
		onSubmit,
		downloadDocument
	}
}
