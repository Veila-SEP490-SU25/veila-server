import { DressStatus } from '@/common/models';
import { ApiProperty } from '@nestjs/swagger';
import { ProductFeedbacksDto } from '@/app/feedback';
import { Expose } from 'class-transformer';

export class CUDressDto {
  @ApiProperty({
    description: 'ID danh mục (category)',
    example: 'category-uuid-123',
    nullable: true,
  })
  categoryId: string | null;

  @ApiProperty({ description: 'Tên váy cưới', example: 'Đầm cưới công chúa' })
  name: string;

  @ApiProperty({
    description: 'Mô tả sản phẩm (tối đa 500 ký tự)',
    example: 'Váy dạ hội đỏ sang trọng, phù hợp cho các buổi tiệc lớn.',
    maxLength: 500,
    nullable: true,
  })
  description: string | null;

  @ApiProperty({ description: 'Giá bán (VNĐ)', example: 5000000 })
  sellPrice: number;

  @ApiProperty({ description: 'Giá thuê (VNĐ)', example: 1500000 })
  rentalPrice: number;

  @ApiProperty({ description: 'Có thể bán không', example: true })
  isSellable: boolean;

  @ApiProperty({ description: 'Có thể cho thuê không', example: true })
  isRentable: boolean;

  @ApiProperty({
    enum: DressStatus,
    description: 'Trạng thái váy cưới',
    example: DressStatus.AVAILABLE,
  })
  status: DressStatus;

  @ApiProperty({
    description: 'Ảnh đại diện váy cưới (URL)',
    example: 'https://storage.veila.com/dresses/img123.jpg',
    nullable: true,
  })
  images: string | null;
}

export class ListDressDto {
  @Expose()
  @ApiProperty({ description: 'ID váy cưới', example: 'dress-uuid-123' })
  id: string;

  @Expose()
  @ApiProperty({ description: 'Tên váy cưới', example: 'Đầm cưới công chúa' })
  name: string;

  @Expose()
  @ApiProperty({
    description: 'Ảnh đại diện váy cưới (URL)',
    example: 'https://storage.veila.com/dresses/img123.jpg',
    nullable: true,
  })
  images: string | null;

  @Expose()
  @ApiProperty({ description: 'Điểm đánh giá trung bình', example: 4.8 })
  ratingAverage: number;

  @Expose()
  @ApiProperty({ description: 'Giá bán (VNĐ)', example: 5000000 })
  sellPrice: number;

  @Expose()
  @ApiProperty({ description: 'Giá thuê (VNĐ)', example: 1500000 })
  rentalPrice: number;

  @Expose()
  @ApiProperty({ description: 'Có thể bán không', example: true })
  isSellable: boolean;

  @Expose()
  @ApiProperty({ description: 'Có thể cho thuê không', example: true })
  isRentable: boolean;

  @Expose()
  @ApiProperty({
    enum: DressStatus,
    description: 'Trạng thái váy cưới',
    example: DressStatus.AVAILABLE,
  })
  status: DressStatus;
}

export class ItemDressDto {
  @ApiProperty({ description: 'ID váy cưới', example: 'dress-uuid-123' })
  id: string;

  @ApiProperty({ description: 'Tên váy cưới', example: 'Đầm cưới công chúa' })
  name: string;

  @ApiProperty({
    type: 'string',
    description: 'Mô tả sản phẩm (tối đa 500 ký tự)',
    example: 'Váy dạ hội đỏ sang trọng, phù hợp cho các buổi tiệc lớn.',
    maxLength: 500,
    nullable: true,
  })
  description: string | null;

  @ApiProperty({
    description: 'Ảnh đại diện váy cưới (URL)',
    example: 'https://storage.veila.com/dresses/img123.jpg',
    nullable: true,
  })
  images: string | null;

  @ApiProperty({ description: 'Điểm đánh giá trung bình', example: 4.8 })
  ratingAverage: number;

  @ApiProperty({
    type: 'integer',
    description: 'Số lượng đánh giá mà sản phẩm đã nhận được',
    example: 123,
    minimum: 0,
    default: 0,
  })
  ratingCount: number;

  @ApiProperty({ description: 'Giá bán (VNĐ)', example: 5000000 })
  sellPrice: number;

  @ApiProperty({ description: 'Giá thuê (VNĐ)', example: 1500000 })
  rentalPrice: number;

  @ApiProperty({ description: 'Có thể bán không', example: true })
  isSellable: boolean;

  @ApiProperty({ description: 'Có thể cho thuê không', example: true })
  isRentable: boolean;

  @ApiProperty({
    enum: DressStatus,
    description: 'Trạng thái váy cưới',
    example: DressStatus.AVAILABLE,
  })
  status: DressStatus;

  @ApiProperty({
    description: 'Danh sách feedback của váy cưới',
    type: [ProductFeedbacksDto],
  })
  feedbacks: ProductFeedbacksDto[];
}
