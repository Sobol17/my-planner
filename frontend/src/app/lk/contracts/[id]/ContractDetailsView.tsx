'use client'

import type { ReactNode } from 'react'

import { Heading } from '@/components/ui/Heading'
import Loader from '@/components/ui/Loader'

import type { IContract } from '@/types/contracts.types'

import { formatDate } from '@/utils/formatDate'

interface ContractDetailsViewProps {
	contract?: IContract | null
	isLoading: boolean
	isError: boolean
	downloadDocument: (documentName?: string) => void
}

const normalizeValue = (value: string | number | null | undefined) => {
	if (value === null || value === undefined || value === '') return '-'
	return String(value)
}

interface DetailItem {
	label: string
	value?: string | number | null
	render?: ReactNode
}

export function ContractDetailsView({
	contract,
	isLoading,
	isError,
	downloadDocument
}: ContractDetailsViewProps) {
	if (isLoading) return <Loader />

	if (isError || !contract) {
		return <div>Не удалось загрузить договор</div>
	}

	const detailItems: DetailItem[] = [
		{ label: 'Номер договора', value: contract.contractNumber },
		{
			label: 'Дата договора',
			value: normalizeValue(formatDate(contract.contractDate))
		},
		{ label: 'ФИО заказчика', value: contract.clientFullName },
		{ label: 'Телефон заказчика', value: contract.clientPhone },
		{ label: 'Комментарий', value: contract.comment },
		{ label: 'Адрес', value: contract.deadmanAddress },
		{ label: 'ФИО умершего', value: contract.deadmanFullName },
		{ label: 'Дата рождения', value: contract.deadmanBirthday },
		{ label: 'Дата смерти', value: contract.deadmanDeathDay },
		{
			label: 'Документ',
			render: contract.document?.originalName ? (
				<button
					type='button'
					className='text-primary underline underline-offset-2 hover:text-primary/80'
					onClick={() => downloadDocument(contract.document?.originalName)}
				>
					{contract.document.originalName}
				</button>
			) : (
				'-'
			)
		},
		{ label: 'Дата создания', value: contract.createdAt }
	]

	return (
		<div>
			<Heading title={`Договор ${contract.contractNumber}`} />

			<div className='flex flex-col gap-6 mt-6'>
				{detailItems.map(item => (
					<div
						key={item.label}
						className='rounded-lg border border-border p-4'
					>
						<div className='text-sm text-primary/60'>{item.label}</div>
						<div className='mt-1 text-base'>
							{item.render ?? normalizeValue(item.value)}
						</div>
					</div>
				))}
			</div>

			<div className='mt-8'>
				<h2 className='text-xl font-medium'>Услуги</h2>
				<div className='mt-4 grid gap-4'>
					{contract.services.length ? (
						contract.services.map(service => (
							<div
								key={service.id}
								className='rounded-lg border border-border p-4'
							>
								<div className='text-sm text-primary/60'>Услуга</div>
								<div className='mt-1 text-base font-medium'>
									{normalizeValue(service.serviceNameSnapshot)}
								</div>
								<div className='mt-2 text-sm'>
									Цена: {normalizeValue(service.price)}
								</div>
								<div className='text-sm'>
									Комментарий: {normalizeValue(service.comment)}
								</div>
							</div>
						))
					) : (
						<div>Услуги не указаны</div>
					)}
				</div>
			</div>

			<div className='mt-8'>
				<h2 className='text-xl font-medium'>Атрибутика</h2>
				<div className='mt-4 grid gap-4'>
					{contract.products.length ? (
						contract.products.map(product => (
							<div
								key={product.id}
								className='rounded-lg border border-border p-4'
							>
								<div className='text-sm text-primary/60'>Товар</div>
								<div className='mt-1 text-base font-medium'>
									{normalizeValue(product.nameSnapshot)}
								</div>
								<div className='mt-2 text-sm'>
									Количество: {normalizeValue(product.quantity)}
								</div>
								<div className='text-sm'>
									Цена за единицу: {normalizeValue(product.unitPrice)}
								</div>
								<div className='text-sm'>
									Комментарий: {normalizeValue(product.comment)}
								</div>
							</div>
						))
					) : (
						<div>Товары не указаны</div>
					)}
				</div>
			</div>
		</div>
	)
}
