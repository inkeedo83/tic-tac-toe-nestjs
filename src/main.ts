import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const port = (process.env.PORT || 3000) as number;
  const app = await NestFactory.create(AppModule);
  await app.listen(port, () => console.log(`http://localhost:${port}`));
}
bootstrap();
