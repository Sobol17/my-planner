import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ArticlesService } from './articles.service'
import { LkArticlesController } from './lk-articles.controller'
import { ClientArticlesController } from './client-articles.controller'
import { PrismaService } from '../prisma.service'
import { ArticleImageStorageService } from './infrastructure/article-image-storage.service'

@Module({
	imports: [ConfigModule],
	controllers: [LkArticlesController, ClientArticlesController],
	providers: [ArticlesService, PrismaService, ArticleImageStorageService]
})
export class ArticlesModule {}
