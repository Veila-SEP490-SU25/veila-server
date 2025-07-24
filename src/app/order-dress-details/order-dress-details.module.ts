import { OrderDressDetail } from '@/common/models';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderDressDetailsService } from './order-dress-details.service';
import { DressModule } from '../dress';

@Module({
  imports: [TypeOrmModule.forFeature([OrderDressDetail]), DressModule],
  providers: [OrderDressDetailsService],
  exports: [OrderDressDetailsService],
})
export class OrderDressDetailsModule {}
