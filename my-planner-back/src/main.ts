import { NestFactory } from '@nestjs/core'
import * as cookieParser from 'cookie-parser'
import { AppModule } from './app.module'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	app.setGlobalPrefix('api')

	// потому что у cookie-parser нет типизации
	app.use(cookieParser())
	app.enableCors({
		origin: ['http://localhost:3000', 'http://localhost:3001'],
		credentials: true,
		exposedHeaders: 'set-cookie'
	})

	await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
