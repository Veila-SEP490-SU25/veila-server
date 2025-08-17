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
  user: ProductUserDto;

  @Expose()
  @Type(() => ProductCategoryDto)
  category: ProductCategoryDto;

  @Expose()
  @ApiProperty({ description: 'Ngày tạo blog', example: '2023-01-01T00:00:00Z' })
  createdAt: Date;

  @Expose()
  @ApiProperty({
    type: 'boolean',
    description: 'Trạng thái xác minh của blog',
    example: true,
    default: false,
    nullable: false,
  })
  isVerified: boolean;

  @Expose()
  @ApiProperty({
    enum: BlogStatus,
    description: 'Trạng thái của blog',
    example: BlogStatus.DRAFT,
    default: BlogStatus.DRAFT,
    nullable: false,
  })
  status: BlogStatus;

  @Expose()
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    example: '2023-10-01T12:00:00Z',
    description: 'The date when the record was last updated.',
  })
  updatedAt: Date;

  @Expose()
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    example: '2023-10-01T12:00:00Z',
    description: 'The date when the record was deleted. Null if not deleted.',
  })
  deletedAt: Date | null;
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
  user: ProductUserDto;

  @Expose()
  @Type(() => ProductCategoryDto)
  category: ProductCategoryDto;

  @Expose()
  @ApiProperty({ description: 'Ngày tạo blog', example: '2023-01-01T00:00:00Z' })
  createdAt: Date;

  @Expose()
  @ApiProperty({
    type: 'boolean',
    description: 'Trạng thái xác minh của blog',
    example: true,
    default: false,
    nullable: false,
  })
  isVerified: boolean;

  @Expose()
  @ApiProperty({
    enum: BlogStatus,
    description: 'Trạng thái của blog',
    example: BlogStatus.DRAFT,
    default: BlogStatus.DRAFT,
    nullable: false,
  })
  status: BlogStatus;

  @Expose()
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    example: '2023-10-01T12:00:00Z',
    description: 'The date when the record was last updated.',
  })
  updatedAt: Date;

  @Expose()
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    example: '2023-10-01T12:00:00Z',
    description: 'The date when the record was deleted. Null if not deleted.',
  })
  deletedAt: Date | null;
}
