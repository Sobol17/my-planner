import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor
} from '@nestjs/common'
import { Observable } from 'rxjs'

const toCamelCaseKey = (key: string) =>
	key.replace(/[-_\s]+([a-zA-Z0-9])/g, (_, char: string) =>
		char.toUpperCase()
	)

const isPlainObject = (value: unknown): value is Record<string, unknown> => {
	if (!value || typeof value !== 'object') return false
	const proto = Object.getPrototypeOf(value)
	return proto === Object.prototype || proto === null
}

const transformToCamelCase = (value: unknown): unknown => {
	if (Array.isArray(value)) return value.map(transformToCamelCase)
	if (value instanceof Date) return value
	if (isPlainObject(value)) {
		const result: Record<string, unknown> = {}
		for (const [key, nestedValue] of Object.entries(value)) {
			result[toCamelCaseKey(key)] = transformToCamelCase(nestedValue)
		}
		return result
	}
	return value
}

const replaceObjectContents = (
	target: Record<string, unknown>,
	source: Record<string, unknown>
) => {
	for (const key of Object.keys(target)) delete target[key]
	Object.assign(target, source)
}

@Injectable()
export class SnakeToCamelInterceptor implements NestInterceptor {
	intercept(
		context: ExecutionContext,
		next: CallHandler
	): Observable<unknown> {
		const request = context.switchToHttp().getRequest()
		if (request?.body) request.body = transformToCamelCase(request.body)
		if (isPlainObject(request?.query)) {
			replaceObjectContents(
				request.query,
				transformToCamelCase(request.query) as Record<string, unknown>
			)
		}
		if (isPlainObject(request?.params)) {
			replaceObjectContents(
				request.params,
				transformToCamelCase(request.params) as Record<string, unknown>
			)
		}
		return next.handle()
	}
}
