import { ApiProperty } from '@nestjs/swagger/dist/decorators';
import { Expose, Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CUOrderDressDetailDto {
  @ApiProperty({ description: 'ID của váy cưới', example: 'uuid-dress-1' })
  @IsNotEmpty()
  @IsString()
  dressId: string;

  @ApiProperty({ description: 'Chiều cao của cô dâu', example: 165 })
  @IsNotEmpty()
  @IsNumber()
  high: number;

  @ApiProperty({ description: 'Cân nặng của cô dâu', example: 50 })
  @IsNotEmpty()
  @IsNumber()
  weight: number;

  @ApiProperty({ description: 'Vòng ngực của cô dâu', example: 85 })
  @IsNotEmpty()
  @IsNumber()
  bust: number;

  @ApiProperty({ description: 'Vòng eo của cô dâu', example: 65 })
  @IsNotEmpty()
  @IsNumber()
  waist: number;

  @ApiProperty({ description: 'Vòng hông của cô dâu', example: 90 })
  @IsNotEmpty()
  @IsNumber()
  hip: number;

  @ApiProperty({ description: 'Vòng nách của cô dâu', example: 10 })
  @IsNotEmpty()
  @IsNumber()
  armpit: number;

  @ApiProperty({ description: 'Vòng bắp tay của cô dâu', example: 10 })
  @IsNotEmpty()
  @IsNumber()
  bicep: number;

  @ApiProperty({ description: 'Vòng cổ của cô dâu', example: 20 })
  @IsNotEmpty()
  @IsNumber()
  neck: number;

  @ApiProperty({ description: 'Chiều rộng vai của cô dâu', example: 40 })
  @IsNotEmpty()
  @IsNumber()
  shoulderWidth: number;

  @ApiProperty({ description: 'Chiều dài tay của cô dâu', example: 40 })
  @IsNotEmpty()
  @IsNumber()
  sleeveLength: number;

  @ApiProperty({ description: 'Chiều dài lưng của cô dâu', example: 60 })
  @IsNotEmpty()
  @IsNumber()
  backLength: number;

  @ApiProperty({ description: 'Từ chân ngực đến eo của cô dâu', example: 50 })
  @IsNotEmpty()
  @IsNumber()
  lowerWaist: number;

  @ApiProperty({ description: 'Độ dài tùng váy', example: 60 })
  @IsNotEmpty()
  @IsNumber()
  waistToFloor: number;

  @ApiProperty({ description: 'Mô tả về váy cưới', example: 'Váy cưới này rất đẹp' })
  description: string | null;

  @ApiProperty({ description: 'Giá của váy cưới', example: 200000 })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({ description: 'Váy cưới đã được đánh giá hay chưa', example: true })
  @IsNotEmpty()
  @IsBoolean()
  is_rated: boolean;
}

export class OrderDressDetailDto {
  @Expose()
  @ApiProperty({ description: 'ID của các váy cưới trong đơn hàng', example: 'uuid-dress-1' })
  id: string;

  @Expose()
  @ApiProperty({ description: 'ID của đơn hàng', example: 'uuid-order-1' })
  @Transform(({ obj: orderDressDetail }) => orderDressDetail.order.id)
  orderId: string;

  @Expose()
  @ApiProperty({ description: 'ID của váy cưới', example: 'uuid-dress-1' })
  @Transform(({ obj: orderDressDetail }) => orderDressDetail.dress.id)
  dressId: string;

  @Expose()
  @ApiProperty({ description: 'Chiều cao của cô dâu', example: 165 })
  high: number;

  @Expose()
  @ApiProperty({ description: 'Cân nặng của cô dâu', example: 50 })
  weight: number;

  @Expose()
  @ApiProperty({ description: 'Vòng ngực của cô dâu', example: 85 })
  bust: number;

  @Expose()
  @ApiProperty({ description: 'Vòng eo của cô dâu', example: 65 })
  waist: number;

  @Expose()
  @ApiProperty({ description: 'Vòng hông của cô dâu', example: 90 })
  hip: number;

  @Expose()
  @ApiProperty({ description: 'Vòng nách của cô dâu', example: 10 })
  armpit: number;

  @Expose()
  @ApiProperty({ description: 'Vòng bắp tay của cô dâu', example: 10 })
  bicep: number;

  @Expose()
  @ApiProperty({ description: 'Vòng cổ của cô dâu', example: 20 })
  neck: number;

  @Expose()
  @ApiProperty({ description: 'Chiều rộng vai của cô dâu', example: 40 })
  shoulderWidth: number;

  @Expose()
  @ApiProperty({ description: 'Chiều dài tay của cô dâu', example: 40 })
  sleeveLength: number;

  @Expose()
  @ApiProperty({ description: 'Chiều dài lưng của cô dâu', example: 60 })
  backLength: number;

  @Expose()
  @ApiProperty({ description: 'Từ chân ngực đến eo của cô dâu', example: 50 })
  lowerWaist: number;

  @Expose()
  @ApiProperty({ description: 'Độ dài tùng váy', example: 60 })
  waistToFloor: number;

  @Expose()
  @ApiProperty({ description: 'Mô tả về váy cưới', example: 'Váy cưới này rất đẹp' })
  description: string | null;

  @Expose()
  @ApiProperty({ description: 'Giá của váy cưới', example: 200000 })
  price: number;

  @Expose()
  @ApiProperty({ description: 'Váy cưới đã được đánh giá hay chưa', example: true })
  is_rated: boolean;
}
