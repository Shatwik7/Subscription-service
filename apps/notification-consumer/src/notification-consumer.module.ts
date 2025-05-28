import { Module } from '@nestjs/common';
import { NotificationConsumerService } from './notification-consumer.service';
import { KafkaConsumerService } from './kafka-consume.service';

@Module({
  imports: [],
  controllers: [],
  providers: [NotificationConsumerService, KafkaConsumerService],
})
export class NotificationConsumerModule {}
