import { Base } from '@/common/models/base.model';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';

@Entity('app_settings')
export class AppSetting extends Base {
  @Column({
    name: 'cancel_penalty',
    type: 'int',
    nullable: false,
    default: 5,
  })
  @ApiProperty({ example: 5 })
  cancelPenalty: number;

  @Column({
    name: 'delay_penalty',
    type: 'int',
    nullable: false,
    default: 15,
  })
  @ApiProperty({ example: 15 })
  delayPenalty: number;

  @Column({
    name: 'days_to_complaint',
    type: 'int',
    nullable: false,
    default: 3,
  })
  @ApiProperty({ example: 3 })
  daysToComplaint: number;

  @Column({
    name: 'days_to_review_update_request',
    type: 'int',
    nullable: false,
    default: 2,
  })
  @ApiProperty({ example: 2 })
  daysToReviewUpdateRequest: number;
}
