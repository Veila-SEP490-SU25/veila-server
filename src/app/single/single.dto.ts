import { MilestoneTemplateType } from '@/common/models/single/milestone-template.model';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CUSlideDto {
  @ApiProperty({
    type: 'string',
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'The unique identifier for the slide.',
  })
  @IsString()
  title: string;

  @ApiProperty({
    type: 'string',
    nullable: true,
    description: 'Mô tả của slide',
  })
  @IsString()
  @IsOptional()
  description: string | null;

  @ApiProperty({
    type: 'string',
    format: 'text',
    nullable: true,
    description: "Chuỗi hình ảnh, cách nhau bằng dấu ','",
    example: 'https://veila.images/1,https://veila.images/2',
  })
  @IsString()
  @IsOptional()
  images: string | null;
}

export class CUMilestoneTemplateDto {
  @ApiProperty({
    type: String,
    maxLength: 255,
    example: 'Thiết kế mẫu váy',
  })
  title: string;

  @ApiProperty({
    type: String,
    example: 'Mô tả chi tiết về mẫu',
  })
  description: string;

  @ApiProperty({
    type: Number,
    example: 30,
  })
  timeGap: number;

  @ApiProperty({
    type: String,
    enum: MilestoneTemplateType,
    example: MilestoneTemplateType.SELL,
  })
  type: MilestoneTemplateType;
}