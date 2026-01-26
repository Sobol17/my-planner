import { Injectable } from '@nestjs/common'

@Injectable()
export class ContractCalculator {
	formatNumber(value: number) {
		return new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 })
			.format(value)
			.replace(/\u00A0/g, ' ')
	}

	totals(
		services: { price: number }[],
		products: { quantity: number; unitPrice: number }[]
	) {
		const servicesTotal = services.reduce((sum, item) => sum + item.price, 0)
		const productsTotal = products.reduce(
			(sum, item) => sum + item.quantity * item.unitPrice,
			0
		)
		const total = servicesTotal + productsTotal
		return { servicesTotal, productsTotal, total }
	}
}
