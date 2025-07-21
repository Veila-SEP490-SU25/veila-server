import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Base, Category, Feedback, User } from '@/common/models';
import { ApiProperty } from '@nestjs/swagger';

export enum ServiceStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Entity('services')
export class Service extends Base {
  @ManyToOne(() => User, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'user_id',
    foreignKeyConstraintName: 'fk_service_user',
  })
  @ApiProperty({
    description: 'Người dùng sở hữu dịch vụ',
    type: () => User,
    nullable: false,
  })
  user: User;

  @ManyToOne(() => Category, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({
    name: 'category_id',
    foreignKeyConstraintName: 'fk_service_category',
  })
  @ApiProperty({
    description: 'Danh mục của dịch vụ',
    type: () => Category,
    nullable: true,
  })
  category: Category | null;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 100,
    nullable: false,
    comment: 'Tên của dịch vụ',
  })
  @ApiProperty({
    type: 'string',
    description: 'Tên của dịch vụ (tối đa 100 ký tự)',
    example: 'Dịch vụ cho thuê',
    maxLength: 100,
    nullable: false,
  })
  name: string;

  @Column({
    name: 'description',
    type: 'text',
    nullable: true,
    comment: 'Mô tả dịch vụ',
  })
  @ApiProperty({
    type: 'string',
    format: 'text',
    nullable: true,
    description: 'Phần mô tả dịch vụ',
    example: 'Cửa hàng cung cấp dịch vụ cho thuê váy cưới',
  })
  description: string | null;

  @Column({
    name: 'rating_average',
    type: 'decimal',
    precision: 3,
    scale: 2,
    unsigned: true,
    nullable: false,
    default: 0.0,
    comment: 'Điểm đánh giá trung bình của dịch vụ (từ 0.00 đến 5.00)',
  })
  @ApiProperty({
    type: 'number',
    format: 'decimal',
    description:
      'Điểm đánh giá trung bình của dịch vụ (giá trị từ 0.00 đến 5.00, làm tròn đến 2 chữ số thập phân)',
    example: 4.25,
    minimum: 0,
    maximum: 5,
    default: 0.0,
    required: true,
  })
  ratingAverage: number;

  @Column({
    name: 'rating_count',
    type: 'int',
    unsigned: true,
    nullable: false,
    default: 0,
    comment: 'Số lượng đánh giá mà dịch vụ đã nhận được',
  })
  @ApiProperty({
    type: 'integer',
    description: 'Tổng số lượt đánh giá của dịch vụ',
    example: 120,
    minimum: 0,
    default: 0,
    required: true,
  })
  ratingCount: number;

  @Column({
    name: 'status',
    type: 'enum',
    enum: ServiceStatus,
    default: ServiceStatus.INACTIVE,
    comment: 'Trạng thái dịch vụ',
  })
  @ApiProperty({
    enumName: 'ServiceStatus',
    enum: ServiceStatus,
    description: 'Trạng thái dịch vụ',
    example: ServiceStatus.ACTIVE,
  })
  status: ServiceStatus;

  @OneToMany(() => Feedback, (feedback) => feedback.service)
  @ApiProperty({
    description: 'Danh sách các Feedback của dịch vụ',
    type: () => [Feedback],
  })
  feedbacks: Feedback[];
}
