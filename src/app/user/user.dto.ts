import { UserRole, UserStatus } from '@/common/models';
import { IsPassword } from '@/common/validators';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUser {
  @ApiProperty({
    required: true,
    description: 'Tên đăng nhập (6-32 ký tự, chỉ chữ cái, số, gạch dưới)',
    example: 'newuser',
  })
  @IsNotEmpty()
  username: string;

  @ApiProperty({ required: true, description: 'Email hợp lệ', example: 'newuser@example.com' })
  @IsEmail({}, { message: 'Định dạng email không hợp lệ.' })
  email: string;

  @ApiProperty({
    required: true,
    description: 'Mật khẩu (tối thiểu 8 ký tự, có chữ hoa, chữ thường, số, ký tự đặc biệt)',
    example: 'yourPassword123',
  })
  @IsPassword()
  password: string;

  @ApiProperty({ required: true, description: 'Tên', example: 'New' })
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ required: true, description: 'Họ', example: 'User' })
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    required: true,
    enum: UserRole,
    description: 'Vai trò (ADMIN, STAFF, SHOP, CUSTOMER)',
    example: 'ADMIN',
  })
  @IsNotEmpty()
  role: UserRole;

  @ApiProperty({
    required: true,
    enum: UserStatus,
    description: 'Trạng thái tài khoản',
    example: 'ACTIVE',
  })
  @IsNotEmpty()
  status: UserStatus;

  @ApiProperty({ required: true, description: 'Đã xác thực email hay chưa', example: false })
  @IsNotEmpty()
  isVerified: boolean;

  @ApiProperty({ required: true, description: 'Đã xác thực danh tính hay chưa', example: false })
  @IsNotEmpty()
  isIdentified: boolean;
}

export class UpdateUser {
  @ApiProperty({
    required: true,
    description: 'Tên đăng nhập (6-32 ký tự, chỉ chữ cái, số, gạch dưới)',
    example: 'newuser',
  })
  @IsNotEmpty()
  username: string;

  @ApiProperty({ required: true, description: 'Email hợp lệ', example: 'newuser@example.com' })
  @IsEmail({}, { message: 'Định dạng email không hợp lệ.' })
  email: string;

  @ApiProperty({
    required: true,
    description: 'Mật khẩu (tối thiểu 8 ký tự, có chữ hoa, chữ thường, số, ký tự đặc biệt)',
    example: 'yourPassword123',
  })
  @IsPassword()
  password: string;

  @ApiProperty({ required: true, description: 'Tên', example: 'New' })
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ required: true, description: 'Họ', example: 'User' })
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    required: true,
    enum: UserRole,
    description: 'Vai trò (ADMIN, STAFF, SHOP, CUSTOMER)',
    example: 'ADMIN',
  })
  @IsNotEmpty()
  role: UserRole;

  @ApiProperty({
    required: true,
    enum: UserStatus,
    description: 'Trạng thái tài khoản',
    example: 'ACTIVE',
  })
  @IsNotEmpty()
  status: UserStatus;

  @ApiProperty({ required: true, description: 'Đã xác thực email hay chưa', example: false })
  @IsNotEmpty()
  isVerified: boolean;

  @ApiProperty({ required: true, description: 'Đã xác thực danh tính hay chưa', example: false })
  @IsNotEmpty()
  isIdentified: boolean;
}
