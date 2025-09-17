import { AppSettingController } from '@/app/appsetting/appsetting.controller';
import { AppSettingService } from '@/app/appsetting/appsetting.service';
import { AppSetting, ComplaintReason, MilestoneTemplate } from '@/common/models/single';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([AppSetting, MilestoneTemplate, ComplaintReason])],
  controllers: [AppSettingController],
  providers: [AppSettingService],
  exports: [AppSettingService],
})
export class AppSettingModule {}
