import { Base } from '@/common/models/base.model';
import { Request } from '@/common/models/order/request.model';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

export enum UpdateRequestStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

@Entity('update_requests')
export class UpdateRequest extends Base {
  @ManyToOne(() => Request, (request) => request.updateRequests, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'request_id',
    foreignKeyConstraintName: 'fk_request_update_request',
  })
  @ApiProperty({
    description: 'Yêu cầu cập nhật liên quan',
    type: Request,
  })
  request: Request;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: false,
    comment: 'Tiêu đề yêu cầu',
  })
  @ApiProperty({
    type: 'string',
    maxLength: 200,
    nullable: false,
    description: 'Tiêu đề yêu cầu',
    example: 'Yêu cầu thiết kế váy cưới',
  })
  title: string;

  @Column({
    type: 'text',
    nullable: false,
    comment: 'Mô tả chi tiết yêu cầu',
  })
  @ApiProperty({
    type: 'string',
    nullable: false,
    description: 'Mô tả chi tiết yêu cầu',
    example: 'Tôi muốn thiết kế một chiếc váy cưới theo phong cách cổ điển.',
  })
  description: string;

  @Column({
    type: 'enum',
    enum: UpdateRequestStatus,
    default: UpdateRequestStatus.PENDING,
    nullable: false,
    comment: 'Trạng thái yêu cầu',
  })
  @ApiProperty({
    enum: UpdateRequestStatus,
    default: UpdateRequestStatus.PENDING,
    nullable: false,
    description: 'Trạng thái yêu cầu',
    example: UpdateRequestStatus.PENDING,
  })
  status: UpdateRequestStatus;
}
