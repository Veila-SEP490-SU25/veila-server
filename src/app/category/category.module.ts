import { Module } from '@nestjs/common';
import { CategoryController } from '@/app/category/category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Accessory, Blog, Category, Dress, Service } from '@/common/models';
import { CategoryService } from '@/app/category/category.service';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Accessory, Blog, Dress, Service])],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
