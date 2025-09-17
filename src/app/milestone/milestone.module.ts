import { Milestone } from '@/common/models';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MilestoneService } from './milestone.service';
import { OrderModule } from '../order';
import { MilestoneController } from './milestone.controller';
import { ShopModule } from '../shop';
import { TaskModule } from '../task';
import { ComplaintModule } from '../complaint';
import { AppSettingModule } from '@/app/appsetting';

@Module({
  imports: [
    TypeOrmModule.forFeature([Milestone]),
    forwardRef(() => OrderModule),
    ShopModule,
    forwardRef(() => TaskModule),
    forwardRef(() => ComplaintModule),
    AppSettingModule,
  ],
  controllers: [MilestoneController],
  providers: [MilestoneService],
  exports: [MilestoneService],
})
export class MilestoneModule {}
