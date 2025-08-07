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
    type: 'number',
    nullable: true,
    description: 'Chiều cao của cô dâu (cm)',
    example: '170',
  })
  @IsNumber()
  @IsOptional()
  high: number | null;

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

  @ApiProperty({
    type: 'string',
    maxLength: 200,
    nullable: true,
    description: 'Kiểu dáng váy',
    example: 'Váy ngắn hoặc vạt trước ngắn vạt sau dài.',
  })
  @IsString()
  @IsOptional()
  dressStyle: string | null;

  @ApiProperty({
    type: 'string',
    maxLength: 200,
    nullable: true,
    description: 'Dạng cổ váy',
    example: 'Cổ tim, cổ tròn, cổ thuyền, cổ yếm, cúp ngực',
  })
  @IsString()
  @IsOptional()
  curtainNeckline: string | null;

  @ApiProperty({
    type: 'string',
    maxLength: 200,
    nullable: true,
    description: 'Dạng tay váy',
    example: 'Không tay, hai dây, tay trần, tay ngắn',
  })
  @IsString()
  @IsOptional()
  sleeveStyle: string | null;

  @ApiProperty({
    type: 'string',
    maxLength: 200,
    nullable: true,
    description: 'Chất liệu',
    example: 'Kim sa, Đính kết pha lê/ngọc trai',
  })
  @IsString()
  @IsOptional()
  material: string | null;

  @ApiProperty({
    type: 'string',
    maxLength: 200,
    nullable: true,
    description: 'Màu sắc',
    example: 'Trắng tinh, trắng ngà (ivory), kem',
  })
  @IsString()
  @IsOptional()
  color: string | null;

  @ApiProperty({
    type: 'string',
    maxLength: 200,
    nullable: true,
    description: 'Các yếu tố đặc biệt',
    example: 'Đính kết pha lê, hoa văn 3D',
  })
  @IsString()
  @IsOptional()
  specialElements: string | null;

  @ApiProperty({
    type: 'string',
    maxLength: 200,
    nullable: true,
    description: 'Độ che phủ',
    example: 'Mức độ hở lưng, xẻ ngực',
  })
  @IsString()
  @IsOptional()
  coverage: string | null;
}
