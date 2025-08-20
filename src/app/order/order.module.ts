import { Order, OrderServiceDetail, UpdateOrderServiceDetail } from '@/common/models';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { UserModule } from '../user';
import { ShopModule } from '../shop/shop.module';
import { OrderAccessoriesDetailsModule } from '../order-accessories-details';
import { OrderDressDetailsModule } from '../order-dress-details';
import { ComplaintModule } from '@/app/complaint';
import { DressModule } from '../dress';
import { WalletModule } from '../wallet';
import { ServiceModule } from '@/app/service';
import { RequestModule } from '@/app/request';
import { MilestoneModule } from '@/app/milestone';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderServiceDetail, UpdateOrderServiceDetail]),
    UserModule,
    ShopModule,
    OrderAccessoriesDetailsModule,
    OrderDressDetailsModule,
    ComplaintModule,
    DressModule,
    WalletModule,
    ServiceModule,
    RequestModule,
    forwardRef(() => MilestoneModule),
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
