import { BlogStatus } from '@/common/models';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
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
  @ApiProperty({ description: 'ID của shop sở hữu phụ kiện', example: 'uuid-shop-1' })
  @Transform(({ obj: user }) => user.shop.id)
  shopId: string;

  @Expose()
  @ApiProperty({ description: 'Tên của shop sở hữu phụ kiện', example: 'Cửa hàng thời trang ABC' })
  @Transform(({ obj: user }) => user.shop.name)
  shopName: string;

  @Expose()
  @ApiProperty({
    description: 'Địa chỉ của shop sở hữu phụ kiện',
    example: '123 Đường ABC, Quận 1, TP.HCM',
  })
  @Transform(({ obj: user }) => user.shop.address)
  shopAddress: string;

  @Expose()
  @ApiProperty({ description: 'Đánh giá trung bình của shop', example: 4.5 })
  @Transform(({ obj: user }) => user.shop.ratingAverage)
  shopRatingAverage: number;

  @Expose()
  @ApiProperty({ description: 'URL logo của shop', example: 'https://veila.images/logo-shop-1' })
  @Transform(({ obj: user }) => user.shop.logoUrl)
  shopLogoUrl: string;

  @Expose()
  @ApiProperty({ description: 'Đánh giá của shop', example: 4.5 })
  @Transform(({ obj: user }) => user.shop.reputation)
  shopReputation: number;

  @Expose()
  @ApiProperty({ description: 'ID danh mục phụ kiện', example: 'uuid-category-1' })
  @Transform(({ obj: category }) => category.id)
  categoryId: string;

  @Expose()
  @ApiProperty({ description: 'Tên danh mục phụ kiện', example: 'Phụ kiện thời trang' })
  @Transform(({ obj: category }) => category.name)
  categoryName: string;

  @Expose()
  @ApiProperty({ description: 'Loại danh mục phụ kiện', example: 'accessory' })
  @Transform(({ obj: category }) => category.type)
  categoryType: string;

  @Expose()
  @ApiProperty({
    description: 'Hình ảnh của danh mục phụ kiện',
    example: 'https://veila.images/category-1',
  })
  @Transform(({ obj: category }) => category.images)
  categoryImages: string | null;
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
  @ApiProperty({ description: 'ID của shop sở hữu phụ kiện', example: 'uuid-shop-1' })
  @Transform(({ obj: user }) => user.shop.id)
  shopId: string;

  @Expose()
  @ApiProperty({ description: 'Tên của shop sở hữu phụ kiện', example: 'Cửa hàng thời trang ABC' })
  @Transform(({ obj: user }) => user.shop.name)
  shopName: string;

  @Expose()
  @ApiProperty({
    description: 'Địa chỉ của shop sở hữu phụ kiện',
    example: '123 Đường ABC, Quận 1, TP.HCM',
  })
  @Transform(({ obj: user }) => user.shop.address)
  shopAddress: string;

  @Expose()
  @ApiProperty({ description: 'Đánh giá trung bình của shop', example: 4.5 })
  @Transform(({ obj: user }) => user.shop.ratingAverage)
  shopRatingAverage: number;

  @Expose()
  @ApiProperty({ description: 'URL logo của shop', example: 'https://veila.images/logo-shop-1' })
  @Transform(({ obj: user }) => user.shop.logoUrl)
  shopLogoUrl: string;

  @Expose()
  @ApiProperty({ description: 'Đánh giá của shop', example: 4.5 })
  @Transform(({ obj: user }) => user.shop.reputation)
  shopReputation: number;

  @Expose()
  @ApiProperty({ description: 'ID danh mục phụ kiện', example: 'uuid-category-1' })
  @Transform(({ obj: category }) => category.id)
  categoryId: string;

  @Expose()
  @ApiProperty({ description: 'Tên danh mục phụ kiện', example: 'Phụ kiện thời trang' })
  @Transform(({ obj: category }) => category.name)
  categoryName: string;

  @Expose()
  @ApiProperty({ description: 'Loại danh mục phụ kiện', example: 'accessory' })
  @Transform(({ obj: category }) => category.type)
  categoryType: string;

  @Expose()
  @ApiProperty({
    description: 'Hình ảnh của danh mục phụ kiện',
    example: 'https://veila.images/category-1',
  })
  @Transform(({ obj: category }) => category.images)
  categoryImages: string | null;
}
