import { Base } from '@/common/models/base.model';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';

@Entity('complaint_reasons')
export class ComplaintReason extends Base {
  @Column({ type: 'int', nullable: false })
  @ApiProperty({ example: 1 })
  code: number;

  @Column({ type: 'text', nullable: false })
  @ApiProperty({ example: 'Reason for complaint' })
  reason: string;
}
