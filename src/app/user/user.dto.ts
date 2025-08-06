import { ProductShopDto } from '@/app/shop/shop.dto';
import { UserRole, UserStatus } from '@/common/models';
import { IsPassword } from '@/common/validators';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

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

export class UpdateProfile {
  @ApiProperty({ required: true, description: 'Tên', example: 'New' })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ required: false, description: 'Tên đệm', example: 'Middle' })
  @IsString()
  @IsOptional()
  middleName: string | null;

  @ApiProperty({ required: true, description: 'Họ', example: 'User' })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({ required: false, description: 'Địa chỉ', example: '123 Main St' })
  @IsString()
  @IsOptional()
  address: string | null;

  @ApiProperty({ required: false, description: 'Ngày sinh', example: '1990-01-01' })
  @IsOptional()
  birthDate: Date | null;

  @ApiProperty({
    required: false,
    description: 'URL ảnh đại diện',
    example: 'https://example.com/avatar.jpg',
  })
  @IsString()
  @IsOptional()
  avatarUrl: string | null;

  @ApiProperty({
    required: false,
    description: 'URL ảnh bìa',
    example: 'https://example.com/cover.jpg',
  })
  @IsString()
  @IsOptional()
  coverUrl: string | null;

  @ApiProperty({
    required: false,
    description: 'Ảnh đại diện của người dùng',
    type: 'string',
  })
  @IsOptional()
  @IsString()
  images: string | null;
}

export class ProductUserDto {
  @Expose()
  @Type(() => ProductShopDto)
  @ApiProperty({ description: 'Thông tin cửa hàng', type: () => ProductShopDto })
  shop: ProductShopDto;
}
