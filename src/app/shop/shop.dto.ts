import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ResubmitShopDto {
  @ApiProperty({
    description: 'Tên của shop',
    example: 'Cửa hàng thời trang ABC',
    maxLength: 100,
    nullable: false,
  })
  name: string;

  @ApiProperty({
    description: 'Số điện thoại liên hệ của shop',
    example: '+84901234567',
    maxLength: 15,
    nullable: false,
  })
  phone: string;

  @ApiProperty({
    description: 'Email liên hệ của shop',
    example: 'shopABC@gmail.com',
    maxLength: 64,
    nullable: false,
  })
  email: string;

  @ApiProperty({
    description: 'Địa chỉ của shop',
    example: '123 Đường ABC, Quận 1, TP.HCM',
    maxLength: 255,
    nullable: false,
  })
  address: string;

  @ApiProperty({
    description: 'Ảnh giấy phép kinh doanh của shop',
    example: 'https://storage.veila.com/shops/license123.jpg',
    nullable: false,
  })
  licenseImages: string;
}

export class RegisterShopDto {
  @ApiProperty({
    description: 'ID của điều khoản đồng ý',
    example: 'contract-uuid-123',
    nullable: false,
  })
  contractId: string;

  @ApiProperty({
    description: 'Người dùng có đồng ý với điều khoản hay không',
    example: true,
    nullable: false,
  })
  isAccepted: boolean;

  @ApiProperty({
    description: 'Tên của shop',
    example: 'Cửa hàng thời trang ABC',
    maxLength: 100,
    nullable: false,
  })
  name: string;

  @ApiProperty({
    description: 'Số điện thoại liên hệ của shop',
    example: '+84901234567',
    maxLength: 15,
    nullable: false,
  })
  phone: string;

  @ApiProperty({
    description: 'Email liên hệ của shop',
    example: 'shopABC@gmail.com',
    maxLength: 64,
    nullable: false,
  })
  email: string;

  @ApiProperty({
    description: 'Địa chỉ của shop',
    example: '123 Đường ABC, Quận 1, TP.HCM',
    maxLength: 255,
    nullable: false,
  })
  address: string;

  @ApiProperty({
    description: 'Ảnh giấy phép kinh doanh của shop',
    example: 'https://storage.veila.com/shops/license123.jpg',
    nullable: false,
  })
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
