import { ServiceStatus } from '@/common/models';
import { ApiProperty } from '@nestjs/swagger';

export class CreateServiceDto {}

export class ListServiceDto {
  @ApiProperty({ description: 'ID dịch vụ', example: 'service-uuid-123' })
  id: string;

  @ApiProperty({ description: 'Tên dịch vụ', example: 'Trang điểm cô dâu' })
  name: string;

  @ApiProperty({ description: 'Ảnh đại diện dịch vụ (URL)', example: 'https://storage.veila.com/services/img123.jpg', nullable: true })
  images: string | null;

  @ApiProperty({ description: 'Điểm đánh giá trung bình', example: 4.7 })
  ratingAverage: number;

  @ApiProperty({ enum: ServiceStatus, description: 'Trạng thái dịch vụ', example: ServiceStatus.ACTIVE })
  status: ServiceStatus;
}
