import { SingleController, SingleService } from '@/app/single';
import { MilestoneTemplate } from '@/common/models/single/milestone-template.model';
import { Slide } from '@/common/models/single/slide.model';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Slide, MilestoneTemplate])],
  controllers: [SingleController],
  providers: [SingleService],
  exports: [SingleService],
})
export class SingleModule {}
