import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { PlansService } from '../plans/plans.service';
import { KafkaProducerService } from '../KafkaProducer/kafka.service';

@Module({
  controllers: [SubscriptionController],
  providers: [SubscriptionService, PlansService, KafkaProducerService],
  exports: [KafkaProducerService],
})
export class SubscriptionModule {}
