import { DressStatus } from '@/common/models';
import { ApiProperty } from '@nestjs/swagger';
import { ProductFeedbacksDto } from '@/app/feedback';
import { Expose, Transform, Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class CUDressDto {
  @ApiProperty({
    description: 'ID danh mục (category)',
    example: 'category-uuid-123',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  categoryId: string | null;

  @ApiProperty({ description: 'Tên váy cưới', example: 'Đầm cưới công chúa' })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Mô tả sản phẩm (tối đa 500 ký tự)',
    example: 'Váy dạ hội đỏ sang trọng, phù hợp cho các buổi tiệc lớn.',
    maxLength: 500,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  description: string | null;

  @ApiProperty({ description: 'Giá bán (VNĐ)', example: 5000000 })
  @IsNumber()
  sellPrice: number;

  @ApiProperty({ description: 'Giá thuê (VNĐ)', example: 1500000 })
  @IsNumber()
  rentalPrice: number;

  @ApiProperty({ description: 'Có thể bán không', example: true })
  @IsBoolean()
  isSellable: boolean;

  @ApiProperty({ description: 'Có thể cho thuê không', example: true })
  @IsBoolean()
  isRentable: boolean;

  @ApiProperty({
    enum: DressStatus,
    description: 'Trạng thái váy cưới',
    example: DressStatus.AVAILABLE,
  })
  @IsEnum(DressStatus)
  status: DressStatus;

  @ApiProperty({
    description: 'Ảnh đại diện váy cưới (URL)',
    example: 'https://storage.veila.com/dresses/img123.jpg',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  images: string | null;
}

export class ListDressDto {
  @Expose()
  @ApiProperty({ description: 'ID váy cưới', example: 'dress-uuid-123' })
  id: string;

  @Expose()
  @ApiProperty({ description: 'Tên váy cưới', example: 'Đầm cưới công chúa' })
  name: string;

  @Expose()
  @ApiProperty({
    description: 'Ảnh đại diện váy cưới (URL)',
    example: 'https://storage.veila.com/dresses/img123.jpg',
    nullable: true,
  })
  images: string | null;

  @Expose()
  @ApiProperty({ description: 'Điểm đánh giá trung bình', example: 4.8 })
  ratingAverage: number;

  @Expose()
  @ApiProperty({ description: 'Giá bán (VNĐ)', example: 5000000 })
  sellPrice: number;

  @Expose()
  @ApiProperty({ description: 'Giá thuê (VNĐ)', example: 1500000 })
  rentalPrice: number;

  @Expose()
  @ApiProperty({ description: 'Có thể bán không', example: true })
  isSellable: boolean;

  @Expose()
  @ApiProperty({ description: 'Có thể cho thuê không', example: true })
  isRentable: boolean;

  @Expose()
  @ApiProperty({
    enum: DressStatus,
    description: 'Trạng thái váy cưới',
    example: DressStatus.AVAILABLE,
  })
  status: DressStatus;

  @Expose()
  @ApiProperty({ description: 'ID của shop sở hữu phụ kiện', example: 'uuid-shop-1' })
  @Transform(({ obj: user }) => user.shop.id)
  shopId: string;

  @Expose()
  @ApiProperty({ description: 'Tên của shop sở hữu phụ kiện', example: 'Cửa hàng thời trang ABC' })
  @Transform(({ obj: user }) => user.shop.name)
  shopName: string;

  @Expose()
  @ApiProperty({ description: 'Địa chỉ của shop sở hữu phụ kiện', example: '123 Đường ABC, Quận 1, TP.HCM' })
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
}

export class ItemDressDto {
  @Expose()
  @ApiProperty({ description: 'ID váy cưới', example: 'dress-uuid-123' })
  id: string;

  @Expose()
  @ApiProperty({ description: 'Tên váy cưới', example: 'Đầm cưới công chúa' })
  name: string;

  @Expose()
  @ApiProperty({
    type: 'string',
    description: 'Mô tả sản phẩm (tối đa 500 ký tự)',
    example: 'Váy dạ hội đỏ sang trọng, phù hợp cho các buổi tiệc lớn.',
    maxLength: 500,
    nullable: true,
  })
  description: string | null;

  @Expose()
  @ApiProperty({
    description: 'Ảnh đại diện váy cưới (URL)',
    example: 'https://storage.veila.com/dresses/img123.jpg',
    nullable: true,
  })
  images: string | null;

  @Expose()
  @ApiProperty({ description: 'Điểm đánh giá trung bình', example: 4.8 })
  ratingAverage: number;

  @Expose()
  @ApiProperty({
    type: 'integer',
    description: 'Số lượng đánh giá mà sản phẩm đã nhận được',
    example: 123,
    minimum: 0,
    default: 0,
  })
  ratingCount: number;

  @Expose()
  @ApiProperty({ description: 'Giá bán (VNĐ)', example: 5000000 })
  sellPrice: number;

  @Expose()
  @ApiProperty({ description: 'Giá thuê (VNĐ)', example: 1500000 })
  rentalPrice: number;

  @Expose()
  @ApiProperty({ description: 'Có thể bán không', example: true })
  isSellable: boolean;

  @Expose()
  @ApiProperty({ description: 'Có thể cho thuê không', example: true })
  isRentable: boolean;

  @Expose()
  @ApiProperty({
    enum: DressStatus,
    description: 'Trạng thái váy cưới',
    example: DressStatus.AVAILABLE,
  })
  status: DressStatus;

  @Expose()
  @Type(() => ProductFeedbacksDto)
  @ApiProperty({
    description: 'Danh sách feedback của váy cưới',
    type: [ProductFeedbacksDto],
  })
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
  @ApiProperty({ description: 'Địa chỉ của shop sở hữu phụ kiện', example: '123 Đường ABC, Quận 1, TP.HCM' })
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
}
