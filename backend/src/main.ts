import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import * as cookieParser from 'cookie-parser'
import { AppModule } from './app.module'
import { SnakeCaseInterceptor } from './common/interceptors/snake-case.interceptor'
import { SnakeToCamelInterceptor } from './common/interceptors/snake-to-camel.interceptor'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	app.setGlobalPrefix('api')

	// потому что у cookie-parser нет типизации
	app.use(cookieParser())
	app.useGlobalInterceptors(
		new SnakeToCamelInterceptor(),
		new SnakeCaseInterceptor()
	)
	app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))
	app.enableCors({
		origin: ['http://localhost:3000', 'http://localhost:3001'],
		credentials: true,
		exposedHeaders: 'set-cookie'
	})

	await app.listen(process.env.PORT ?? 4200)
}
bootstrap()
