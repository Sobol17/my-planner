'use client'

import type { ReactNode } from 'react'

import { Heading } from '@/components/ui/Heading'
import Loader from '@/components/ui/Loader'
import { Button } from '@/components/ui/buttons/Button'
import { Field } from '@/components/ui/fields/Field'

import { formatDate } from '@/utils/formatDate'

import { useContractDetails } from './useContractDetails'

interface ContractDetailsProps {
	id: string
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

interface ErrorMessageProps {
	message?: string
}

const ErrorMessage = ({ message }: ErrorMessageProps) => {
	if (!message) return null

	return <p className='mt-1 text-sm text-red-500'>{message}</p>
}

export function ContractDetails({ id }: ContractDetailsProps) {
	const {
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
	} = useContractDetails({ id })

	if (!isCreate) {
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
			{ label: 'Паспорт заказчика', value: contract.clientPassport },
			{ label: 'Стоимость', value: contract.price },
			{ label: 'Комментарий', value: contract.comment },
			{ label: 'Адрес', value: contract.deadmanAddress },
			{ label: 'ФИО умершего', value: contract.deadmanFullName },
			{ label: 'Возраст умершего', value: contract.deadmanAge },
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

				<div className='grid grid-cols-2 gap-6 mt-6'>
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

	return (
		<div>
			<Heading title='Новый договор' />

			<form
				className='mt-6 grid gap-8'
				onSubmit={handleSubmit(onSubmit)}
			>
				<div className='grid grid-cols-2 gap-6'>
					<div>
						<Field
							id='contract_number'
							label='Номер договора'
							placeholder='A-2026-003'
							{...register('contract_number')}
						/>
						<ErrorMessage message={errors.contract_number?.message} />
					</div>

					<div>
						<Field
							id='contract_date'
							label='Дата договора'
							placeholder='2026-01-18'
							type='date'
							{...register('contract_date')}
						/>
						<ErrorMessage message={errors.contract_date?.message} />
					</div>

					<div>
						<Field
							id='client_full_name'
							label='ФИО заказчика'
							placeholder='Иванов Иван Иванович'
							{...register('client_full_name')}
						/>
						<ErrorMessage message={errors.client_full_name?.message} />
					</div>

					<div>
						<Field
							id='client_passport'
							label='Паспорт'
							placeholder='4510 123456'
							{...register('client_passport')}
						/>
						<ErrorMessage message={errors.client_passport?.message} />
					</div>

					<div>
						<Field
							id='price'
							label='Стоимость'
							placeholder='15000'
							type='number'
							isNumber
							{...register('price', {
								valueAsNumber: true
							})}
						/>
						<ErrorMessage message={errors.price?.message} />
					</div>

					<div>
						<Field
							id='comment'
							label='Комментарий'
							placeholder='Без доп. условий'
							{...register('comment')}
						/>
						<ErrorMessage message={errors.comment?.message} />
					</div>

					<div>
						<Field
							id='deadman_address'
							label='Адрес'
							placeholder='г. Москва, ул. Примерная, д. 10'
							{...register('deadman_address')}
						/>
						<ErrorMessage message={errors.deadman_address?.message} />
					</div>

					<div>
						<Field
							id='deadman_full_name'
							label='ФИО умершего'
							placeholder='Смирнов Тест Тестович'
							{...register('deadman_full_name')}
						/>
						<ErrorMessage message={errors.deadman_full_name?.message} />
					</div>

					<div>
						<Field
							id='deadman_age'
							label='Возраст'
							placeholder='62'
							type='number'
							isNumber
							{...register('deadman_age', {
								valueAsNumber: true
							})}
						/>
						<ErrorMessage message={errors.deadman_age?.message} />
					</div>

					<div>
						<Field
							id='deadman_birthday'
							label='Дата рождения'
							placeholder='1963-04-12'
							type='date'
							{...register('deadman_birthday')}
						/>
						<ErrorMessage message={errors.deadman_birthday?.message} />
					</div>

					<div>
						<Field
							id='deadman_death_day'
							label='Дата смерти'
							placeholder='2026-01-10'
							type='date'
							{...register('deadman_death_day')}
						/>
						<ErrorMessage message={errors.deadman_death_day?.message} />
					</div>
				</div>

				<div>
					<div className='flex items-center justify-between'>
						<h2 className='text-xl font-medium'>Услуги</h2>
						<Button
							type='button'
							onClick={() =>
								appendService({ service_id: '', price: 0, comment: '' })
							}
						>
							Добавить услугу
						</Button>
					</div>

					<div className='mt-4 grid gap-4'>
						{serviceFields.map((field, index) => (
							<div
								key={field.id}
								className='rounded-lg border border-border p-4'
							>
								<div className='grid grid-cols-3 gap-4'>
									<div>
										<Field
											id={`services.${index}.service_id`}
											label='ID услуги'
											placeholder='cmkj9qzoe0000mtligly32tiy'
											{...register(`services.${index}.service_id` as const)}
										/>
										<ErrorMessage
											message={errors.services?.[index]?.service_id?.message}
										/>
									</div>

									<div>
										<Field
											id={`services.${index}.price`}
											label='Цена'
											placeholder='4200'
											type='number'
											isNumber
											{...register(`services.${index}.price` as const, {
												valueAsNumber: true
											})}
										/>
										<ErrorMessage
											message={errors.services?.[index]?.price?.message}
										/>
									</div>

									<div>
										<Field
											id={`services.${index}.comment`}
											label='Комментарий'
											placeholder='Морг, СМЭ-7'
											{...register(`services.${index}.comment` as const)}
										/>
										<ErrorMessage
											message={errors.services?.[index]?.comment?.message}
										/>
									</div>
								</div>

								<div className='mt-4 flex justify-end'>
									<Button
										type='button'
										onClick={() => removeService(index)}
										disabled={serviceFields.length === 1}
									>
										Удалить услугу
									</Button>
								</div>
							</div>
						))}
					</div>
				</div>

				<div>
					<div className='flex items-center justify-between'>
						<h2 className='text-xl font-medium'>Товары</h2>
						<Button
							type='button'
							onClick={() =>
								appendProduct({ product_id: '', quantity: 1, unit_price: 0 })
							}
						>
							Добавить товар
						</Button>
					</div>

					<div className='mt-4 grid gap-4'>
						{productFields.map((field, index) => (
							<div
								key={field.id}
								className='rounded-lg border border-border p-4'
							>
								<div className='grid grid-cols-3 gap-4'>
									<div>
										<Field
											id={`products.${index}.product_id`}
											label='ID товара'
											placeholder='cmkjautz70000dtlislz77ye2'
											{...register(`products.${index}.product_id` as const)}
										/>
										<ErrorMessage
											message={errors.products?.[index]?.product_id?.message}
										/>
									</div>

									<div>
										<Field
											id={`products.${index}.quantity`}
											label='Количество'
											placeholder='1'
											type='number'
											isNumber
											{...register(`products.${index}.quantity` as const, {
												valueAsNumber: true
											})}
										/>
										<ErrorMessage
											message={errors.products?.[index]?.quantity?.message}
										/>
									</div>

									<div>
										<Field
											id={`products.${index}.unit_price`}
											label='Цена за единицу'
											placeholder='3000'
											type='number'
											isNumber
											{...register(`products.${index}.unit_price` as const, {
												valueAsNumber: true
											})}
										/>
										<ErrorMessage
											message={errors.products?.[index]?.unit_price?.message}
										/>
									</div>
								</div>

								<div className='mt-4 flex justify-end'>
									<Button
										type='button'
										onClick={() => removeProduct(index)}
										disabled={productFields.length === 1}
									>
										Удалить товар
									</Button>
								</div>
							</div>
						))}
					</div>
				</div>

				<Button
					type='submit'
					disabled={isPending}
				>
					Создать договор
				</Button>
			</form>
		</div>
	)
}
