import { ProductFeedbacksDto } from '@/app/feedback';
import { AccessoryStatus } from '@/common/models';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class ItemAccessoryDto {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  images: string | null;

  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty()
  description: string | null;

  @Expose()
  @ApiProperty()
  sellPrice: number;

  @Expose()
  @ApiProperty()
  rentalPrice: number;

  @Expose()
  @ApiProperty()
  isSellable: boolean;

  @Expose()
  @ApiProperty()
  isRentable: boolean;

  @Expose()
  @ApiProperty()
  ratingAverage: number;

  @Expose()
  @ApiProperty()
  ratingCount: number;

  @Expose()
  @ApiProperty()
  status: AccessoryStatus;

  @Expose()
  @Type(() => ProductFeedbacksDto)
  @ApiProperty({ type: [ProductFeedbacksDto] })
  feedbacks: ProductFeedbacksDto[];

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

export class CUAccessoryDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsString()
  @IsOptional()
  categoryId: string | null;

  @ApiProperty({ example: 'https://veila.images/1,https://veila.images/2' })
  @IsString()
  @IsOptional()
  images: string | null;

  @ApiProperty({ example: 'Vòng cổ ngọc trai' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Vòng cổ ngọc trai sang trọng, phù hợp với nhiều trang phục.' })
  @IsString()
  @IsOptional()
  description: string | null;

  @ApiProperty({ example: 150.0 })
  @IsNumber()
  sellPrice: number;

  @ApiProperty({ example: 200.0 })
  @IsNumber()
  rentalPrice: number;

  @ApiProperty({ example: true })
  @IsBoolean()
  isSellable: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  isRentable: boolean;

  @ApiProperty({ example: AccessoryStatus.AVAILABLE })
  @IsEnum(AccessoryStatus)
  status: AccessoryStatus;
}

export class ListAccessoryDto {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  images: string | null;

  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty()
  sellPrice: number;

  @Expose()
  @ApiProperty()
  rentalPrice: number;

  @Expose()
  @ApiProperty()
  isSellable: boolean;

  @Expose()
  @ApiProperty()
  isRentable: boolean;

  @Expose()
  @ApiProperty()
  ratingAverage: number;

  @Expose()
  @ApiProperty()
  status: AccessoryStatus;

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
