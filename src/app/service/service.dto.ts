import { ServiceStatus } from '@/common/models';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ProductUserDto } from '@/app/user/user.dto';
import { ProductCategoryDto } from '@/app/category/category.dto';

export class ServiceFeedbacksDto {
  @Expose()
  @ApiProperty({ description: 'ID Feedback', example: 'uuid-feedback-1' })
  id: string;

  @Expose()
  @ApiProperty({ description: 'Tên người dùng đánh giá', example: 'customer123' })
  @Transform(({ obj: feedback }) => feedback.customer.username)
  username: string;

  @Expose()
  @ApiProperty({ description: 'Nội dung đánh giá', example: 'Váy rất đẹp!' })
  content: string;

  @Expose()
  @ApiProperty({ description: 'Điểm đánh giá', example: 4.5 })
  rating: number;

  @Expose()
  @ApiProperty({ description: 'Ảnh feedback (nếu có)', example: 'https://...' })
  images: string | null;
}

export class CUServiceDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  categoryId: string | null;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description: string | null;

  @ApiProperty()
  @IsOptional()
  @IsString()
  images: string | null;

  @ApiProperty()
  @IsEnum(ServiceStatus)
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
    example: ServiceStatus.AVAILABLE,
  })
  status: ServiceStatus;

  @Expose()
  @Type(() => ProductUserDto)
  user: ProductUserDto;

  @Expose()
  @Type(() => ProductCategoryDto)
  category: ProductCategoryDto;
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
  @Type(() => ServiceFeedbacksDto)
  feedbacks: ServiceFeedbacksDto[];

  @Expose()
  @Type(() => ProductUserDto)
  user: ProductUserDto;

  @Expose()
  @Type(() => ProductCategoryDto)
  category: ProductCategoryDto;
}
