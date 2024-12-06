import { applyGlobalConfig } from '@nest/global-config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;
  applyGlobalConfig(app);
  await app.listen(port);
}
bootstrap();
