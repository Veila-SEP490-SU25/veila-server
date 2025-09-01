import { Base } from '@/common/models/base.model';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';

@Entity('complaint_reasons')
export class ComplaintReason extends Base {
  @Column({ type: 'varchar', length: 255, nullable: false })
  @ApiProperty({ example: 'REASON_1' })
  code: string;

  @Column({ type: 'text', nullable: false })
  @ApiProperty({ example: 'Reason for complaint' })
  reason: string;

  @Column({
    name: 'complaint_reputation_penalty',
    type: 'int',
    nullable: false,
    default: 10,
  })
  @ApiProperty({ example: 10 })
  complaintReputationPenalty: number;
}
