export const formatYmdToDmy = (value: string) => {
	const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
	if (!match) {
		throw new Error('Invalid date format')
	}

	const [, year, month, day] = match
	const date = new Date(`${year}-${month}-${day}T00:00:00.000Z`)
	if (
		Number.isNaN(date.getTime()) ||
		date.getUTCFullYear() !== Number(year) ||
		date.getUTCMonth() + 1 !== Number(month) ||
		date.getUTCDate() !== Number(day)
	) {
		throw new Error('Invalid date value')
	}

	return `${day}.${month}.${year}`
}
