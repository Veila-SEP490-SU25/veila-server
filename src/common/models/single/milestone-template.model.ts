import { Base } from '@/common/models/base.model';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';

export enum MilestoneTemplateType {
  SELL = 'SELL',
  RENT = 'RENT',
  CUSTOM = 'CUSTOM',
}

@Entity('milestone_templates')
export class MilestoneTemplate extends Base {
  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  @ApiProperty({
    type: String,
    maxLength: 255,
    example: 'Thiết kế mẫu váy',
  })
  title: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  @ApiProperty({
    type: String,
    example: 'Mô tả chi tiết về mẫu',
  })
  description: string;

  @Column({
    type: 'int',
    nullable: false,
  })
  @ApiProperty({
    type: Number,
    example: 1,
  })
  index: number;

  @Column({
    type: 'int',
    nullable: false,
  })
  @ApiProperty({
    type: Number,
    example: 30,
  })
  timeGap: number;

  @Column({
    type: 'enum',
    enum: MilestoneTemplateType,
    nullable: false,
  })
  @ApiProperty({
    type: String,
    enum: MilestoneTemplateType,
    example: MilestoneTemplateType.SELL,
  })
  type: MilestoneTemplateType;
}
