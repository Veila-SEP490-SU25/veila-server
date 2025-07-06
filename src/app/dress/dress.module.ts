import { Category, Dress } from '@/common/models';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DressController } from '@/app/dress/dress.controller';
import { DressService } from '@/app/dress/dress.service';

@Module({
  imports: [TypeOrmModule.forFeature([Dress, Category])],
  controllers: [DressController],
  providers: [DressService],
  exports: [DressService],
})
export class DressModule {}
