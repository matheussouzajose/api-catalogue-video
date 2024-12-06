import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ElasticsearchModule } from '@nestjs/elasticsearch';

@Global()
@Module({
  imports: [
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        console.log(configService.get('ELASTICSEARCH_NODE'));
        return {
          node: configService.get('ELASTICSEARCH_NODE'),
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class ElasticSearchModule {}
