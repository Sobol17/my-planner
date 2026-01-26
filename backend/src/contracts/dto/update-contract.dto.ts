import { IsDateString, IsInt, IsOptional, IsString, Min } from 'class-validator'

export class UpdateContractDto {
	@IsOptional()
	@IsString()
	contractNumber?: string

	@IsOptional()
	@IsDateString()
	contractDate?: string

	@IsOptional()
	@IsString()
	clientFullName?: string

	@IsOptional()
	@IsString()
	clientPhone?: string

	@IsOptional()
	@IsInt()
	@Min(0)
	price?: number

	@IsOptional()
	@IsString()
	comment?: string

	@IsOptional()
	@IsString()
	deadmanAddress?: string

	@IsOptional()
	@IsString()
	deadmanFullName?: string

	@IsOptional()
	@IsInt()
	@Min(0)
	deadmanAge?: number

	@IsOptional()
	@IsDateString()
	deadmanBirthday?: string

	@IsOptional()
	@IsDateString()
	deadmanDeathDay?: string
}
