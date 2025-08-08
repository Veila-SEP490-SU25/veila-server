import { OrderStatus, OrderType } from '@/common/models';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CUOrderAccessoriesDetailDto } from '../order-accessories-details';
import { CUOrderDressDetailDto } from '../order-dress-details';
import { ProductShopDto } from '@/app/shop';

export class CUOrderDto {
  @IsNotEmpty()
  @IsString()
  customerId: string;

  @ApiProperty({
    description: 'ID của cửa hàng',
    example: 'shop-uuid-123',
    nullable: false,
  })
  @IsNotEmpty()
  @IsString()
  shopId: string;

  @ApiProperty({
    description: 'Số điện thoại liên hệ',
    example: '0123456789',
    nullable: false,
  })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({
    description: 'Email liên hệ',
    example: 'customer.example@gmail.com',
    nullable: true,
  })
  @IsString()
  email: string | null;

  @ApiProperty({
    description: 'Địa chỉ giao hàng',
    example: '123 Đường ABC, Quận X, TP Y',
    nullable: false,
  })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({
    description: 'Hạn giao hàng cho khách',
    example: '2023-12-31',
    nullable: false,
  })
  @IsNotEmpty()
  @IsDate()
  dueDate: Date;

  @ApiProperty({
    description: 'Ngày trả hàng (nếu có)',
    example: '2024-01-15',
    nullable: true,
  })
  @IsDate()
  returnDate: Date | null;
}
export class OrderDto {
  @Expose()
  @ApiProperty({
    description: 'ID của đơn hàng',
    example: 'order-uuid-123',
    nullable: false,
  })
  @IsNotEmpty()
  @IsString()
  id: string;

  @Expose()
  @ApiProperty({
    description: 'Tên của khách hàng',
    example: 'customer-123',
    nullable: false,
  })
  @IsNotEmpty()
  @IsString()
  @Transform(({ obj: order }) => order.user.name)
  customerName: string;

  @Expose()
  @ApiProperty({
    description: 'Tên của cửa hàng',
    example: 'shop-123',
    nullable: false,
  })
  @IsNotEmpty()
  @IsString()
  @Transform(({ obj: order }) => order.shop.name)
  shopName: string;

  @Expose()
  @ApiProperty({
    description: 'Số điện thoại của khách hàng để liên hệ',
    example: '0123456789',
    nullable: false,
  })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @Expose()
  @ApiProperty({
    description: 'Email liên hệ',
    example: 'customer.example@gmail.com',
    nullable: true,
  })
  @IsString()
  email: string | null;

  @Expose()
  @ApiProperty({
    description: 'Địa chỉ giao hàng',
    example: '123 Đường ABC, Quận X, TP Y',
    nullable: false,
  })
  @IsNotEmpty()
  @IsString()
  address: string;

  @Expose()
  @ApiProperty({
    description: 'Hạn giao hàng cho khách',
    example: '2023-12-31',
    nullable: false,
  })
  @IsNotEmpty()
  @IsDate()
  dueDate: Date;

  @Expose()
  @ApiProperty({
    description: 'Ngày trả hàng (nếu có)',
    example: '2024-01-15',
    nullable: true,
  })
  @IsDate()
  returnDate: Date | null;

  @Expose()
  @ApiProperty({
    description: 'Cửa hàng có mua lại váy cưới sau khi may cho khách không',
    example: 'true',
    nullable: false,
  })
  @IsNotEmpty()
  @IsBoolean()
  isBuyBack: boolean;

  @Expose()
  @ApiProperty({
    description: 'Tổng giá trị đơn hàng (VNĐ)',
    example: 5000000,
    nullable: false,
  })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @Expose()
  @ApiProperty({
    description: 'Loại đơn hàng',
    example: OrderType.SELL,
    enum: OrderType,
    nullable: false,
  })
  @IsNotEmpty()
  type: OrderType;

  @Expose()
  @ApiProperty({
    description: 'Trạng thái đơn hàng',
    example: OrderStatus.PENDING,
    enum: OrderStatus,
    nullable: false,
  })
  @IsNotEmpty()
  status: OrderStatus;
}

export class createOrderRequestDto {
  @ApiProperty()
  @ValidateNested()
  @Type(() => CUOrderDto)
  newOrder: CUOrderDto;

  @ApiProperty({ type: () => [CUOrderDressDetailDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CUOrderDressDetailDto)
  dressDetails: CUOrderDressDetailDto[];

  @ApiProperty({ type: () => [CUOrderAccessoriesDetailDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CUOrderAccessoriesDetailDto)
  accessoriesDetails: CUOrderAccessoriesDetailDto[];
}

export class ShopOrderDto {
  @Expose()
  @Type(() => ProductShopDto)
  shop: ProductShopDto;
}
