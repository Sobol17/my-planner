export function normalizePrice(rawPrice: number): string {
	const price = new Intl.NumberFormat('ru-RU', {
		maximumFractionDigits: 0
	}).format(rawPrice)

	return price + 'р.'
}
