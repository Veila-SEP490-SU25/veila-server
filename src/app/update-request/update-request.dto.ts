import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CUUpdateRequestDto {
  @ApiProperty({
    type: 'string',
    maxLength: 200,
    nullable: false,
    description: 'ID của yêu cầu',
    example: 'req_123456',
  })
  @IsString()
  requestId: string;

  @ApiProperty({
    type: 'string',
    maxLength: 200,
    nullable: false,
    description: 'Tiêu đề yêu cầu',
    example: 'Yêu cầu thiết kế váy cưới',
  })
  @IsString()
  title: string;

  @ApiProperty({
    type: 'string',
    nullable: false,
    description: 'Mô tả chi tiết yêu cầu',
    example: 'Tôi muốn thiết kế một chiếc váy cưới theo phong cách cổ điển.',
  })
  @IsString()
  description: string;

  @ApiProperty({
    type: 'string',
    format: 'text',
    nullable: true,
    description: "Chuỗi hình ảnh (mẫu hình minh họa), cách nhau bằng dấu ','",
    example: 'https://veila.images/1,https://veila.images/2',
  })
  @IsString()
  @IsOptional()
  images: string | null;

  @ApiProperty({
    type: 'number',
    nullable: true,
    description: 'Chiều cao của cô dâu (cm)',
    example: '170',
  })
  @IsNumber()
  @IsOptional()
  height: number | null;

  @ApiProperty({
    type: 'number',
    nullable: true,
    description: 'Cân nặng của cô dâu (kg)',
    example: '55',
  })
  @IsNumber()
  @IsOptional()
  weight: number | null;

  @ApiProperty({
    type: 'number',
    nullable: true,
    description: 'Vòng ngực của cô dâu (cm)',
    example: '85',
  })
  @IsNumber()
  @IsOptional()
  bust: number | null;

  @ApiProperty({
    type: 'number',
    nullable: true,
    description: 'Vòng eo của cô dâu (cm)',
    example: '60',
  })
  @IsNumber()
  @IsOptional()
  waist: number | null;

  @ApiProperty({
    type: 'number',
    nullable: true,
    description: 'Vòng hông của cô dâu (cm)',
    example: '90',
  })
  @IsNumber()
  @IsOptional()
  hip: number | null;

  @ApiProperty({
    type: 'number',
    nullable: true,
    description: 'Vòng nách của cô dâu (cm)',
    example: '40',
  })
  @IsNumber()
  @IsOptional()
  armpit: number | null;

  @ApiProperty({
    type: 'number',
    nullable: true,
    description: 'Vòng bắp tay của cô dâu (cm)',
    example: '30',
  })
  @IsNumber()
  @IsOptional()
  bicep: number | null;

  @ApiProperty({
    type: 'number',
    nullable: true,
    description: 'Vòng cổ của cô dâu (cm)',
    example: '35',
  })
  @IsNumber()
  @IsOptional()
  neck: number | null;

  @ApiProperty({
    type: 'number',
    nullable: true,
    description: 'Chiều rộng vai (cm)',
    example: '40',
  })
  @IsNumber()
  @IsOptional()
  shoulderWidth: number | null;

  @ApiProperty({
    type: 'number',
    nullable: true,
    description: 'Chiều dài tay (cm)',
    example: '60',
  })
  @IsNumber()
  @IsOptional()
  sleeveLength: number | null;

  @ApiProperty({
    type: 'number',
    nullable: true,
    description: 'Chiều dài lưng (cm)',
    example: '40',
  })
  @IsNumber()
  @IsOptional()
  backLength: number | null;

  @ApiProperty({
    type: 'number',
    nullable: true,
    description: 'Vòng hông của cô dâu (cm)',
    example: '90',
  })
  @IsNumber()
  @IsOptional()
  lowerWaist: number | null;

  @ApiProperty({
    type: 'number',
    nullable: true,
    description: 'Độ dài tùng váy (cm)',
    example: '60',
  })
  @IsNumber()
  @IsOptional()
  waistToFloor: number | null;
}
