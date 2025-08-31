import { AppSettingController } from '@/app/appsetting/appsetting.controller';
import { AppSettingService } from '@/app/appsetting/appsetting.service';
import { AppSetting } from '@/common/models/single/appsetting.model';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([AppSetting])],
  controllers: [AppSettingController],
  providers: [AppSettingService],
  exports: [AppSettingService],
})
export class AppSettingModule {}
