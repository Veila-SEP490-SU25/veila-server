import { Module } from '@nestjs/common';
import { CategoryController } from '@/app/category/category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '@/common/models';
import { CategoryService } from '@/app/category/category.service';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
