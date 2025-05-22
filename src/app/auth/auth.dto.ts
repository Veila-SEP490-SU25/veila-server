import { IsPassword } from '@/common/validators';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

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
