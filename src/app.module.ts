import { CategoriesModule } from '@nest/categories-module/categories.module';
import { ConfigModule } from '@nest/config-module/config-module';
import { EventModule } from '@nest/event-module/event-module';
import { Module } from '@nestjs/common';

@Module({
  imports: [ConfigModule.forRoot(), EventModule, CategoriesModule],
  controllers: [],
})
export class AppModule {}
