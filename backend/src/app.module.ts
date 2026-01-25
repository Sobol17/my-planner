import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module.js'
import { UserModule } from './user/user.module.js'
import { ContractsModule } from './contracts/contracts.module';
import { ServicesModule } from './services/services.module';
import { ProductsModule } from './products/products.module';

@Module({
	imports: [
		ConfigModule.forRoot(),
		AuthModule,
		UserModule,
		ContractsModule,
		ServicesModule,
		ProductsModule,
	]
})
export class AppModule {}
