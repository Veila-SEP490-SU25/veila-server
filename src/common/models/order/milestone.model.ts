import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Base, Order, Task } from '@/common/models';
import { ApiProperty } from '@nestjs/swagger';

export enum MilestoneStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

@Entity('milestones')
export class Milestone extends Base {
  @ManyToOne(() => Order, (order) => order.milestones, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'order_id',
    foreignKeyConstraintName: 'fk_order_milestone',
  })
  @ApiProperty({
    description: 'Đơn hàng mà mốc công việc này thuộc về',
    type: Order,
  })
  order: Order;

  @Column({
    name: 'title',
    type: 'varchar',
    length: 200,
    nullable: false,
    comment: 'Tiêu đề ngắn gọn của mốc công việc',
  })
  @ApiProperty({
    type: 'string',
    maxLength: 200,
    nullable: false,
    description: 'Tiêu đề mốc công việc',
    example: 'Thiết kế mẫu váy',
  })
  title: string;

  @Column({
    name: 'description',
    type: 'text',
    nullable: true,
    comment: 'Mô tả chi tiết mốc công việc (có thể để trống)',
  })
  @ApiProperty({
    type: 'string',
    format: 'text',
    nullable: true,
    description: 'Mô tả chi tiết mốc công việc (có thể để trống)',
    example: 'Thiết kế mẫu váy dựa trên yêu cầu của khách hàng.',
  })
  description: string | null;

  @Column({
    name: 'index',
    type: 'integer',
    nullable: false,
    comment: 'Số thứ tự các milestone',
  })
  @ApiProperty({
    type: 'number',
    format: 'number',
    nullable: false,
    description: 'Số thứ tự các milestone',
    example: '0',
  })
  index: number;

  @Column({
    name: 'status',
    type: 'enum',
    enum: MilestoneStatus,
    default: MilestoneStatus.PENDING,
    nullable: false,
    comment: 'Trạng thái của mốc công việc',
  })
  @ApiProperty({
    enum: MilestoneStatus,
    default: MilestoneStatus.PENDING,
    nullable: false,
    description: 'Trạng thái của mốc công việc',
    example: MilestoneStatus.PENDING,
  })
  status: MilestoneStatus;

  @Column({
    name: 'due_date',
    type: 'datetime',
    nullable: false,
    comment: 'Hạn hoàn thành mốc công việc',
  })
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    nullable: false,
    description: 'Hạn hoàn thành mốc công việc (ISO 8601)',
    example: '2025-07-01T17:00:00.000Z',
  })
  dueDate: Date;

  @OneToMany(() => Task, (task) => task.milestone)
  @ApiProperty({
    type: [Task],
    description: 'Danh sách các công việc (task) thuộc mốc công việc này',
  })
  tasks: Task[];
}
