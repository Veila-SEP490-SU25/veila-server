import { ItemAccessoryDto } from '@/app/accessory';
import { ItemDressDto } from '@/app/dress';
import { ShopOrderDto } from '@/app/order';
import { ItemServiceDto } from '@/app/service';
import { LogoUserDto } from '@/app/user';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class ProductFeedbacksDto {
  @Expose()
  @ApiProperty({ description: 'ID Feedback', example: 'uuid-feedback-1' })
  id: string;

  @Expose()
  @ApiProperty({ description: 'Tên người dùng đánh giá', example: 'customer123' })
  @Transform(({ obj: feedback }) => feedback.customer.username)
  username: string;

  @Expose()
  @ApiProperty({ description: 'Nội dung đánh giá', example: 'Váy rất đẹp!' })
  content: string;

  @Expose()
  @ApiProperty({ description: 'Điểm đánh giá', example: 4.5 })
  rating: number;

  @Expose()
  @ApiProperty({ description: 'Ảnh feedback (nếu có)', example: 'https://...' })
  images: string | null;
}

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
  customer: LogoUserDto;

  @Expose()
  @Type(() => ShopOrderDto)
  order: ShopOrderDto;

  @Expose()
  @Type(() => ItemDressDto)
  dress: ItemDressDto;

  @Expose()
  @Type(() => ItemServiceDto)
  service: ItemServiceDto;

  @Expose()
  @Type(() => ItemAccessoryDto)
  accessory: ItemAccessoryDto;
}
