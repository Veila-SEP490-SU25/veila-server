import { ShopStatus } from '@/common/models';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterShopDto {}

export class ListShopDto {
  @ApiProperty({ description: 'ID của shop', example: 'shop-uuid-123' })
  id: string;

  @ApiProperty({ description: 'Tên shop', example: 'Cửa hàng thời trang ABC' })
  name: string;

  @ApiProperty({ description: 'Số điện thoại liên hệ', example: '+84901234567' })
  phone: string;

  @ApiProperty({ description: 'Email liên hệ', example: 'shop@example.com', nullable: true })
  email: string | null;

  @ApiProperty({ description: 'Địa chỉ shop', example: '123 Đường ABC, Quận 1, TP.HCM' })
  address: string;

  @ApiProperty({ description: 'URL ảnh đại diện shop', example: 'https://storage.veila.com/shops/logo123.jpg', nullable: true })
  logoUrl: string | null;

  @ApiProperty({ description: 'URL ảnh bìa shop', example: 'https://storage.veila.com/shops/cover123.jpg', nullable: true })
  coverUrl: string | null;

  @ApiProperty({ description: 'Ảnh tổng hợp của shop (nếu có)', example: null, nullable: true })
  images: string | null;

  @ApiProperty({ enum: ShopStatus, description: 'Trạng thái hoạt động của shop', example: ShopStatus.ACTIVE })
  status: ShopStatus;
}

export class ItemShopDto {
  @ApiProperty({ description: 'ID của shop', example: 'shop-uuid-123' })
  id: string;

  @ApiProperty({ description: 'Tên shop', example: 'Cửa hàng thời trang ABC' })
  name: string;

  @ApiProperty({ description: 'Số điện thoại liên hệ', example: '+84901234567' })
  phone: string;

  @ApiProperty({ description: 'Email liên hệ', example: 'shop@example.com', nullable: true })
  email: string | null;

  @ApiProperty({ description: 'Địa chỉ shop', example: '123 Đường ABC, Quận 1, TP.HCM' })
  address: string;

  @ApiProperty({ description: 'Mô tả chi tiết về shop', example: 'Shop chuyên cung cấp các sản phẩm thời trang...', nullable: true })
  description: string | null;

  @ApiProperty({ description: 'Ảnh tổng hợp của shop (nếu có)', example: null, nullable: true })
  images: string | null;

  @ApiProperty({ description: 'URL ảnh đại diện shop', example: 'https://storage.veila.com/shops/logo123.jpg', nullable: true })
  logoUrl: string | null;

  @ApiProperty({ description: 'URL ảnh bìa shop', example: 'https://storage.veila.com/shops/cover123.jpg', nullable: true })
  coverUrl: string | null;

  @ApiProperty({ enum: ShopStatus, description: 'Trạng thái hoạt động của shop', example: ShopStatus.ACTIVE })
  status: ShopStatus;
}
