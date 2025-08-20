import {
  Feedback,
  Order,
  OrderAccessoryDetail,
  OrderDressDetail,
  OrderServiceDetail,
} from '@/common/models';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedbackController } from '@/app/feedback/feedback.controller';
import { FeedbackService } from '@/app/feedback/feedback.service';
import { ServiceModule } from '@/app/service';
import { AccessoryModule } from '@/app/accessory';
import { DressModule } from '@/app/dress';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Feedback,
      Order,
      OrderAccessoryDetail,
      OrderDressDetail,
      OrderServiceDetail,
    ]),
    ServiceModule,
    AccessoryModule,
    DressModule,
  ],
  controllers: [FeedbackController],
  providers: [FeedbackService],
  exports: [FeedbackService],
})
export class FeedbackModule {}
