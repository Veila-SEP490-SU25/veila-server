import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsBoolean, IsString, IsOptional } from 'class-validator';

export class RegisterMembershipDto {
  @ApiProperty({
    description: 'ID gói subscription muốn mua',
    example: 'subscription-uuid-123',
    nullable: false,
  })
  @IsNotEmpty()
  @IsString()
  subscriptionId: string;

  @ApiProperty({
    description: 'Có force mua hay không (nếu gói mới rẻ hơn)',
    example: true,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  force?: boolean;
}
