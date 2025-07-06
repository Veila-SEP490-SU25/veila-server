import { Accessory, Category } from '@/common/models';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessoryController } from '@/app/accessory/accessory.controller';
import { AccessoryService } from '@/app/accessory/accessory.service';

@Module({
  imports: [TypeOrmModule.forFeature([Accessory, Category])],
  controllers: [AccessoryController],
  providers: [AccessoryService],
  exports: [AccessoryService],
})
export class AccessoryModule {}
