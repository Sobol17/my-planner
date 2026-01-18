import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { getJwtConfig } from 'src/config/jwt.config'
import { UserModule } from 'src/user/user.module'
import { AuthController } from './auth.controller.js'
import { AuthService } from './auth.service.js'
import { JwtStrategy } from './jwt.strategy.js'

// импортируем UserModule потому, что в нём содержится UserService.
// В UserModule его надо экспортировать ОБЯЗАТЕЛЬНО!
@Module({
	imports: [
		UserModule,
		ConfigModule,
		// Правильный импорт jwt модуля. Благодаря этому я смогу в auth.service достать JwtService
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getJwtConfig
		})
	],
	controllers: [AuthController],
	providers: [AuthService, JwtStrategy]
})
export class AuthModule {}
