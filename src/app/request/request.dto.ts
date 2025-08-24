import { RequestStatus, UpdateRequestStatus } from '@/common/models';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class ListRequestDto {}

export class ItemRequestDto {}

export class CURequestDto {
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

  @ApiProperty({
    type: 'string',
    description: 'Chất liệu (tối đa 50 ký tự)',
    example: 'Cotton',
    maxLength: 50,
    nullable: true,
  })
  @IsString()
  @IsOptional()
  material: string | null;

  @ApiProperty({
    type: 'string',
    description: 'Màu sắc (tối đa 50 ký tự)',
    example: 'Đỏ',
    maxLength: 50,
    nullable: true,
  })
  @IsString()
  @IsOptional()
  color: string | null;

  @ApiProperty({
    type: 'string',
    description: 'Độ dài (tối đa 50 ký tự)',
    example: 'Dài',
    maxLength: 50,
    nullable: true,
  })
  @IsString()
  @IsOptional()
  length: string | null;

  @ApiProperty({
    type: 'string',
    description: 'Cổ (tối đa 50 ký tự)',
    example: 'Cổ tròn',
    maxLength: 50,
    nullable: true,
  })
  @IsString()
  @IsOptional()
  neckline: string | null;

  @ApiProperty({
    type: 'string',
    description: 'Tay (tối đa 50 ký tự)',
    example: 'Tay ngắn',
    maxLength: 50,
    nullable: true,
  })
  @IsString()
  @IsOptional()
  sleeve: string | null;

  @ApiProperty({
    enum: RequestStatus,
    default: RequestStatus.DRAFT,
    nullable: false,
    description: 'Trạng thái yêu cầu',
    example: RequestStatus.DRAFT,
  })
  @IsEnum(RequestStatus)
  status: RequestStatus;

  @ApiProperty({
    type: 'boolean',
    default: false,
    nullable: false,
    description: 'Yêu cầu này có riêng tư không',
    example: false,
  })
  @IsBoolean()
  isPrivate: boolean;
}

export class CUpdateRequestDto {
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

  @ApiProperty({
    type: 'string',
    description: 'Chất liệu (tối đa 50 ký tự)',
    example: 'Cotton',
    maxLength: 50,
    nullable: true,
  })
  @IsString()
  @IsOptional()
  material: string | null;

  @ApiProperty({
    type: 'string',
    description: 'Màu sắc (tối đa 50 ký tự)',
    example: 'Đỏ',
    maxLength: 50,
    nullable: true,
  })
  @IsString()
  @IsOptional()
  color: string | null;

  @ApiProperty({
    type: 'string',
    description: 'Độ dài (tối đa 50 ký tự)',
    example: 'Dài',
    maxLength: 50,
    nullable: true,
  })
  @IsString()
  @IsOptional()
  length: string | null;

  @ApiProperty({
    type: 'string',
    description: 'Cổ (tối đa 50 ký tự)',
    example: 'Cổ tròn',
    maxLength: 50,
    nullable: true,
  })
  @IsString()
  @IsOptional()
  neckline: string | null;

  @ApiProperty({
    type: 'string',
    description: 'Tay (tối đa 50 ký tự)',
    example: 'Tay ngắn',
    maxLength: 50,
    nullable: true,
  })
  @IsString()
  @IsOptional()
  sleeve: string | null;
}

export class ReviewUpdateRequestDto {
  @ApiProperty({
    type: 'string',
    description: 'Trạng thái yêu cầu cập nhật',
    example: 'ACCEPTED',
  })
  @IsEnum(UpdateRequestStatus)
  status: UpdateRequestStatus;

  @ApiProperty({
    type: 'number',
    description: 'Giá của yêu cầu cập nhật',
    example: 100000,
    default: 0,
  })
  @IsNumber()
  price: number;
}
