import { CategoryType } from '@/common/models';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

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
    description: 'Mô tả ngắn gọn về danh mục sản phẩm (tối đa 255 ký tự)',
    example: 'Những mẫu đầm dự tiệc sang trọng và thanh lịch',
    maxLength: 255,
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description: string | null;

  @ApiProperty({ example: 'https://veila.images/1,https://veila.images/2' })
  @IsOptional()
  @IsString()
  images: string | null;

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
  @ApiProperty({
    description: 'Ảnh đại diện danh mục (URL)',
    example: 'https://storage.veila.com/categories/img123.jpg',
    nullable: true,
  })
  images: string | null;

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
  @ApiProperty({
    description: 'Ảnh đại diện danh mục (URL)',
    example: 'https://storage.veila.com/categories/img123.jpg',
    nullable: true,
  })
  images: string | null;

  @Expose()
  @ApiProperty({
    description: 'Mô tả danh mục',
    example: 'Những mẫu đầm dự tiệc sang trọng và thanh lịch',
    nullable: true,
  })
  description: string | null;

  @Expose()
  @ApiProperty({ enum: CategoryType, description: 'Loại danh mục', example: CategoryType.DRESS })
  type: CategoryType;
}
