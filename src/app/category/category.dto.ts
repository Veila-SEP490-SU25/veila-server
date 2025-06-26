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
