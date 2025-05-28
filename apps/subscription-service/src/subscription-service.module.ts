import { Module } from '@nestjs/common';
import { SubscriptionModule } from './subscription/subscription.module';
import { PlansModule } from './plans/plans.module';

@Module({
  imports: [SubscriptionModule, PlansModule],
})
export class SubscriptionServiceModule {}
