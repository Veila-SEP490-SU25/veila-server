import { CategoryType } from '@/common/models';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsString, MaxLength } from 'class-validator';

export class CUCategoryDto {
  @ApiProperty({
    description: 'Tên danh mục sản phẩm (tối đa 50 ký tự)',
    example: 'Đầm Dự Tiệc',
    maxLength: 50,
    required: true,
  })
  @IsString()
  @MaxLength(50)
  name: string;

  @ApiProperty({
    enum: CategoryType,
    description: 'Loại danh mục sản phẩm',
    example: CategoryType.DRESS,
    required: true,
  })
  @IsEnum(CategoryType)
  type: CategoryType;
}

export class ListCategoryDto {
  @Expose()
  @ApiProperty({ description: 'ID danh mục', example: 'category-uuid-123' })
  id: string;

  @Expose()
  @ApiProperty({ description: 'Tên danh mục', example: 'Đầm Dự Tiệc' })
  name: string;

  @Expose()
  @ApiProperty({ enum: CategoryType, description: 'Loại danh mục', example: CategoryType.DRESS })
  type: CategoryType;
}

export class ItemCategoryDto {
  @Expose()
  @ApiProperty({ description: 'ID danh mục', example: 'category-uuid-123' })
  id: string;

  @Expose()
  @ApiProperty({ description: 'Tên danh mục', example: 'Đầm Dự Tiệc' })
  name: string;

  @Expose()
  @ApiProperty({ enum: CategoryType, description: 'Loại danh mục', example: CategoryType.DRESS })
  type: CategoryType;
}

export class ProductCategoryDto {
  @Expose()
  @ApiProperty({ description: 'ID danh mục', example: 'category-uuid-123' })
  id: string;

  @Expose()
  @ApiProperty({ description: 'Tên danh mục', example: 'Đầm Dự Tiệc' })
  name: string;

  @Expose()
  @ApiProperty({ enum: CategoryType, description: 'Loại danh mục', example: CategoryType.DRESS })
  type: CategoryType;
}
