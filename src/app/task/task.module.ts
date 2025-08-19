import { Task } from '@/common/models';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskService } from './task.service';
import { ShopModule } from '../shop';
import { OrderModule } from '../order';
import { MilestoneModule } from '../milestone';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task]),
    forwardRef(() => ShopModule),
    forwardRef(() => OrderModule),
    forwardRef(() => MilestoneModule),
  ],
  providers: [TaskService],
  exports: [TaskService],
})
export class TaskModule {}
