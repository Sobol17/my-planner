import { IsString, IsNumber, IsOptional, IsDateString } from 'class-validator'

export class CreateContractDto {
	@IsString()
	contractNumber: string

	@IsDateString()
	contractDate: string

	@IsString()
	clientFullName: string

	@IsString()
	clientPassport: string

	@IsNumber()
	price: number

	@IsOptional()
	@IsString()
	comment?: string
}
