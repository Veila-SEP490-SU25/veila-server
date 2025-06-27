import { CategoryType } from '@/common/models';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

export class CategoryDto {
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
  @ApiProperty({ description: 'ID danh mục', example: 'category-uuid-123' })
  id: string;

  @ApiProperty({ description: 'Tên danh mục', example: 'Đầm Dự Tiệc' })
  name: string;

  @ApiProperty({ description: 'Ảnh đại diện danh mục (URL)', example: 'https://storage.veila.com/categories/img123.jpg', nullable: true })
  images: string | null;

  @ApiProperty({ enum: CategoryType, description: 'Loại danh mục', example: CategoryType.DRESS })
  type: CategoryType;
}

export class ItemCategoryDto {
  @ApiProperty({ description: 'ID danh mục', example: 'category-uuid-123' })
  id: string;

  @ApiProperty({ description: 'Tên danh mục', example: 'Đầm Dự Tiệc' })
  name: string;

  @ApiProperty({ description: 'Ảnh đại diện danh mục (URL)', example: 'https://storage.veila.com/categories/img123.jpg', nullable: true })
  images: string | null;

  @ApiProperty({ description: 'Mô tả danh mục', example: 'Những mẫu đầm dự tiệc sang trọng và thanh lịch', nullable: true })
  description: string | null;

  @ApiProperty({ enum: CategoryType, description: 'Loại danh mục', example: CategoryType.DRESS })
  type: CategoryType;
}
