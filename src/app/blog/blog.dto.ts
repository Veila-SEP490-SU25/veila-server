import { ProductCategoryDto } from '@/app/category/category.dto';
import { ProductUserDto } from '@/app/user/user.dto';
import { BlogStatus } from '@/common/models';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class CUBlogDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsString()
  @IsOptional()
  categoryId: string | null;

  @ApiProperty({ example: 'Hướng dẫn chọn váy dạ hội hoàn hảo' })
  @IsString()
  title: string;

  @ApiProperty({
    example:
      'Trong bài viết này, chúng ta sẽ khám phá cách chọn váy dạ hội hoàn hảo cho từng dịp...',
  })
  @IsString()
  content: string;

  @ApiProperty({ example: 'https://veila.images/1,https://veila.images/2' })
  @IsString()
  @IsOptional()
  images: string | null;

  @ApiProperty({ example: BlogStatus.DRAFT })
  @IsEnum(BlogStatus)
  status: BlogStatus;
}

export class ListBlogDto {
  @Expose()
  @ApiProperty({ description: 'ID blog', example: 'blog-uuid-123' })
  id: string;

  @Expose()
  @ApiProperty({ description: 'Tiêu đề blog', example: 'Bí quyết chọn váy cưới đẹp' })
  title: string;

  @Expose()
  @ApiProperty({
    description: 'Ảnh đại diện blog (URL)',
    example: 'https://storage.veila.com/blogs/img123.jpg',
    nullable: true,
  })
  images: string | null;

  @Expose()
  @Type(() => ProductUserDto)
  @ApiProperty({
    description: 'Thông tin người dùng sở hữu dịch vụ',
    type: () => ProductUserDto,
  })
  user: ProductUserDto;

  @Expose()
  @Type(() => ProductCategoryDto)
  @ApiProperty({
    description: 'Thông tin danh mục dịch vụ',
    type: () => ProductCategoryDto,
  })
  category: ProductCategoryDto;
}

export class ItemBlogDto {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  images: string | null;

  @Expose()
  @ApiProperty()
  title: string;

  @Expose()
  @ApiProperty()
  content: string;

  @Expose()
  @Type(() => ProductUserDto)
  @ApiProperty({
    description: 'Thông tin người dùng sở hữu dịch vụ',
    type: () => ProductUserDto,
  })
  user: ProductUserDto;

  @Expose()
  @Type(() => ProductCategoryDto)
  @ApiProperty({
    description: 'Thông tin danh mục dịch vụ',
    type: () => ProductCategoryDto,
  })
  category: ProductCategoryDto;
}
