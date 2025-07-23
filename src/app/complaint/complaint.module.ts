import { ComplaintController } from '@/app/complaint/complaint.controller';
import { ComplaintService } from '@/app/complaint/complaint.service';
import { Complaint } from '@/common/models';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Complaint])],
  controllers: [ComplaintController],
  providers: [ComplaintService],
  exports: [ComplaintService],
})
export class ComplaintModule {}
