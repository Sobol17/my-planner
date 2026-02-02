import type {
	ContractDto,
	IContract,
	IContractDocument,
	IContractProduct,
	IContractService
} from '@/types/contracts.types'

import { formatDate } from './formatDate'
import { normalizePrice } from './normalizePrice'

const documentMapper = (
	document: ContractDto['document']
): IContractDocument => ({
	id: document.id,
	originalName: document.original_name,
	createdAt: document.created_at
})

const serviceMapper = (
	service: ContractDto['services'][number]
): IContractService => ({
	id: service.id,
	contractId: service.contract_id,
	serviceId: service.service_id,
	price: service.price,
	comment: service.comment,
	serviceNameSnapshot: service.service_name_snapshot
})

const productMapper = (
	product: ContractDto['products'][number]
): IContractProduct => ({
	id: product.id,
	contractId: product.contract_id,
	productId: product.product_id,
	quantity: product.quantity,
	unitPrice: product.unit_price,
	comment: product.comment,
	nameSnapshot: product.name_snapshot
})

export function contractsMapper(rawObject: ContractDto): IContract {
	return {
		id: rawObject.id,
		contractNumber: rawObject.contract_number,
		contractDate: rawObject.contract_date,
		clientFullName: rawObject.client_full_name,
		clientPhone: rawObject.client_phone,
		price: normalizePrice(rawObject.price),
		comment: rawObject.comment,
		deadmanAddress: rawObject.deadman_address,
		deadmanFullName: rawObject.deadman_full_name ?? '-',
		deadmanAge: rawObject.deadman_age,
		deadmanBirthday: formatDate(rawObject.deadman_birthday),
		deadmanDeathDay: formatDate(rawObject.deadman_death_day),
		services: rawObject.services.map(serviceMapper),
		products: rawObject.products.map(productMapper),
		document: documentMapper(rawObject.document),
		createdAt: formatDate(rawObject.created_at),
		updatedAt: rawObject.updated_at
	}
}
