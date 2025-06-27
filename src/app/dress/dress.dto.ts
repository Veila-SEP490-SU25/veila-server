import { DressStatus } from '@/common/models';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDressDto {}

export class ListDressDto {
  @ApiProperty({ description: 'ID váy cưới', example: 'dress-uuid-123' })
  id: string;

  @ApiProperty({ description: 'Tên váy cưới', example: 'Đầm cưới công chúa' })
  name: string;

  @ApiProperty({ description: 'Ảnh đại diện váy cưới (URL)', example: 'https://storage.veila.com/dresses/img123.jpg', nullable: true })
  images: string | null;

  @ApiProperty({ description: 'Điểm đánh giá trung bình', example: 4.8 })
  ratingAverage: number;

  @ApiProperty({ description: 'Giá bán (VNĐ)', example: 5000000 })
  sellPrice: number;

  @ApiProperty({ description: 'Giá thuê (VNĐ)', example: 1500000 })
  rentalPrice: number;

  @ApiProperty({ description: 'Có thể bán không', example: true })
  isSellable: boolean;

  @ApiProperty({ description: 'Có thể cho thuê không', example: true })
  isRentable: boolean;

  @ApiProperty({ enum: DressStatus, description: 'Trạng thái váy cưới', example: DressStatus.AVAILABLE })
  status: DressStatus;
}
