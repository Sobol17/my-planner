import { IBase } from './root.types'

export interface ContractDto extends IBase {
	id: string
	contract_number: string
	contract_date: string
	client_full_name: string
	client_phone: string
	price: number
	comment: string
	deadman_address: string
	deadman_full_name: string | null
	deadman_age: number
	deadman_birthday: string
	deadman_death_day: string
	services: Service[]
	products: Product[]
	document: Document
}

export interface ContractCreateDto {
	contract_number: string
	contract_date: string
	client_full_name: string
	client_phone: string
	price: number
	sale_percent: number
	comment: string
	deadman_address: string
	deadman_full_name: string
	deadman_age: number
	deadman_birthday: string
	deadman_death_day: string
	services: ContractCreateService[]
	products: ContractCreateProduct[]
}

export interface ContractCreateResponse {
	id: string
	document_id: string
	url: string
}

export interface ContractCreateService {
	service_id: string
	price: number
	comment: string
}

export interface ContractCreateProduct {
	product_id: string
	quantity: number
	unit_price: number
}

export interface IContract {
	id: string
	contractNumber: string
	contractDate: string
	clientFullName: string
	clientPhone: string
	price: string
	comment: string
	deadmanAddress: string
	deadmanFullName: string | null
	deadmanAge: number
	deadmanBirthday: string
	deadmanDeathDay: string
	services: IContractService[]
	products: IContractProduct[]
	document: IContractDocument
	createdAt?: string
	updatedAt?: string
}

export interface IContractDocument {
	id: string
	originalName: string
	createdAt: string
}

export interface IContractService {
	id: string
	contractId: string
	serviceId: string
	price: number
	comment: string
	serviceNameSnapshot: string
}

export interface IContractProduct {
	id: string
	contractId: string
	productId: string
	quantity: number
	unitPrice: number
	comment: string | null
	nameSnapshot: string
}

export interface Document {
	id: string
	original_name: string
	created_at: string
}

export interface Service {
	id: string
	contract_id: string
	service_id: string
	price: number
	comment: string
	service_name_snapshot: string
}

export interface Product {
	id: string
	contract_id: string
	product_id: string
	quantity: number
	unit_price: number
	comment: string | null
	name_snapshot: string
}
