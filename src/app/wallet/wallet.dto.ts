import { TransactionStatus } from '@/common/models';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

export class CUWalletDto {
  @ApiProperty({
    description: 'ID của người dùng',
    example: 'user-uuid-123',
    nullable: false,
  })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'Số dư khả dụng (có thể sử dung) trong ví, đơn ví VNĐ',
    minimum: 0,
    default: 0,
    example: 15000000,
    nullable: false,
  })
  @IsNotEmpty()
  @IsNumber()
  availableBalance: number;

  @ApiProperty({
    description: 'Số dư đang bị khóa trong ví (VNĐ)',
    minimum: 0,
    default: 0,
    example: 50000000,
    nullable: false,
  })
  @IsNotEmpty()
  @IsNumber()
  lockedBalance: number;
}

export class WalletDto {
  @Expose()
  @ApiProperty({
    description: 'ID của ví điện tử',
    example: 'wallet-uuid-123',
    nullable: false,
  })
  @IsNotEmpty()
  @IsString()
  id: string;

  @Expose()
  @ApiProperty({
    description: 'Tên của người dùng',
    example: 'user-name-123',
    nullable: false,
  })
  @IsNotEmpty()
  @IsString()
  @Transform(({ obj: wallet }) => wallet.user.name)
  userName: string;

  @Expose()
  @ApiProperty({
    description: 'Số dư khả dụng (có thể sử dụng) trong ví, đơn vị VNĐ',
    minimum: 0,
    default: 0,
    example: 15000000,
    nullable: false,
  })
  @IsNotEmpty()
  @IsNumber()
  availableBalance: number;

  @Expose()
  @ApiProperty({
    description: 'Số dư đang bị khóa (không thể sử dụng), đơn vị VNĐ',
    minimum: 0,
    default: 0,
    example: 5000000,
    nullable: false,
  })
  @IsNotEmpty()
  @IsNumber()
  lockedBalance: number;

  @Expose()
  @ApiProperty({
    description: 'Mã BIN định danh ngân hàng',
    example: 'abcxyz123',
    nullable: true,
  })
  @IsString()
  bin: string | null;

  @Expose()
  @ApiProperty({
    description: 'Số tài khoản ngân hàng',
    example: '1234567890',
    nullable: true,
  })
  @IsString()
  @MaxLength(20)
  bankAccountNumber: string | null;
}

export class DepositViaPayOSDto {
  @ApiProperty({ example: 150000, description: 'Số tiền muốn nạp (VND)' })
  @IsInt()
  @IsPositive()
  amount: number;

  @ApiProperty({ example: 'Nạp tiền vào ví', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  note?: string;

  @ApiProperty({ required: false, description: 'URL trả về sau thanh toán (override)' })
  @IsOptional()
  @IsString()
  returnUrl?: string;

  @ApiProperty({ required: false, description: 'URL hủy thanh toán (override)' })
  @IsOptional()
  @IsString()
  cancelUrl?: string;
}

export class DepositViaPayOSResponse {
  @Expose()
  @ApiProperty({
    description: 'ID của giao dịch',
    example: 'transaction-uuid-123',
    nullable: false,
  })
  @IsNotEmpty()
  @IsString()
  transactionId: string;

  @Expose()
  @ApiProperty({
    description: 'Code của PayOS',
    example: 123456789,
    nullable: false,
  })
  @IsNotEmpty()
  @IsNumber()
  orderCode: number;

  @Expose()
  @ApiProperty({
    description: 'URL người dùng truy cập để trả tiền',
    example: 'http://acbxyz.com',
    nullable: false,
  })
  @IsNotEmpty()
  @IsString()
  checkoutUrl: string;

  @Expose()
  @ApiProperty({
    description: 'QR code',
    example: 'abcdefghiklmn',
    nullable: false,
  })
  @IsNotEmpty()
  @IsString()
  qrCode: string;

  @Expose()
  @ApiProperty({
    description: 'Thời gian hết hạn',
    example: 123456789,
    nullable: false,
  })
  @IsNotEmpty()
  @IsString()
  expiredAt: number;
}

export class WebhookDto {
  @Expose()
  @ApiProperty({
    description: 'Id của transaction',
    example: 'transaction-uuid-123',
    nullable: false,
  })
  @IsNotEmpty()
  @IsString()
  transactionId: string;

  @Expose()
  @ApiProperty({
    description: 'Trạng thái đơn hàng (thành công/thất bại/hủy)',
    example: TransactionStatus.COMPLETED,
    nullable: false,
  })
  @IsNotEmpty()
  status: TransactionStatus;
}
