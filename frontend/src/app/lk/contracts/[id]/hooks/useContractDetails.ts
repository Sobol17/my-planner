'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo } from 'react'
import {
	type FieldErrors,
	type Resolver,
	SubmitHandler,
	useFieldArray,
	useForm,
	useWatch
} from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { ContractCreateDto } from '@/types/contracts.types'

import { DASHBOARD_PAGES } from '@/config/pages-url.config'

import { contractDetailsSchema } from '../contract-details.schema'

import { contractService } from '@/services/contracts.service'

const emptyService = { service_id: '', price: 0, comment: '' }
const emptyProduct = { product_id: '', quantity: 1, unit_price: 0 }
const FUNERAL_BENEFIT_AMOUNT = 11000
const EMPTY_ERRORS: Record<string, never> = {}

export type ContractCreateFormValues = ContractCreateDto & {
	funeral_benefit_deduction?: boolean
}

interface UseContractDetailsOptions {
	id: string
}

const getTodayYmd = () => {
	const today = new Date()
	const year = today.getFullYear()
	const month = String(today.getMonth() + 1).padStart(2, '0')
	const day = String(today.getDate()).padStart(2, '0')
	return `${year}-${month}-${day}`
}

const mapZodErrors = (
	error: z.ZodError
): FieldErrors<ContractCreateFormValues> => {
	const fieldErrors: FieldErrors<ContractCreateFormValues> = {}

	for (const issue of error.issues) {
		if (!issue.path.length) continue

		let cursor: Record<string, unknown> | unknown[] = fieldErrors as Record<
			string,
			unknown
		>

		issue.path.forEach((segment, index) => {
			const key = segment as string | number
			const recordKey = typeof key === 'number' ? String(key) : key
			const isLast = index === issue.path.length - 1

			if (isLast) {
				if (Array.isArray(cursor)) {
					if (!cursor[key as number]) {
						cursor[key as number] = {
							type: 'validation',
							message: issue.message
						}
					}
				} else if (!cursor[recordKey]) {
					cursor[recordKey] = { type: 'validation', message: issue.message }
				}
				return
			}

			const nextKey = issue.path[index + 1]
			const shouldBeArray = typeof nextKey === 'number'

			if (Array.isArray(cursor)) {
				if (!cursor[key as number])
					cursor[key as number] = shouldBeArray ? [] : {}
				cursor = cursor[key as number] as Record<string, unknown> | unknown[]
				return
			}

			if (!cursor[recordKey]) cursor[recordKey] = shouldBeArray ? [] : {}
			cursor = cursor[recordKey] as Record<string, unknown> | unknown[]
		})
	}

	return fieldErrors
}

// @ts-ignore
const contractDetailsResolver: Resolver<ContractCreateFormValues> = values => {
	const result = contractDetailsSchema.safeParse(values)

	if (result.success) {
		return {
			values: result.data,
			errors: EMPTY_ERRORS
		}
	}

	return {
		values: {} as Record<string, never>,
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
		setValue,
		formState: { errors }
	} = useForm<ContractCreateFormValues>({
		mode: 'onChange',
		resolver: contractDetailsResolver,
		defaultValues: {
			contract_number: '',
			contract_date: getTodayYmd(),
			client_full_name: '',
			client_phone: '',
			price: 0,
			sale_percent: 0,
			funeral_benefit_deduction: false,
			comment: '',
			deadman_address: '',
			deadman_full_name: '',
			deadman_age: 0,
			deadman_birthday: '',
			deadman_death_day: '',
			services: [emptyService],
			products: [emptyProduct]
		}
	})

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

	const services = useWatch({ control, name: 'services' })
	const products = useWatch({ control, name: 'products' })
	const salePercent = useWatch({ control, name: 'sale_percent' })
	const benefitDeduction = useWatch({
		control,
		name: 'funeral_benefit_deduction'
	})

	const calculatedPrice = useMemo(() => {
		const servicesTotal = (services ?? []).reduce((sum, item) => {
			const price = Number(item?.price ?? 0)
			return Number.isNaN(price) ? sum : sum + price
		}, 0)

		const productsTotal = (products ?? []).reduce((sum, item) => {
			const quantity = Number(item?.quantity ?? 0)
			const unitPrice = Number(item?.unit_price ?? 0)

			if (Number.isNaN(quantity) || Number.isNaN(unitPrice)) return sum
			return sum + quantity * unitPrice
		}, 0)

		const rawTotal = servicesTotal + productsTotal
		const sale = Number(salePercent ?? 0)
		const saleFraction = Number.isNaN(sale)
			? 0
			: Math.min(Math.max(sale, 0), 100) / 100
		const discountedTotal = rawTotal * (1 - saleFraction)
		const benefitTotal = benefitDeduction ? FUNERAL_BENEFIT_AMOUNT : 0
		const finalTotal = discountedTotal - benefitTotal

		return Math.max(0, Math.round(finalTotal))
	}, [services, products, salePercent, benefitDeduction])

	useEffect(() => {
		setValue('price', calculatedPrice, { shouldValidate: true })
	}, [calculatedPrice, setValue])

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

	const onSubmit: SubmitHandler<ContractCreateFormValues> = data => {
		const { funeral_benefit_deduction: _benefit, ...payload } = data
		mutate(payload)
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
		control,
		serviceFields,
		appendService,
		removeService,
		productFields,
		appendProduct,
		removeProduct,
		calculatedPrice,
		onSubmit,
		downloadDocument
	}
}

export type UseContractDetailsReturn = ReturnType<typeof useContractDetails>
