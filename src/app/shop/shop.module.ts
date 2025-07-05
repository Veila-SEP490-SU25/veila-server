import { Accessory, Blog, Category, Dress, Service, Shop } from '@/common/models';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShopController } from '@/app/shop/shop.controller';
import { ShopService } from '@/app/shop/shop.service';
import { DressModule } from '@/app/dress';
import { CategoryModule } from '@/app/category';
import { BlogModule } from '@/app/blog';
import { ServiceModule } from '@/app/service';
import { AccessoryModule } from '@/app/accessory';

@Module({
  imports: [
    TypeOrmModule.forFeature([Shop, Accessory, Blog, Service, Dress, Category]),
    DressModule,
    CategoryModule,
    BlogModule,
    ServiceModule,
    AccessoryModule,
  ],
  controllers: [ShopController],
  providers: [ShopService],
  exports: [ShopService],
})
export class ShopModule {}
