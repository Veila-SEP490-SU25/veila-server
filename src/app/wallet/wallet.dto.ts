import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

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
}
