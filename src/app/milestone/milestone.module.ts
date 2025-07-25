import { Milestone } from '@/common/models';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MilestoneService } from './milestone.service';
import { OrderModule } from '../order';
import { MilestoneController } from './milestone.controller';
import { ShopModule } from '../shop';
import { TaskModule } from '../task';

@Module({
  imports: [TypeOrmModule.forFeature([Milestone]), OrderModule, ShopModule, TaskModule],
  controllers: [MilestoneController],
  providers: [MilestoneService],
  exports: [MilestoneService],
})
export class MilestoneModule {}
