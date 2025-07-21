import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderAccessoryDetail } from '@/common/models';
import { OrderAccessoriesDetailsService } from '@/app/order-accessories-details/order-accessories-details.service';

@Module({
  imports: [TypeOrmModule.forFeature([OrderAccessoryDetail])],
  providers: [OrderAccessoriesDetailsService],
  exports: [OrderAccessoriesDetailsService],
})
export class OrderAccessoriesDetailsModule {}
