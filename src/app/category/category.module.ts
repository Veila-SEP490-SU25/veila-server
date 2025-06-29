import { Module } from '@nestjs/common';
import { CategoryController } from '@/app/category/category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '@/common/models';
import { CategoryService } from '@/app/category/category.service';
import { DressModule } from '../dress';
import { ServiceModule } from '../service';
import { BlogModule } from '../blog';

@Module({
  imports: [TypeOrmModule.forFeature([Category]), DressModule, ServiceModule, BlogModule],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
