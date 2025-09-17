import { MilestoneTemplateType } from '@/common/models/single/milestone-template.model';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min, Max } from 'class-validator';

export class CancelPenaltyDto {
  @ApiProperty({
    example: 5,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  penalty: number;
}

export class DelayPenaltyDto {
  @ApiProperty({
    example: 15,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  penalty: number;
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
