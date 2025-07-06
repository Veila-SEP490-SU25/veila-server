import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class RegisterShopDto {}

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
  @ApiProperty({ description: 'Email liên hệ', example: 'shop@example.com', nullable: true })
  email: string | null;

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
  email: string | null;

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
