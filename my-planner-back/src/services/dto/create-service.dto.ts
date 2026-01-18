import {
	IsBoolean,
	IsInt,
	IsOptional,
	IsString,
	Min
} from 'class-validator'

export class CreateServiceDto {
	@IsString()
	name: string

	@IsInt()
	@Min(0)
	defaultPrice: number

	@IsOptional()
	@IsBoolean()
	isActive?: boolean
}
