import { ServiceStatus } from '@/common/models';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ProductFeedbacksDto } from '@/app/feedback';

export class CUServiceDto {
  @ApiProperty()
  categoryId: string | null;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string | null;

  @ApiProperty()
  status: ServiceStatus;
}

export class ListServiceDto {
  @Expose()
  @ApiProperty({ description: 'ID dịch vụ', example: 'service-uuid-123' })
  id: string;

  @Expose()
  @ApiProperty({ description: 'Tên dịch vụ', example: 'Trang điểm cô dâu' })
  name: string;

  @Expose()
  @ApiProperty({
    description: 'Ảnh đại diện dịch vụ (URL)',
    example: 'https://storage.veila.com/services/img123.jpg',
    nullable: true,
  })
  images: string | null;

  @Expose()
  @ApiProperty({ description: 'Điểm đánh giá trung bình', example: 4.7 })
  ratingAverage: number;

  @Expose()
  @ApiProperty({
    enum: ServiceStatus,
    description: 'Trạng thái dịch vụ',
    example: ServiceStatus.ACTIVE,
  })
  status: ServiceStatus;
}

export class ItemServiceDto {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  images: string | null;

  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty()
  description: string | null;

  @Expose()
  @ApiProperty()
  ratingAverage: number;

  @Expose()
  @ApiProperty()
  ratingCount: number;

  @Expose()
  @ApiProperty()
  status: ServiceStatus;

  @Expose()
  @ApiProperty()
  feedbacks: ProductFeedbacksDto;
}
