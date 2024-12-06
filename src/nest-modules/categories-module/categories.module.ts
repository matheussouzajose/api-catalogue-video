import { Module } from '@nestjs/common';
import { CATEGORY_PROVIDERS } from './categories.providers';
import { CategoriesController } from '@nest/categories-module/categories.controller';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          node: configService.get('ELASTICSEARCH_NODE'),
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [CategoriesController],
  providers: [
    ...Object.values(CATEGORY_PROVIDERS.REPOSITORIES),
    ...Object.values(CATEGORY_PROVIDERS.USE_CASES),
  ],
  exports: [CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide],
})
export class CategoriesModule {}
