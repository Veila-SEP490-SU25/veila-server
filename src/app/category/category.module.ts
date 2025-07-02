import { Module } from '@nestjs/common';
import { CategoryController } from '@/app/category/category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '@/common/models';
import { CategoryService } from '@/app/category/category.service';
import { DressModule } from '@/app/dress';
import { ServiceModule } from '@/app/service';
import { BlogModule } from '@/app/blog';
import { AccessoryModule } from '@/app/accessory';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category]),
    DressModule,
    ServiceModule,
    BlogModule,
    AccessoryModule,
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
