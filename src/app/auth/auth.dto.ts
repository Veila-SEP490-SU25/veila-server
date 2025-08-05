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

export class ChangePasswordDto {
  @ApiProperty({
    required: true,
    description: 'Mật khẩu hiện tại',
    example: 'currentPassword123@',
  })
  @IsNotEmpty()
  @IsPassword()
  currentPassword: string;

  @ApiProperty({
    required: true,
    description: 'Mật khẩu mới (tối thiểu 8 ký tự, có chữ hoa, chữ thường, số, ký tự đặc biệt)',
    example: 'newPassword123@',
  })
  @IsNotEmpty()
  @IsPassword()
  newPassword: string;

  @ApiProperty({
    required: true,
    description: 'Xác nhận mật khẩu mới',
    example: 'newPassword123@',
  })
  @IsNotEmpty()
  @IsPassword()
  confirmPassword: string;
}

export class ResetPasswordDto {
  @ApiProperty({ required: true })
  @IsUUID('4', { message: 'Mã người dùng không hợp lệ.' })
  @IsString({ message: 'Mã người dùng không hợp lệ.' })
  userId: string;

  @ApiProperty({ required: true })
  @IsString({ message: 'Mã xác thực không hợp lệ.' })
  otp: string;

  @ApiProperty({
    required: true,
    description: 'Mật khẩu mới (tối thiểu 8 ký tự, có chữ hoa, chữ thường, số, ký tự đặc biệt)',
    example: 'newPassword123@',
  })
  @IsNotEmpty()
  @IsPassword()
  newPassword: string;
}

export class LoginGoogleDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  fullname: string;
}
