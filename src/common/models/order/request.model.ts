import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Base, UpdateRequest, User } from '@/common/models';
import { ApiProperty } from '@nestjs/swagger';

export enum RequestStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

@Entity('requests')
export class Request extends Base {
  @ManyToOne(() => User, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'user_id',
    foreignKeyConstraintName: 'fk_user_request',
  })
  @ApiProperty({
    description: 'Người gửi yêu cầu',
    type: () => User,
  })
  user: User;

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
    enum: RequestStatus,
    default: RequestStatus.PENDING,
    nullable: false,
    comment: 'Trạng thái yêu cầu',
  })
  @ApiProperty({
    enum: RequestStatus,
    default: RequestStatus.PENDING,
    nullable: false,
    description: 'Trạng thái yêu cầu',
    example: RequestStatus.PENDING,
  })
  status: RequestStatus;

  @Column({
    type: 'boolean',
    nullable: false,
    default: false,
    comment: 'Yêu cầu này có riêng tư không',
  })
  @ApiProperty({
    type: 'boolean',
    default: false,
    nullable: false,
    description: 'Yêu cầu này có riêng tư không',
    example: false,
  })
  isPrivate: boolean;

  @OneToMany(() => UpdateRequest, (updateRequest) => updateRequest.request, {
    nullable: true,
  })
  @ApiProperty({
    type: () => [UpdateRequest],
    nullable: true,
    description: 'Danh sách các yêu cầu cập nhật liên quan',
  })
  updateRequests: UpdateRequest[] | null;
}
