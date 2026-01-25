export function formatDate(timestamp: number | string): string {
	if (typeof timestamp === 'string') {
		const trimmed = timestamp.trim()
		if (!trimmed) return ''

		const asNumber = Number(trimmed)
		if (Number.isFinite(asNumber)) {
			return formatFromNumber(asNumber)
		}

		const dateFromString = new Date(trimmed)
		if (Number.isNaN(dateFromString.getTime())) return ''

		return formatFromDate(dateFromString)
	}

	if (!Number.isFinite(timestamp)) return ''

	return formatFromNumber(timestamp)
}

function formatFromNumber(value: number): string {
	const ms = value < 1_000_000_000_000 ? value * 1000 : value
	const date = new Date(ms)

	if (Number.isNaN(date.getTime())) return ''

	return formatFromDate(date)
}

function formatFromDate(date: Date): string {
	const day = String(date.getDate()).padStart(2, '0')
	const month = String(date.getMonth() + 1).padStart(2, '0')
	const year = date.getFullYear()

	return `${day}.${month}.${year}`
}
