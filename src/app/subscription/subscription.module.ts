import { SubscriptionController } from '@/app/subscription/subscription.controller';
import { SubscriptionService } from '@/app/subscription/subscription.service';
import { Subscription } from '@/common/models';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Subscription])],
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
