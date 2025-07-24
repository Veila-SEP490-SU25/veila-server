import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CUOrderAccessoriesDetailDto {
  @ApiProperty({ description: 'ID của đơn hàng', example: 'order-uuid-1' })
  @IsNotEmpty()
  @IsString()
  orderId: string;

  @ApiProperty({ description: 'ID của phụ kiện', example: 'accessory-uuid-1' })
  @IsNotEmpty()
  @IsString()
  accessoryId: string;

  @ApiProperty({ description: 'Số lượng phụ kiện', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @ApiProperty({ description: 'Mô tả về phụ kiện', example: 'Phụ kiện này đẳng cấp' })
  description: string | null;

  @ApiProperty({ description: 'Giá của phụ kiện', example: 200000 })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({ description: 'Phụ kiện đã được đánh giá hay chưa', example: true })
  @IsNotEmpty()
  @IsBoolean()
  is_rated: boolean;
}

export class OrderAccessoriesDetailDto {
  @Expose()
  @ApiProperty({ description: 'ID của các phụ kiện trong đơn hàng', example: 'uuid-accessory-1' })
  id: string;

  @Expose()
  @ApiProperty({ description: 'ID của đơn hàng', example: 'uuid-order-1' })
  @Transform(({ obj: orderAccessoryDetail }) => orderAccessoryDetail.order.id)
  orderId: string;

  @Expose()
  @ApiProperty({ description: 'Tên của phụ kiện', example: 'Phụ kiện 1' })
  @Transform(({ obj: orderAccessoryDetail }) => orderAccessoryDetail.accessory.name)
  name: string;

  @Expose()
  @ApiProperty({ description: 'Số lượng phụ kiện', example: 1 })
  quantity: number;

  @Expose()
  @ApiProperty({ description: 'Mô tả về phụ kiện', example: 'Phụ kiện này đẳng cấp' })
  description: string | null;

  @Expose()
  @ApiProperty({ description: 'Giá của phụ kiện', example: 200000 })
  price: number;

  @Expose()
  @ApiProperty({ description: 'Phụ kiện đã được đánh giá hay chưa', example: true })
  is_rated: boolean;
}
