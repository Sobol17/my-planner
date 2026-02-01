export const BENEFIT = 11000

export function rub(value: number): string {
	if (!Number.isFinite(value)) return '—'
	return new Intl.NumberFormat('ru-RU', {
		style: 'currency',
		currency: 'RUB',
		maximumFractionDigits: 0,
		minimumFractionDigits: 0
	}).format(Math.round(value))
}

export function computePackagePrice(
	basePrice: number,
	fenceIncluded: boolean,
	fence: number,
	hasFenceToggle: boolean
): number {
	let v = basePrice - BENEFIT
	if (hasFenceToggle && !fenceIncluded) v -= fence
	return Math.max(0, v)
}
