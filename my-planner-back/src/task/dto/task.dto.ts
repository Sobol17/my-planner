import { Transform } from 'class-transformer'
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator'
import { Priority } from 'prisma/generated/client'

export class TaskDto {
	@IsOptional()
	@IsString()
	name: string

	@IsOptional()
	@IsBoolean()
	isCompleted?: boolean

	@IsOptional()
	@IsString()
	createdAt?: string

	@IsEnum(Priority)
	@IsOptional()
	@Transform(({ value }) => ('' + value).toLowerCase())
	priority?: Priority
}
