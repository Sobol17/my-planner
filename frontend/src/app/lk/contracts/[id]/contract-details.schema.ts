import { z } from 'zod'

const toNumber = (value: unknown) => {
	if (typeof value === 'number') {
		return Number.isNaN(value) ? undefined : value
	}

	if (typeof value === 'string') {
		const trimmed = value.trim()
		if (!trimmed) return undefined
		const parsed = Number(trimmed)
		return Number.isNaN(parsed) ? undefined : parsed
	}

	return undefined
}

const requiredString = (message: string) =>
	z
		.string({ required_error: message })
		.trim()
		.min(1, message)

const requiredNumber = (
	requiredMessage: string,
	minValue: number,
	minMessage: string,
	invalidMessage: string
) =>
	z.preprocess(
		toNumber,
		z
			.number({
				required_error: requiredMessage,
				invalid_type_error: invalidMessage
			})
			.min(minValue, minMessage)
	)

const requiredPercent = (
	requiredMessage: string,
	invalidMessage: string,
	minMessage: string,
	maxMessage: string
) =>
	z.preprocess(
		toNumber,
		z
			.number({
				required_error: requiredMessage,
				invalid_type_error: invalidMessage
			})
			.min(0, minMessage)
			.max(100, maxMessage)
	)

const dateString = (
	requiredMessage: string,
	formatMessage: string,
	invalidMessage: string
) =>
	requiredString(requiredMessage)
		.refine(value => /^\d{4}-\d{2}-\d{2}$/.test(value), formatMessage)
		.refine(value => !Number.isNaN(Date.parse(value)), invalidMessage)

const serviceSchema = z.object({
	service_id: requiredString('Укажите ID услуги'),
	price: requiredNumber(
		'Укажите цену услуги',
		0,
		'Цена услуги должна быть 0 или больше',
		'Цена услуги должна быть числом'
	),
	comment: requiredString('Укажите комментарий к услуге')
})

const productSchema = z.object({
	product_id: requiredString('Укажите ID товара'),
	quantity: requiredNumber(
		'Укажите количество',
		1,
		'Количество должно быть 1 или больше',
		'Количество должно быть числом'
	),
	unit_price: requiredNumber(
		'Укажите цену за единицу',
		0,
		'Цена за единицу должна быть 0 или больше',
		'Цена за единицу должна быть числом'
	)
})

export const contractDetailsSchema = z.object({
	contract_number: requiredString('Укажите номер договора'),
	contract_date: dateString(
		'Укажите дату договора',
		'Дата договора должна быть в формате ГГГГ-ММ-ДД',
		'Укажите корректную дату договора'
	),
	client_full_name: requiredString('Укажите ФИО заказчика'),
	client_passport: requiredString('Укажите паспорт заказчика'),
	price: requiredNumber(
		'Укажите стоимость',
		0,
		'Стоимость должна быть 0 или больше',
		'Стоимость должна быть числом'
	),
	sale_percent: requiredPercent(
		'Укажите процент скидки',
		'Процент скидки должен быть числом',
		'Процент скидки должен быть 0 или больше',
		'Процент скидки должен быть 100 или меньше'
	),
	funeral_benefit_deduction: z.boolean().optional(),
	comment: requiredString('Укажите комментарий'),
	deadman_address: requiredString('Укажите адрес'),
	deadman_full_name: requiredString('Укажите ФИО умершего'),
	deadman_age: requiredNumber(
		'Укажите возраст умершего',
		0,
		'Возраст должен быть 0 или больше',
		'Возраст должен быть числом'
	),
	deadman_birthday: dateString(
		'Укажите дату рождения',
		'Дата рождения должна быть в формате ГГГГ-ММ-ДД',
		'Укажите корректную дату рождения'
	),
	deadman_death_day: dateString(
		'Укажите дату смерти',
		'Дата смерти должна быть в формате ГГГГ-ММ-ДД',
		'Укажите корректную дату смерти'
	),
	services: z.array(serviceSchema).min(1, 'Добавьте хотя бы одну услугу'),
	products: z.array(productSchema).min(1, 'Добавьте хотя бы один товар')
})

export type ContractDetailsSchema = z.infer<typeof contractDetailsSchema>
