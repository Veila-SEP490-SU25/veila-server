import { ComplaintController } from '@/app/complaint/complaint.controller';
import { ComplaintService } from '@/app/complaint/complaint.service';
import { OrderModule } from '@/app/order';
import { Complaint } from '@/common/models';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MilestoneModule } from '../milestone';
import { ComplaintReason } from '@/common/models/single';
import { UserModule } from '@/app/user';
import { ShopModule } from '@/app/shop';

@Module({
  imports: [
    TypeOrmModule.forFeature([Complaint, ComplaintReason]),
    forwardRef(() => OrderModule),
    forwardRef(() => MilestoneModule),
    UserModule,
    ShopModule,
  ],
  controllers: [ComplaintController],
  providers: [ComplaintService],
  exports: [ComplaintService],
})
export class ComplaintModule {}
