import { ProductCategoryDto } from '@/app/category/category.dto';
import { ProductFeedbacksDto } from '@/app/feedback';
import { ProductUserDto } from '@/app/user/user.dto';
import { AccessoryStatus } from '@/common/models';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class ItemAccessoryDto {
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
  sellPrice: number;

  @Expose()
  @ApiProperty()
  rentalPrice: number;

  @Expose()
  @ApiProperty()
  isSellable: boolean;

  @Expose()
  @ApiProperty()
  isRentable: boolean;

  @Expose()
  @ApiProperty()
  ratingAverage: number;

  @Expose()
  @ApiProperty()
  ratingCount: number;

  @Expose()
  @ApiProperty()
  status: AccessoryStatus;

  @Expose()
  @Type(() => ProductFeedbacksDto)
  feedbacks: ProductFeedbacksDto[];

  @Expose()
  @Type(() => ProductUserDto)
  user: ProductUserDto;

  @Expose()
  @Type(() => ProductCategoryDto)
  category: ProductCategoryDto;
}

export class CUAccessoryDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsString()
  @IsOptional()
  categoryId: string | null;

  @ApiProperty({ example: 'https://veila.images/1,https://veila.images/2' })
  @IsString()
  @IsOptional()
  images: string | null;

  @ApiProperty({ example: 'Vòng cổ ngọc trai' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Vòng cổ ngọc trai sang trọng, phù hợp với nhiều trang phục.' })
  @IsString()
  @IsOptional()
  description: string | null;

  @ApiProperty({ example: 150.0 })
  @IsNumber()
  sellPrice: number;

  @ApiProperty({ example: 200.0 })
  @IsNumber()
  rentalPrice: number;

  @ApiProperty({ example: true })
  @IsBoolean()
  isSellable: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  isRentable: boolean;

  @ApiProperty({ example: AccessoryStatus.AVAILABLE })
  @IsEnum(AccessoryStatus)
  status: AccessoryStatus;
}

export class ListAccessoryDto {
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
  sellPrice: number;

  @Expose()
  @ApiProperty()
  rentalPrice: number;

  @Expose()
  @ApiProperty()
  isSellable: boolean;

  @Expose()
  @ApiProperty()
  isRentable: boolean;

  @Expose()
  @ApiProperty()
  ratingAverage: number;

  @Expose()
  @ApiProperty()
  status: AccessoryStatus;

  @Expose()
  @Type(() => ProductUserDto)
  user: ProductUserDto;

  @Expose()
  @Type(() => ProductCategoryDto)
  category: ProductCategoryDto;
}
