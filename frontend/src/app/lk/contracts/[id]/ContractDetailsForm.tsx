'use client'

import { Controller } from 'react-hook-form'

import { Heading } from '@/components/ui/Heading'
import { Button } from '@/components/ui/buttons/Button'
import Checkbox from '@/components/ui/checkbox'
import { Field } from '@/components/ui/fields/Field'

import { SaleSelect } from './SaleSelect'
import type { UseContractDetailsReturn } from './hooks/useContractDetails'

interface ContractDetailsFormProps
	extends Pick<
		UseContractDetailsReturn,
		| 'errors'
		| 'register'
		| 'handleSubmit'
		| 'control'
		| 'serviceFields'
		| 'appendService'
		| 'removeService'
		| 'productFields'
		| 'appendProduct'
		| 'removeProduct'
		| 'calculatedPrice'
		| 'onSubmit'
		| 'isPending'
	> {}

interface ErrorMessageProps {
	message?: string
}

const ErrorMessage = ({ message }: ErrorMessageProps) => {
	if (!message) return null

	return <p className='mt-1 text-sm text-red-500'>{message}</p>
}

export function ContractDetailsForm({
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
	isPending
}: ContractDetailsFormProps) {
	return (
		<div>
			<Heading title='Новый договор' />

			<form
				className='mt-6 flex flex-col gap-8'
				onSubmit={handleSubmit(onSubmit)}
			>
				<div className='flex flex-col gap-6 w-1/2'>
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
							id='deadman_address'
							label='Адрес'
							placeholder='г. Москва, ул. Примерная, д. 10'
							{...register('deadman_address')}
						/>
						<ErrorMessage message={errors.deadman_address?.message} />
					</div>

					<div>
						<Field
							id='client_phone'
							label='Телефон'
							type='tel'
							placeholder='+79149242356'
							{...register('client_phone')}
						/>
						<ErrorMessage message={errors.client_phone?.message} />
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
											{...register(
												`services.${index}.service_id` as const
											)}
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

				<div>
					<Field
						id='comment'
						label='Комментарий'
						placeholder='Без доп. условий'
						{...register('comment')}
					/>
					<ErrorMessage message={errors.comment?.message} />
				</div>

				<div className='text-base font-medium flex items-end justify-between'>
					<div>
						<Controller
							control={control}
							name='sale_percent'
							render={({ field }) => (
								<SaleSelect
									value={field.value}
									onChange={field.onChange}
								/>
							)}
						/>
						<ErrorMessage message={errors.sale_percent?.message} />
						<div className='mt-3 flex items-center gap-2'>
							<Checkbox
								id='funeral_benefit_deduction'
								{...register('funeral_benefit_deduction')}
							/>
							<label
								htmlFor='funeral_benefit_deduction'
								className='text-sm text-primary/70'
							>
								Вычет пособия на погребение
							</label>
						</div>
					</div>
					Итоговая сумма: {calculatedPrice}
				</div>
				<input
					type='hidden'
					{...register('price', { valueAsNumber: true })}
				/>
				<ErrorMessage message={errors.price?.message} />

				<Button
					type='submit'
					disabled={isPending}
					className='max-w-[320px]'
				>
					Создать договор
				</Button>
			</form>
		</div>
	)
}
