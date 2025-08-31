import { ApiProperty } from '@nestjs/swagger/dist/decorators';
import { Expose, Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, Min, Max } from 'class-validator';

export class CUOrderDressDetailDto {
  @ApiProperty({ description: 'ID của váy cưới', example: 'uuid-dress-1' })
  @IsNotEmpty()
  @IsString()
  dressId: string;

  @ApiProperty({ description: 'Chiều cao của cô dâu', example: 165 })
  @IsNotEmpty()
  @IsNumber()
  @Min(145)
  @Max(175)
  height: number;

  @ApiProperty({ description: 'Cân nặng của cô dâu', example: 50 })
  @IsNotEmpty()
  @IsNumber()
  @Min(38)
  @Max(75)
  weight: number;

  @ApiProperty({ description: 'Vòng ngực của cô dâu', example: 85 })
  @IsNotEmpty()
  @IsNumber()
  @Min(75)
  @Max(100)
  bust: number;

  @ApiProperty({ description: 'Vòng eo của cô dâu', example: 65 })
  @IsNotEmpty()
  @IsNumber()
  @Min(55)
  @Max(85)
  waist: number;

  @ApiProperty({ description: 'Vòng hông của cô dâu', example: 90 })
  @IsNotEmpty()
  @IsNumber()
  @Min(80)
  @Max(105)
  hip: number;

  @ApiProperty({ description: 'Vòng nách của cô dâu', example: 10 })
  @IsNotEmpty()
  @IsNumber()
  @Min(15)
  @Max(30)
  armpit: number;

  @ApiProperty({ description: 'Vòng bắp tay của cô dâu', example: 10 })
  @IsNotEmpty()
  @IsNumber()
  @Min(20)
  @Max(35)
  bicep: number;

  @ApiProperty({ description: 'Vòng cổ của cô dâu', example: 20 })
  @IsNotEmpty()
  @IsNumber()
  @Min(28)
  @Max(38)
  neck: number;

  @ApiProperty({ description: 'Chiều rộng vai của cô dâu', example: 40 })
  @IsNotEmpty()
  @IsNumber()
  @Min(32)
  @Max(45)
  shoulderWidth: number;

  @ApiProperty({ description: 'Chiều dài tay của cô dâu', example: 40 })
  @IsNotEmpty()
  @IsNumber()
  @Min(45)
  @Max(65)
  sleeveLength: number;

  @ApiProperty({ description: 'Chiều dài lưng của cô dâu', example: 60 })
  @IsNotEmpty()
  @IsNumber()
  @Min(35)
  @Max(55)
  backLength: number;

  @ApiProperty({ description: 'Từ chân ngực đến eo của cô dâu', example: 50 })
  @IsNotEmpty()
  @IsNumber()
  @Min(10)
  @Max(25)
  lowerWaist: number;

  @ApiProperty({ description: 'Độ dài tùng váy', example: 60 })
  @IsNotEmpty()
  @IsNumber()
  @Min(90)
  @Max(120)
  waistToFloor: number;
}

export class OrderDressDetailDto {
  @Expose()
  @ApiProperty({ description: 'ID của các váy cưới trong đơn hàng', example: 'uuid-dress-1' })
  id: string;

  @Expose()
  @ApiProperty({ description: 'ID của đơn hàng', example: 'uuid-order-1' })
  @Transform(({ obj: orderDressDetail }) => orderDressDetail.order?.id ?? null)
  orderId: string;

  @Expose()
  @ApiProperty({ description: 'ID của váy cưới', example: 'uuid-dress-1' })
  @Transform(({ obj: orderDressDetail }) => orderDressDetail.dress?.id ?? null)
  dressId: string;

  @Expose()
  @ApiProperty({ description: 'Tên của váy cưới', example: 'Váy cưới đẹp' })
  @Transform(({ obj: orderDressDetail }) => orderDressDetail.dress?.name ?? null)
  dressName: string;

  @Expose()
  @ApiProperty({ description: 'Chiều cao của cô dâu', example: 165 })
  height: number;

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
