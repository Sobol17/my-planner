import { Type } from 'class-transformer'
import {
	ArrayNotEmpty,
	IsArray,
	IsDateString,
	IsInt,
	IsOptional,
	IsString,
	Min,
	ValidateNested
} from 'class-validator'

export class CreateContractServiceDto {
	@IsString()
	serviceId: string

	@IsOptional()
	@IsInt()
	@Min(0)
	price?: number

	@IsOptional()
	@IsString()
	comment?: string
}

export class CreateContractProductDto {
	@IsString()
	productId: string

	@IsOptional()
	@IsInt()
	@Min(1)
	quantity?: number

	@IsOptional()
	@IsInt()
	@Min(0)
	unitPrice?: number

	@IsOptional()
	@IsString()
	comment?: string
}

export class CreateContractDto {
	@IsString()
	contractNumber: string

	@IsDateString()
	contractDate: string

	@IsString()
	clientFullName: string

	@IsString()
	clientPhone: string

	@IsInt()
	@Min(0)
	price: number

	@IsOptional()
	@IsString()
	comment?: string

	@IsString()
	deadmanAddress: string

	@IsString()
	deadmanFullName: string

	@IsInt()
	@Min(0)
	deadmanAge: number

	@IsDateString()
	deadmanBirthday: string

	@IsDateString()
	deadmanDeathDay: string

	@IsArray()
	@ArrayNotEmpty()
	@ValidateNested({ each: true })
	@Type(() => CreateContractServiceDto)
	services: CreateContractServiceDto[]

	@IsArray()
	@ArrayNotEmpty()
	@ValidateNested({ each: true })
	@Type(() => CreateContractProductDto)
	products: CreateContractProductDto[]
}
