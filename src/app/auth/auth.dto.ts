import { IsPassword } from '@/common/validators';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class LoginDto {
  @ApiProperty({ required: true })
  @IsEmail({}, { message: 'Định dạng email không hợp lệ.' })
  email: string;

  @ApiProperty({ required: true })
  @IsPassword()
  password: string;
}

export class RegisterDto {
  @ApiProperty({ required: true })
  @IsEmail({}, { message: 'Định dạng email không hợp lệ.' })
  email: string;

  @ApiProperty({ required: true })
  @IsPassword()
  password: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Họ không được để trống.' })
  firstName: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Tên không được để trống.' })
  lastName: string;

  @ApiProperty({ required: false })
  @IsString({ message: 'Tên đệm không hợp lệ.' })
  @IsOptional()
  middleName?: string;

  @ApiProperty({
    nullable: false,
    description: 'Id của hợp đồng đã được chấp nhận',
    example: 'contract-uuid-123',
  })
  @IsString({ message: 'Mã hợp đồng không hợp lệ.' })
  @IsNotEmpty({ message: 'Mã hợp đồng không được để trống.' })
  contractId: string;

  @ApiProperty({
    nullable: false,
    description: 'Người dùng có đồng ý với điều khoản hay không',
    example: true,
  })
  @IsNotEmpty({ message: 'Trạng thái đồng ý với điều khoản không được để trống.' })
  @IsBoolean({ message: 'Trạng thái đồng ý với điều khoản phải là boolean.' })
  isAccepted: boolean;
}

export class RequestOtpDto {
  @ApiProperty({ required: true })
  @IsEmail({}, { message: 'Định dạng email không hợp lệ.' })
  email: string;
}

export class VerifyOtpDto {
  @ApiProperty({ required: true })
  @IsUUID('4', { message: 'Mã người dùng không hợp lệ.' })
  @IsString({ message: 'Mã người dùng không hợp lệ.' })
  userId: string;

  @ApiProperty({ required: true })
  @IsString({ message: 'Mã OTP không hợp lệ.' })
  otp: string;
}

export class RefreshTokenDto {
  @ApiProperty()
  @IsString()
  refreshToken: string;
}

export class TokenResponse {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}
