import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Base, Milestone } from '@/common/models';
import { ApiProperty } from '@nestjs/swagger';

export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

@Entity('tasks')
export class Task extends Base {
  @ManyToOne(() => Milestone, (milestone) => milestone.tasks, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'milestone_id',
    foreignKeyConstraintName: 'fk_milestone_task',
  })
  @ApiProperty({
    description: 'Mốc công việc (milestone) mà task này thuộc về',
    type: Milestone,
  })
  milestone: Milestone;

  @Column({
    name: 'title',
    type: 'varchar',
    length: 200,
    nullable: false,
    comment: 'Tiêu đề ngắn gọn của công việc',
  })
  @ApiProperty({
    type: 'string',
    maxLength: 200,
    nullable: false,
    description: 'Tiêu đề công việc',
    example: 'Chụp ảnh sản phẩm',
  })
  title: string;

  @Column({
    name: 'description',
    type: 'text',
    nullable: true,
    comment: 'Mô tả chi tiết công việc (có thể để trống)',
  })
  @ApiProperty({
    type: 'string',
    format: 'text',
    nullable: true,
    description: 'Mô tả chi tiết công việc (có thể để trống)',
    example: 'Chụp 5 góc khác nhau của sản phẩm, đảm bảo ánh sáng tốt.',
  })
  description: string | null;

  @Column({
    name: 'status',
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.PENDING,
    nullable: false,
    comment: 'Trạng thái của công việc',
  })
  @ApiProperty({
    enum: TaskStatus,
    default: TaskStatus.PENDING,
    description: 'Trạng thái của công việc',
    example: TaskStatus.PENDING,
  })
  status: TaskStatus;

  @Column({
    name: 'due_date',
    type: 'datetime',
    nullable: false,
    comment: 'Hạn hoàn thành công việc',
  })
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    nullable: false,
    description: 'Hạn hoàn thành công việc (ISO 8601)',
    example: '2025-07-01T17:00:00.000Z',
  })
  dueDate: Date;
}
