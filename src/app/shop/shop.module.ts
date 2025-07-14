import { Accessory, Blog, Category, Dress, License, Service, Shop } from '@/common/models';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShopController } from '@/app/shop/shop.controller';
import { ShopService } from '@/app/shop/shop.service';
import { ContractModule } from '@/app/contract';

@Module({
  imports: [
    TypeOrmModule.forFeature([Shop, Accessory, Blog, Service, Dress, Category, License]),
    ContractModule,
  ],
  controllers: [ShopController],
  providers: [ShopService],
  exports: [ShopService],
})
export class ShopModule {}
