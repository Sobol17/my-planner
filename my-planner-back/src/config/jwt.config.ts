import { ConfigService } from '@nestjs/config'
import { JwtModuleOptions } from '@nestjs/jwt'

export const getJwtConfig = (
	configService: ConfigService
): JwtModuleOptions => {
	const secret = configService.get<string>('JWT_SECRET')

	if (!secret) {
		throw new Error('JWT_SECRET is not set')
	}
	return {
		secret
	}
}
