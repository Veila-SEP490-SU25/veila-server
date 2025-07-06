import { Accessory, Blog, Category, Dress, Service, Shop } from '@/common/models';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShopController } from '@/app/shop/shop.controller';
import { ShopService } from '@/app/shop/shop.service';

@Module({
  imports: [TypeOrmModule.forFeature([Shop, Accessory, Blog, Service, Dress, Category])],
  controllers: [ShopController],
  providers: [ShopService],
  exports: [ShopService],
})
export class ShopModule {}
