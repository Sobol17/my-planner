import { BadRequestException } from '@nestjs/common'

const monthNames = [
	'январь',
	'февраль',
	'март',
	'апрель',
	'май',
	'июнь',
	'июль',
	'август',
	'сентябрь',
	'октябрь',
	'ноябрь',
	'декабрь'
]

export const ensureUniqueIds = (values: string[], errorMessage: string) => {
	const unique = new Set(values)
	if (unique.size !== values.length) {
		throw new BadRequestException(errorMessage)
	}
	return [...unique]
}

export const toDateTime = (value: string, fieldLabel: string) => {
	const isDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(value)
	const date = new Date(isDateOnly ? `${value}T00:00:00.000Z` : value)
	if (Number.isNaN(date.getTime())) {
		throw new BadRequestException(`Неверный формат даты для ${fieldLabel}`)
	}
	return date
}

export const getDateParts = (value: string, fieldLabel: string) => {
	const dateOnlyMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
	if (dateOnlyMatch) {
		toDateTime(value, fieldLabel)
		const [, year, month, day] = dateOnlyMatch
		const monthIndex = Number(month) - 1
		return {
			day: String(Number(day)),
			month: monthNames[monthIndex] ?? '',
			year: year.slice(-2)
		}
	}
	const date = toDateTime(value, fieldLabel)
	return {
		day: String(date.getUTCDate()),
		month: monthNames[date.getUTCMonth()] ?? '',
		year: String(date.getUTCFullYear()).slice(-2)
	}
}
