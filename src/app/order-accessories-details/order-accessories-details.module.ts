import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderAccessoryDetail } from '@/common/models';
import { OrderAccessoriesDetailsService } from '@/app/order-accessories-details/order-accessories-details.service';
import { AccessoryModule } from '../accessory';

@Module({
  imports: [TypeOrmModule.forFeature([OrderAccessoryDetail]), forwardRef(() => AccessoryModule)],
  providers: [OrderAccessoriesDetailsService],
  exports: [OrderAccessoriesDetailsService],
})
export class OrderAccessoriesDetailsModule {}
