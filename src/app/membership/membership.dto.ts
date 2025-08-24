import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsBoolean, IsString, IsOptional } from 'class-validator';

export class RegisterMembershipDto {
  @Expose()
  @ApiProperty({
    description: 'ID gói subscription muốn mua',
    example: 'subscription-uuid-123',
    nullable: false,
  })
  @IsNotEmpty()
  @IsString()
  subscriptionId: string;

  @Expose()
  @ApiProperty({
    description: 'Có force mua hay không (nếu gói mới rẻ hơn)',
    example: true,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  force?: boolean;

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
