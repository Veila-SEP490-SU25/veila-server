import { TransactionStatus, TransactionType, TypeBalance } from '@/common/models';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CUTransactionDto {
  @ApiProperty({
    description: 'ID của ví điện tử thực hiện giao dịch',
    example: 'wallet-uuid-123',
    nullable: false,
  })
  @IsNotEmpty()
  @IsString()
  walletId: string;

  @ApiProperty({
    description: 'ID của đơn hàng được thực hiện giao dịch (nếu có)',
    example: 'order-uuid-123',
    nullable: true,
  })
  @IsString()
  orderId: string;

  @ApiProperty({
    description: 'ID của gói thành viên liên quan đến giao dịch (nếu có)',
    example: 'membership-uuid-123',
    nullable: true,
  })
  @IsString()
  membershipId: string;

  @ApiProperty({
    description: 'Nguồn chuyển tiền (có thể là user, ví, hệ thống',
    example: 'user_1',
    nullable: false,
  })
  @IsNotEmpty()
  @IsString()
  from: string;

  @ApiProperty({
    description: 'Người nhận tiền',
    example: 'shop 2',
    nullable: false,
  })
  @IsNotEmpty()
  @IsString()
  to: string;

  @ApiProperty({
    description: 'Loại số dư chuyển',
    example: TypeBalance.AVAILABLE,
    nullable: false,
  })
  @IsNotEmpty()
  fromTypeBalance: TypeBalance;

  @ApiProperty({
    description: 'Loại số dư nơi nhận',
    example: TypeBalance.LOCKED,
    nullable: false,
  })
  @IsNotEmpty()
  toTypeBalance: TypeBalance;

  @ApiProperty({
    description: 'Số tiền giao dịch (VNĐ)',
    example: 200000,
    nullable: false,
  })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: 'Loại giao dịch',
    example: TransactionType.TRANSFER,
    nullable: false,
  })
  @IsNotEmpty()
  type: TransactionType;

  @ApiProperty({
    description: 'Trạng thái giao dịch',
    example: TransactionStatus.PENDING,
    nullable: false,
  })
  @IsNotEmpty()
  status: TransactionStatus;

  @ApiProperty({
    description: 'Ghi chú giao dịch nếu có',
    example: 'Đơn hàng này đã yêu cầu hoàn tiền',
    nullable: true,
  })
  note: string;
}

export class WithdrawTransactionDto {
  @Expose()
  @ApiProperty({
    description: 'Số tiền giao dịch (VNĐ)',
    example: 200000,
    nullable: false,
  })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @Expose()
  @ApiProperty({
    description: 'Ghi chú giao dịch nếu có',
    example: 'Rút tiền từ ví điện tử',
    nullable: true,
  })
  note: string;

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

export class TransactionDto {
  @Expose()
  @ApiProperty({
    description: 'ID của giao dịch',
    example: 'transaction-uuid-123',
    nullable: false,
  })
  @IsNotEmpty()
  @IsString()
  id: string;

  @Expose()
  @ApiProperty({
    description: 'ID của ví điện tử thực hiện giao dịch',
    example: 'wallet-uuid-123',
    nullable: false,
  })
  @IsNotEmpty()
  @IsString()
  @Transform(({ obj: transaction }) => transaction.wallet.id)
  walletId: string;

  @Expose()
  @ApiProperty({
    description: 'ID của đơn hàng được thực hiện giao dịch (nếu có)',
    example: 'order-uuid-123',
    nullable: true,
  })
  @IsString()
  @Transform(({ obj: transaction }) => transaction.order?.id ?? null)
  orderId: string;

  @Expose()
  @ApiProperty({
    description: 'ID của gói thành viên liên quan đến giao dịch (nếu có)',
    example: 'membership-uuid-123',
    nullable: true,
  })
  @IsString()
  @Transform(({ obj: transaction }) => transaction.membership?.id ?? null)
  membershipId: string;

  @Expose()
  @ApiProperty({
    description: 'Nguồn chuyển tiền (có thể là user, ví, hệ thống',
    example: 'user_1',
    nullable: false,
  })
  @IsNotEmpty()
  @IsString()
  from: string;

  @Expose()
  @ApiProperty({
    description: 'Người nhận tiền',
    example: 'shop 2',
    nullable: false,
  })
  @IsNotEmpty()
  @IsString()
  to: string;

  @Expose()
  @ApiProperty({
    description: 'Loại số dư chuyển',
    example: TypeBalance.AVAILABLE,
    nullable: false,
  })
  @IsNotEmpty()
  fromTypeBalance: TypeBalance;

  @Expose()
  @ApiProperty({
    description: 'Loại số dư nơi nhận',
    example: TypeBalance.LOCKED,
    nullable: false,
  })
  @IsNotEmpty()
  toTypeBalance: TypeBalance;

  @Expose()
  @ApiProperty({
    description: 'Số tiền giao dịch (VNĐ)',
    example: 200000,
    nullable: false,
  })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @Expose()
  @ApiProperty({
    description: 'Loại giao dịch',
    example: TransactionType.TRANSFER,
    nullable: false,
  })
  @IsNotEmpty()
  type: TransactionType;

  @Expose()
  @ApiProperty({
    description: 'Trạng thái giao dịch',
    example: TransactionStatus.PENDING,
    nullable: false,
  })
  @IsNotEmpty()
  status: TransactionStatus;

  @Expose()
  @ApiProperty({
    description: 'Ghi chú giao dịch nếu có',
    example: 'Đơn hàng này đã yêu cầu hoàn tiền',
    nullable: true,
  })
  note: string;
}
