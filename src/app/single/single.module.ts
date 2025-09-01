import { SingleController, SingleService } from '@/app/single';
import { ComplaintReason } from '@/common/models/single';
import { MilestoneTemplate } from '@/common/models/single/milestone-template.model';
import { Slide } from '@/common/models/single/slide.model';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Slide, MilestoneTemplate, ComplaintReason])],
  controllers: [SingleController],
  providers: [SingleService],
  exports: [SingleService],
})
export class SingleModule {}
