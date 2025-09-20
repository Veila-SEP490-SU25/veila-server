import { OrderStatus, OrderType } from '@/common/models';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CUOrderAccessoriesDetailDto } from '@/app/order-accessories-details/order-accessories-details.dto';
import { CUOrderDressDetailDto } from '@/app/order-dress-details/order-dress-details.dto';

export class OtpPaymentDto {
  @Expose()
  @ApiProperty({
    description: 'Mã OTP giao dịch',
    example: '123456',
    nullable: false,
  })
  @IsNotEmpty()
  @IsString()
  otp: string;
}

export class COrderDto {
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
  @Type(() => Date)
  @IsDate()
  dueDate: Date;

  @ApiProperty({
    description: 'Ngày trả hàng (nếu có)',
    example: '2024-01-15',
    nullable: true,
  })
  @Type(() => Date)
  @IsOptional()
  @IsDate()
  returnDate: Date | null;

  @ApiProperty({
    description: 'Đây là loại mua hay thuê váy cưới',
    example: OrderType.SELL,
    nullable: false,
  })
  @IsNotEmpty()
  type: OrderType;
}

export class UOrderDto {
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
    nullable: false,
  })
  @IsString()
  email: string;

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
  @Type(() => Date)
  @IsDate()
  dueDate: Date;

  @ApiProperty({
    description: 'Ngày trả hàng (nếu có)',
    example: '2024-01-15',
    nullable: true,
  })
  @Type(() => Date)
  @IsOptional()
  @IsDate()
  returnDate: Date | null;

  @ApiProperty({
    description: 'Giá trị đơn hàng custom (nếu có)',
    example: 5000000,
    nullable: true,
  })
  @IsOptional()
  @IsNumber()
  price: number | null;
}

export class OrderCustomerNameDto {}

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
  @Transform(({ obj: order }) => order.customer.username)
  customerName: string;

  @Expose()
  @ApiProperty({
    description: 'Tên của cửa hàng',
    example: 'shop-123',
    nullable: false,
  })
  @IsNotEmpty()
  @IsString()
  @Transform(({ obj: order }) => order.shop?.name ?? null)
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

export class CreateOrderRequestDto {
  @ApiProperty()
  @ValidateNested()
  @Type(() => COrderDto)
  newOrder: COrderDto;

  @ApiProperty({ type: () => CUOrderDressDetailDto })
  @ValidateNested()
  @Type(() => CUOrderDressDetailDto)
  dressDetails: CUOrderDressDetailDto;

  @ApiProperty({ type: () => [CUOrderAccessoriesDetailDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CUOrderAccessoriesDetailDto)
  accessoriesDetails: CUOrderAccessoriesDetailDto[];
}

export class CreateOrderForCustom {
  @ApiProperty({
    description: 'Số điện thoại của khách hàng',
    example: '0123456789',
    nullable: false,
  })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({
    description: 'Email của khách hàng',
    example: 'customer@example.com',
    nullable: false,
  })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({
    description: 'Địa chỉ giao hàng',
    example: '123 Đường ABC, Quận X, TP Y',
    nullable: false,
  })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({
    description: 'ID yêu cầu',
    example: 'request-uuid-123',
    nullable: false,
  })
  @IsNotEmpty()
  @IsString()
  requestId: string;

  @ApiProperty({
    description: 'ID dịch vụ',
    example: 'service-uuid-123',
    nullable: false,
  })
  @IsNotEmpty()
  @IsString()
  shopId: string;
}

export class PayAmountDto {
  @ApiProperty({
    type: 'number',
    description: 'Số tiền cần thanh toán (VNĐ)',
    example: 0,
    nullable: true,
  })
  @IsNumber()
  @IsOptional()
  amount: number | null;
}
