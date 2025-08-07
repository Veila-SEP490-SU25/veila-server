import { Order } from '@/common/models';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { UserModule } from '../user';
import { ShopModule } from '../shop/shop.module';
import { OrderAccessoriesDetailsModule } from '../order-accessories-details';
import { OrderDressDetailsModule } from '../order-dress-details';
import { AccessoryModule } from '../accessory';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    UserModule,
    ShopModule,
    OrderAccessoriesDetailsModule,
    OrderDressDetailsModule,
    AccessoryModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
