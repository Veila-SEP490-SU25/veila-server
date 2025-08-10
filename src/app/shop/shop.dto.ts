import { ShopStatus } from '@/common/models';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateShopDto {
  @ApiProperty({
    description: 'Tên của shop',
    example: 'Cửa hàng thời trang ABC',
    maxLength: 100,
    nullable: false,
  })
  @IsString({ message: 'Tên shop phải là chuỗi.' })
  name: string;

  @ApiProperty({
    description: 'Số điện thoại liên hệ của shop',
    example: '+84901234567',
    maxLength: 15,
    nullable: false,
  })
  @IsString({ message: 'Số điện thoại phải là chuỗi.' })
  phone: string;

  @ApiProperty({
    description: 'Email liên hệ của shop',
    example: 'shopABC@gmail.com',
    maxLength: 64,
    nullable: false,
  })
  @IsString({ message: 'Email phải là chuỗi.' })
  email: string;

  @ApiProperty({
    description: 'Địa chỉ của shop',
    example: '123 Đường ABC, Quận 1, TP.HCM',
    maxLength: 255,
    nullable: false,
  })
  @IsString({ message: 'Địa chỉ phải là chuỗi.' })
  address: string;

  @ApiProperty({
    description: 'Mô tả về shop',
    example: 'Cửa hàng thời trang chuyên cung cấp các sản phẩm mới nhất',
    maxLength: 500,
    nullable: true,
  })
  @IsString({ message: 'Mô tả phải là chuỗi.' })
  @IsOptional()
  description: string | null;

  @ApiProperty({
    description: 'URL ảnh đại diện của shop',
    example: 'https://storage.veila.com/shops/logo123.jpg',
    nullable: true,
  })
  @IsString({ message: 'URL ảnh đại diện phải là chuỗi.' })
  @IsOptional()
  logoUrl: string | null;

  @ApiProperty({
    description: 'URL ảnh bìa của shop',
    example: 'https://storage.veila.com/shops/cover123.jpg',
    nullable: true,
  })
  @IsString({ message: 'URL ảnh bìa phải là chuỗi.' })
  @IsOptional()
  coverUrl: string | null;

  @ApiProperty({
    description: 'Danh sách URL ảnh của shop',
    example: 'https://storage.veila.com/shops/image1.jpg, https://storage.veila.com/shops/image2.jpg',
    nullable: true,
  })
  @IsString({ message: 'Danh sách ảnh phải là chuỗi.' })
  @IsOptional()
  images: string | null;
}

export class ReviewShopDto {
  @ApiProperty({
    description: 'Có duyệt shop hay không',
    example: true,
    nullable: false,
  })
  @IsBoolean({ message: 'Trạng thái duyệt phải là boolean.' })
  isApproved: boolean;

  @ApiProperty({
    description: 'Lý do từ chối (nếu có)',
    example: 'Giấy phép kinh doanh không rõ ràng, cần chụp lại',
    maxLength: 500,
    nullable: true,
  })
  @IsString({ message: 'Lý do từ chối phải là chuỗi.' })
  @IsOptional()
  rejectReason?: string | null;
}

export class ListShopForStaffDto {
  @Expose()
  @ApiProperty({ description: 'ID của shop', example: 'shop-uuid-123' })
  id: string;

  @Expose()
  @ApiProperty({ description: 'Tên shop', example: 'Cửa hàng thời trang ABC' })
  name: string;

  @Expose()
  @ApiProperty({ description: 'Trạng thái của shop', example: ShopStatus.PENDING })
  status: ShopStatus;

  @Expose()
  @ApiProperty({ description: 'Trạng thái xác thực của shop', example: false })
  isVerified: boolean;
}

export class ResubmitShopDto {
  @ApiProperty({
    description: 'Tên của shop',
    example: 'Cửa hàng thời trang ABC',
    maxLength: 100,
    nullable: false,
  })
  @IsString({ message: 'Tên shop phải là chuỗi.' })
  name: string;

  @ApiProperty({
    description: 'Số điện thoại liên hệ của shop',
    example: '+84901234567',
    maxLength: 15,
    nullable: false,
  })
  @IsString({ message: 'Số điện thoại phải là chuỗi.' })
  phone: string;

  @ApiProperty({
    description: 'Email liên hệ của shop',
    example: 'shopABC@gmail.com',
    maxLength: 64,
    nullable: false,
  })
  @IsString({ message: 'Email phải là chuỗi.' })
  email: string;

  @ApiProperty({
    description: 'Địa chỉ của shop',
    example: '123 Đường ABC, Quận 1, TP.HCM',
    maxLength: 255,
    nullable: false,
  })
  @IsString({ message: 'Địa chỉ phải là chuỗi.' })
  address: string;

  @ApiProperty({
    description: 'Ảnh giấy phép kinh doanh của shop',
    example: 'https://storage.veila.com/shops/license123.jpg',
    nullable: false,
  })
  @IsString({ message: 'Ảnh giấy phép kinh doanh phải là chuỗi.' })
  licenseImages: string;
}

export class RegisterShopDto {
  @ApiProperty({
    description: 'Tên của shop',
    example: 'Cửa hàng thời trang ABC',
    maxLength: 100,
    nullable: false,
  })
  @IsString({ message: 'Tên shop phải là chuỗi.' })
  name: string;

  @ApiProperty({
    description: 'Số điện thoại liên hệ của shop',
    example: '+84901234567',
    maxLength: 15,
    nullable: false,
  })
  @IsString({ message: 'Số điện thoại phải là chuỗi.' })
  phone: string;

  @ApiProperty({
    description: 'Email liên hệ của shop',
    example: 'shopABC@gmail.com',
    maxLength: 64,
    nullable: false,
  })
  @IsString({ message: 'Email phải là chuỗi.' })
  email: string;

  @ApiProperty({
    description: 'Địa chỉ của shop',
    example: '123 Đường ABC, Quận 1, TP.HCM',
    maxLength: 255,
    nullable: false,
  })
  @IsString({ message: 'Địa chỉ phải là chuỗi.' })
  address: string;

  @ApiProperty({
    description: 'Ảnh giấy phép kinh doanh của shop',
    example: 'https://storage.veila.com/shops/license123.jpg',
    nullable: false,
  })
  @IsString({ message: 'Ảnh giấy phép kinh doanh phải là chuỗi.' })
  licenseImages: string;
}

export class ListShopDto {
  @Expose()
  @ApiProperty({ description: 'ID của shop', example: 'shop-uuid-123' })
  id: string;

  @Expose()
  @ApiProperty({ description: 'Tên shop', example: 'Cửa hàng thời trang ABC' })
  name: string;

  @Expose()
  @ApiProperty({ description: 'Số điện thoại liên hệ', example: '+84901234567' })
  phone: string;

  @Expose()
  @ApiProperty({ description: 'Email liên hệ', example: 'shop@example.com' })
  email: string;

  @Expose()
  @ApiProperty({ description: 'Địa chỉ shop', example: '123 Đường ABC, Quận 1, TP.HCM' })
  address: string;

  @Expose()
  @ApiProperty({
    description: 'URL ảnh đại diện shop',
    example: 'https://storage.veila.com/shops/logo123.jpg',
    nullable: true,
  })
  logoUrl: string | null;

  @Expose()
  @ApiProperty({
    description: 'URL ảnh bìa shop',
    example: 'https://storage.veila.com/shops/cover123.jpg',
    nullable: true,
  })
  coverUrl: string | null;

  @Expose()
  @ApiProperty({ description: 'Ảnh tổng hợp của shop (nếu có)', example: null, nullable: true })
  images: string | null;
}

export class ItemShopDto {
  @Expose()
  @ApiProperty({ description: 'ID của shop', example: 'shop-uuid-123' })
  id: string;

  @Expose()
  @ApiProperty({ description: 'Tên shop', example: 'Cửa hàng thời trang ABC' })
  name: string;

  @Expose()
  @ApiProperty({ description: 'Số điện thoại liên hệ', example: '+84901234567' })
  phone: string;

  @Expose()
  @ApiProperty({ description: 'Email liên hệ', example: 'shop@example.com', nullable: true })
  email: string;

  @Expose()
  @ApiProperty({ description: 'Địa chỉ shop', example: '123 Đường ABC, Quận 1, TP.HCM' })
  address: string;

  @Expose()
  @ApiProperty({
    description: 'Mô tả chi tiết về shop',
    example: 'Shop chuyên cung cấp các sản phẩm thời trang...',
    nullable: true,
  })
  description: string | null;

  @Expose()
  @ApiProperty({ description: 'Ảnh tổng hợp của shop (nếu có)', example: null, nullable: true })
  images: string | null;

  @Expose()
  @ApiProperty({
    description: 'URL ảnh đại diện shop',
    example: 'https://storage.veila.com/shops/logo123.jpg',
    nullable: true,
  })
  logoUrl: string | null;

  @Expose()
  @ApiProperty({
    description: 'URL ảnh bìa shop',
    example: 'https://storage.veila.com/shops/cover123.jpg',
    nullable: true,
  })
  coverUrl: string | null;
}

export class ShopContactDto {
  @Expose()
  @ApiProperty({ description: 'Số điện thoại liên hệ', example: '+84901234567', nullable: false })
  phone: string;

  @Expose()
  @ApiProperty({ description: 'Email liên hệ', example: 'shop@example.com', nullable: false })
  email: string;

  @Expose()
  @ApiProperty({
    description: 'Địa chỉ shop',
    example: '123 Đường ABC, Quận 1, TP.HCM',
    nullable: false,
  })
  address: string;
}
