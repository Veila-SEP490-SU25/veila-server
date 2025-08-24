import {
  Accessory,
  Blog,
  Category,
  Dress,
  License,
  Service,
  Shop,
  Subscription,
  User,
} from '@/common/models';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShopController } from '@/app/shop/shop.controller';
import { ShopService } from '@/app/shop/shop.service';
import { MembershipModule } from '@/app/membership';
import { ContractModule } from '@/app/contract';
import { UserModule } from '@/app/user';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Shop,
      Accessory,
      Blog,
      Service,
      Dress,
      Category,
      License,
      User,
      Subscription,
    ]),
    forwardRef(() => MembershipModule),
    ContractModule,
    UserModule,
  ],
  controllers: [ShopController],
  providers: [ShopService],
  exports: [ShopService],
})
export class ShopModule {}
