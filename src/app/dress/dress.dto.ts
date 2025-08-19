import { DressStatus } from '@/common/models';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { ProductCategoryDto } from '@/app/category/category.dto';
import { ProductUserDto } from '@/app/user/user.dto';

export class DressUsernameDto {
  @Expose()
  @ApiProperty({ description: 'ID người dùng', example: 'uuid-user-1' })
  id: string;

  @Expose()
  @ApiProperty({ description: 'Tên người dùng', example: 'customer123' })
  username: string;

  @Expose()
  @ApiProperty({
    description: 'URL avatar của người dùng',
    example: 'https://veila.images/avatars/1',
  })
  avatarUrl: string | null;
}

export class DressFeedbacksDto {
  @Expose()
  @ApiProperty({ description: 'ID Feedback', example: 'uuid-feedback-1' })
  id: string;

  @Expose()
  @ApiProperty({ description: 'Tên người dùng đánh giá', example: 'customer123' })
  @Type(() => DressUsernameDto)
  customer: DressUsernameDto;

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

export class CUDressDto {
  @ApiProperty({
    description: 'ID danh mục (category)',
    example: 'category-uuid-123',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  categoryId: string | null;

  @ApiProperty({ description: 'Tên váy cưới', example: 'Đầm cưới công chúa' })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Mô tả sản phẩm (tối đa 500 ký tự)',
    example: 'Váy dạ hội đỏ sang trọng, phù hợp cho các buổi tiệc lớn.',
    maxLength: 500,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  description: string | null;

  @ApiProperty({ description: 'Giá bán (VNĐ)', example: 5000000 })
  @IsNumber()
  sellPrice: number;

  @ApiProperty({ description: 'Giá thuê (VNĐ)', example: 1500000 })
  @IsNumber()
  rentalPrice: number;

  @ApiProperty({ description: 'Có thể bán không', example: true })
  @IsBoolean()
  isSellable: boolean;

  @ApiProperty({ description: 'Có thể cho thuê không', example: true })
  @IsBoolean()
  isRentable: boolean;

  @ApiProperty({
    enum: DressStatus,
    description: 'Trạng thái váy cưới',
    example: DressStatus.AVAILABLE,
  })
  @IsEnum(DressStatus)
  status: DressStatus;

  @ApiProperty({
    description: 'Ảnh đại diện váy cưới (URL)',
    example: 'https://storage.veila.com/dresses/img123.jpg',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  images: string | null;

  @ApiProperty({
    type: 'number',
    nullable: true,
    description: 'Vòng ngực (cm)',
    example: '90',
  })
  @IsOptional()
  @IsNumber()
  bust: number | null;

  @ApiProperty({
    type: 'number',
    nullable: true,
    description: 'Vòng eo (cm)',
    example: '60',
  })
  @IsOptional()
  @IsNumber()
  waist: number | null;

  @ApiProperty({
    type: 'number',
    nullable: true,
    description: 'Vòng mông (cm)',
    example: '80',
  })
  @IsOptional()
  @IsNumber()
  hip: number | null;

  @ApiProperty({
    type: 'string',
    description: 'Chất liệu (tối đa 50 ký tự)',
    example: 'Cotton',
    maxLength: 50,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  material: string | null;

  @ApiProperty({
    type: 'string',
    description: 'Màu sắc (tối đa 50 ký tự)',
    example: 'Đỏ',
    maxLength: 50,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  color: string | null;

  @ApiProperty({
    type: 'string',
    description: 'Độ dài (tối đa 50 ký tự)',
    example: 'Dài',
    maxLength: 50,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  length: string | null;

  @ApiProperty({
    type: 'string',
    description: 'Cổ (tối đa 50 ký tự)',
    example: 'Cổ tròn',
    maxLength: 50,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  neckline: string | null;

  @ApiProperty({
    type: 'string',
    description: 'Tay (tối đa 50 ký tự)',
    example: 'Tay ngắn',
    maxLength: 50,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  sleeve: string | null;
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

  @Expose()
  @Type(() => ProductUserDto)
  user: ProductUserDto;

  @Expose()
  @Type(() => ProductCategoryDto)
  category: ProductCategoryDto;
}

export class ItemDressDto {
  @Expose()
  @ApiProperty({ description: 'ID váy cưới', example: 'dress-uuid-123' })
  id: string;

  @Expose()
  @ApiProperty({ description: 'Tên váy cưới', example: 'Đầm cưới công chúa' })
  name: string;

  @Expose()
  @ApiProperty({
    type: 'string',
    description: 'Mô tả sản phẩm (tối đa 500 ký tự)',
    example: 'Váy dạ hội đỏ sang trọng, phù hợp cho các buổi tiệc lớn.',
    maxLength: 500,
    nullable: true,
  })
  description: string | null;

  @Expose()
  @ApiProperty({
    description: 'Ảnh đại diện váy cưới (URL)',
    example: 'https://storage.veila.com/dresses/img123.jpg',
    nullable: true,
  })
  images: string | null;

  @Expose()
  @ApiProperty({
    type: 'number',
    nullable: true,
    description: 'Vòng ngực (cm)',
    example: '90',
  })
  bust: number | null;

  @Expose()
  @ApiProperty({
    type: 'number',
    nullable: true,
    description: 'Vòng eo (cm)',
    example: '60',
  })
  waist: number | null;

  @Expose()
  @ApiProperty({
    type: 'number',
    nullable: true,
    description: 'Vòng mông (cm)',
    example: '80',
  })
  hip: number | null;

  @Expose()
  @ApiProperty({
    type: 'string',
    description: 'Chất liệu (tối đa 50 ký tự)',
    example: 'Cotton',
    maxLength: 50,
    nullable: true,
  })
  material: string | null;

  @Expose()
  @ApiProperty({
    type: 'string',
    description: 'Màu sắc (tối đa 50 ký tự)',
    example: 'Đỏ',
    maxLength: 50,
    nullable: true,
  })
  color: string | null;

  @Expose()
  @ApiProperty({
    type: 'string',
    description: 'Độ dài (tối đa 50 ký tự)',
    example: 'Dài',
    maxLength: 50,
    nullable: true,
  })
  length: string | null;

  @Expose()
  @ApiProperty({
    type: 'string',
    description: 'Cổ (tối đa 50 ký tự)',
    example: 'Cổ tròn',
    maxLength: 50,
    nullable: true,
  })
  neckline: string | null;

  @Expose()
  @ApiProperty({
    type: 'string',
    description: 'Tay (tối đa 50 ký tự)',
    example: 'Tay ngắn',
    maxLength: 50,
    nullable: true,
  })
  sleeve: string | null;

  @Expose()
  @ApiProperty({ description: 'Điểm đánh giá trung bình', example: 4.8 })
  ratingAverage: number;

  @Expose()
  @ApiProperty({
    type: 'integer',
    description: 'Số lượng đánh giá mà sản phẩm đã nhận được',
    example: 123,
    minimum: 0,
    default: 0,
  })
  ratingCount: number;

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

  @Expose()
  @Type(() => DressFeedbacksDto)
  feedbacks: DressFeedbacksDto[];

  @Expose()
  @Type(() => ProductUserDto)
  user: ProductUserDto;

  @Expose()
  @Type(() => ProductCategoryDto)
  category: ProductCategoryDto;
}
