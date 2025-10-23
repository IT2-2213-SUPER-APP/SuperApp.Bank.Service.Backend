import { NestFactory } from '@nestjs/core';
import { WalletModule } from './wallet.module';

async function bootstrap() {
  const app = await NestFactory.create(WalletModule);
  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
