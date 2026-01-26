import { Injectable } from '@nestjs/common'
import { CreateContractDto } from '../dto/create-contract.dto'

@Injectable()
export class ContractTemplateMapper {
	toTemplateData(input: {
		dto: CreateContractDto
		formattedContractDate: string
		contractDateParts: { day: string; month: string; year: string }
		servicesForCreate: Array<{
			serviceId: string
			serviceNameSnapshot: string
			price: number
			comment?: string
		}>
		productsForCreate: Array<{
			productId: string
			nameSnapshot: string
			quantity: number
			unitPrice: number
			comment?: string
		}>
		totals: { servicesTotal: number; productsTotal: number; total: number }
		formatNumber: (value: number) => string
		totalInWords: string
		deadmanBirthday?: string
		deadmanDeathDay?: string
	}) {
		const {
			dto,
			formattedContractDate,
			contractDateParts,
			servicesForCreate,
			productsForCreate,
			totals,
			deadmanBirthday,
			deadmanDeathDay
		} = input

		const services = servicesForCreate.map((item, index) => ({
			index: index + 1,
			service_id: item.serviceId,
			name: item.serviceNameSnapshot,
			price: item.price,
			comment: item.comment ?? ''
		}))

		const products = productsForCreate.map((item, index) => ({
			index: index + 1,
			product_id: item.productId,
			name: item.nameSnapshot,
			quantity: item.quantity,
			unit_price: item.unitPrice,
			total: item.quantity * item.unitPrice,
			comment: item.comment ?? ''
		}))

		return {
			contract_number: dto.contractNumber,
			contract_date: formattedContractDate,
			contract_day: contractDateParts.day,
			contract_month: contractDateParts.month,
			contract_year: contractDateParts.year,
			client_full_name: dto.clientFullName,
			client_phone: dto.clientPhone,
			price: input.formatNumber(totals.total),
			price_in_words: input.totalInWords,
			services_total: totals.servicesTotal,
			products_total: totals.productsTotal,
			deadman_full_name: dto.deadmanFullName,
			deadman_address: dto.deadmanAddress,
			deadman_age: dto.deadmanAge,
			deadman_birthday: deadmanBirthday ?? dto.deadmanBirthday,
			deadman_death_day: deadmanDeathDay ?? dto.deadmanDeathDay,
			comment: dto.comment ?? '',
			services,
			products
		}
	}
}
