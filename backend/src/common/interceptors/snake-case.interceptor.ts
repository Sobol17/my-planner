import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor
} from '@nestjs/common'
import { map, Observable } from 'rxjs'

const toSnakeCaseKey = (key: string) =>
	key
		.replace(/([a-z0-9])([A-Z])/g, '$1_$2')
		.replace(/[-\s]+/g, '_')
		.toLowerCase()

const isPlainObject = (value: unknown): value is Record<string, unknown> => {
	if (!value || typeof value !== 'object') return false
	const proto = Object.getPrototypeOf(value)
	return proto === Object.prototype || proto === null
}

const transformToSnakeCase = (value: unknown): unknown => {
	if (Array.isArray(value)) return value.map(transformToSnakeCase)
	if (value instanceof Date) return value
	if (isPlainObject(value)) {
		const result: Record<string, unknown> = {}
		for (const [key, nestedValue] of Object.entries(value)) {
			result[toSnakeCaseKey(key)] = transformToSnakeCase(nestedValue)
		}
		return result
	}
	return value
}

@Injectable()
export class SnakeCaseInterceptor implements NestInterceptor {
	intercept(
		_context: ExecutionContext,
		next: CallHandler
	): Observable<unknown> {
		return next.handle().pipe(map((data) => transformToSnakeCase(data)))
	}
}
