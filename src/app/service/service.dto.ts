import { ServiceStatus } from '@/common/models';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ProductFeedbacksDto } from '@/app/feedback';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ProductUserDto } from '@/app/user/user.dto';
import { ProductCategoryDto } from '@/app/category/category.dto';

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
  @ApiProperty({
    description: 'Thông tin người dùng sở hữu dịch vụ',
    type: () => ProductUserDto,
  })
  user: ProductUserDto;

  @Expose()
  @Type(() => ProductCategoryDto)
  @ApiProperty({
    description: 'Thông tin danh mục dịch vụ',
    type: () => ProductCategoryDto,
  })
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
  @Type(() => ProductFeedbacksDto)
  @ApiProperty({
    type: [ProductFeedbacksDto],
  })
  feedbacks: ProductFeedbacksDto[];

  @Expose()
  @Type(() => ProductUserDto)
  @ApiProperty({
    description: 'Thông tin người dùng sở hữu dịch vụ',
    type: () => ProductUserDto,
  })
  user: ProductUserDto;

  @Expose()
  @Type(() => ProductCategoryDto)
  @ApiProperty({
    description: 'Thông tin danh mục dịch vụ',
    type: () => ProductCategoryDto,
  })
  category: ProductCategoryDto;
}
