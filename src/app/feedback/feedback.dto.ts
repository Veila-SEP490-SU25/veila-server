import { ItemAccessoryDto } from '@/app/accessory';
import { ItemDressDto } from '@/app/dress';
import { ItemServiceDto } from '@/app/service';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CUFeedbackDto {
  @ApiProperty({ description: 'ID đơn hàng', example: 'uuid-order-1' })
  @IsString()
  orderId: string;

  @ApiProperty({ description: 'ID sản phẩm', example: 'uuid-dress/service/accessory-1' })
  @IsString()
  productId: string;

  @ApiProperty({ description: 'Nội dung đánh giá', example: 'Váy rất đẹp!' })
  @IsString()
  content: string;

  @ApiProperty({ description: 'Điểm đánh giá', example: 4.5 })
  @IsNumber()
  rating: number;

  @ApiProperty({ description: 'Ảnh feedback (nếu có)', example: 'https://...' })
  @IsString()
  @IsOptional()
  images: string | null;
}

export class OrderShopDto {
  @Expose()
  @ApiProperty({ description: 'ID của shop sở hữu phụ kiện', example: 'uuid-shop-1' })
  id: string;

  @Expose()
  @ApiProperty({ description: 'Tên của shop sở hữu phụ kiện', example: 'Cửa hàng thời trang ABC' })
  name: string;

  @Expose()
  @ApiProperty({
    description: 'Địa chỉ của shop sở hữu phụ kiện',
    example: '123 Đường ABC, Quận 1, TP.HCM',
  })
  address: string;

  @Expose()
  @ApiProperty({ description: 'URL logo của shop', example: 'https://veila.images/logo-shop-1' })
  logoUrl: string;

  @Expose()
  @ApiProperty({ description: 'Đánh giá của shop', example: 4.5 })
  reputation: number;
}

export class FeedbackOrderDto {
  @Expose()
  @Type(() => OrderShopDto)
  @ApiProperty({ type: () => OrderShopDto })
  shop: OrderShopDto;
}

export class LogoUserDto {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  username: string;

  @Expose()
  @ApiProperty()
  avatarUrl: string | null;
}

export class ItemFeedbackDto {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  content: string;

  @Expose()
  @ApiProperty()
  rating: number;

  @Expose()
  @ApiProperty()
  images: string | null;

  @Expose()
  @ApiProperty()
  createdAt: Date;

  @Expose()
  @Type(() => LogoUserDto)
  @ApiProperty({ type: () => LogoUserDto })
  customer: LogoUserDto;

  @Expose()
  @Type(() => FeedbackOrderDto)
  @ApiProperty({ type: () => FeedbackOrderDto })
  order: FeedbackOrderDto;

  @Expose()
  @Type(() => ItemDressDto)
  @ApiProperty({ type: () => ItemDressDto })
  dress: ItemDressDto;

  @Expose()
  @Type(() => ItemServiceDto)
  @ApiProperty({ type: () => ItemServiceDto })
  service: ItemServiceDto;

  @Expose()
  @Type(() => ItemAccessoryDto)
  @ApiProperty({ type: () => ItemAccessoryDto })
  accessory: ItemAccessoryDto;
}
