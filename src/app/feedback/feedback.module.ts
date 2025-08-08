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

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Feedback,
      Order,
      OrderAccessoryDetail,
      OrderDressDetail,
      OrderServiceDetail,
    ]),
  ],
  controllers: [FeedbackController],
  providers: [FeedbackService],
  exports: [FeedbackService],
})
export class FeedbackModule {}
