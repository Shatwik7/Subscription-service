import { NestFactory } from '@nestjs/core';
import { AuditLogConsumerModule } from './audit-log-consumer.module';

async function bootstrap() {
  const app = await NestFactory.create(AuditLogConsumerModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
