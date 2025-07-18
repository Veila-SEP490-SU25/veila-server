import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Base, Order, User } from '@/common/models';
import { ApiProperty } from '@nestjs/swagger';

export enum ComplaintStatus {
  DRAFT = 'DRAFT',
  IN_PROGRESS = 'IN_PROGRESS',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

@Entity('complaints')
export class Complaint extends Base {
  @ManyToOne(() => User, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'sender_id',
    foreignKeyConstraintName: 'fk_sender_complaint',
  })
  @ApiProperty({
    description: 'Người gửi khiếu nại',
    type: User,
  })
  sender: User;

  @ManyToOne(() => Order, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'order_id',
    foreignKeyConstraintName: 'fk_order_complaint',
  })
  @ApiProperty({
    description: 'Đơn hàng liên quan đến khiếu nại',
    type: Order,
  })
  order: Order;

  @Column({
    name: 'title',
    type: 'varchar',
    length: 200,
    nullable: false,
    comment: 'Tiêu đề khiếu nại',
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
  })
  @ApiProperty({
    type: 'string',
    description: 'Tiêu đề khiếu nại',
    example: 'Sản phẩm bị lỗi khi nhận hàng',
    maxLength: 200,
    required: true,
  })
  title: string;

  @Column({
    name: 'description',
    type: 'text',
    nullable: false,
    comment: 'Mô tả chi tiết khiếu nại',
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
  })
  @ApiProperty({
    type: 'string',
    description: 'Mô tả chi tiết khiếu nại',
    example: 'Sản phẩm bị rách và không đúng mô tả.',
    required: true,
  })
  description: string;

  @Column({
    name: 'status',
    type: 'enum',
    enum: ComplaintStatus,
    default: ComplaintStatus.DRAFT,
    nullable: false,
    comment: 'Trạng thái khiếu nại',
  })
  @ApiProperty({
    enum: ComplaintStatus,
    description: 'Trạng thái khiếu nại',
    example: ComplaintStatus.DRAFT,
    default: ComplaintStatus.DRAFT,
    required: true,
  })
  status: ComplaintStatus;
}
