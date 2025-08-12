import { OrderStatus, OrderType } from '@/common/models';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CUOrderAccessoriesDetailDto } from '@/app/order-accessories-details';
import { CUOrderDressDetailDto } from '@/app/order-dress-details';

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
  @IsDate()
  returnDate: Date | null;

  @ApiProperty({
    description: 'Cửa hàng có mua lại váy cưới sau khi may cho khách không',
    example: true,
    nullable: false,
    default: false,
  })
  @IsNotEmpty()
  @IsBoolean()
  isBuyBack: boolean;

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
  @IsDate()
  returnDate: Date | null;

  @ApiProperty({
    description: 'Cửa hàng có mua lại váy cưới sau khi may cho khách không',
    example: true,
    nullable: false,
    default: false,
  })
  @IsBoolean()
  isBuyBack: boolean;
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

export class ShopUpdateOrderForCustom {
  @ApiProperty({
    description: 'Ngày giao hàng',
    example: '2023-12-31',
    nullable: false,
  })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  dueDate: Date;

  @ApiProperty({
    description: 'Giá trị của dịch vụ (VNĐ)',
    example: 5000000,
    nullable: false,
  })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({
    description: 'Danh sách các mốc công việc',
    type: () => [CreateMilestone],
  })
  @ValidateNested({ each: true })
  @Type(() => CreateMilestone)
  milestones: CreateMilestone[];
}

export class CreateMilestone {
  @ApiProperty({
    description: 'Tiêu đề mốc công việc',
    example: 'Mốc công việc 1',
    nullable: false,
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Mô tả mốc công việc',
    example: 'Mô tả chi tiết mốc công việc 1',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  description: string | null;

  @ApiProperty({
    description: 'Ngày hết hạn mốc công việc',
    example: '2023-12-31',
    nullable: false,
  })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  dueDate: Date;

  @ApiProperty({
    description: 'Danh sách các công việc trong mốc',
    type: () => [CreateTask],
  })
  @ValidateNested({ each: true })
  @Type(() => CreateMilestone)
  tasks: CreateTask[];
}

export class CreateTask {
  @ApiProperty({
    description: 'Tiêu đề công việc',
    example: 'Công việc 1',
    nullable: false,
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Mô tả công việc',
    example: 'Mô tả chi tiết công việc 1',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  description: string | null;

  @ApiProperty({
    description: 'Ngày hết hạn công việc',
    example: '2023-12-31',
    nullable: false,
  })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  dueDate: Date;
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
