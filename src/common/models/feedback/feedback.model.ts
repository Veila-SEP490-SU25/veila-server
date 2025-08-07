import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Accessory, Base, Dress, Order, Service, User } from '@/common/models';
import { ApiProperty } from '@nestjs/swagger';

@Entity('feedbacks')
export class Feedback extends Base {
  @ManyToOne(() => User, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'customer_id',
    foreignKeyConstraintName: 'fk_customer_feedback',
  })
  customer: User;

  @ManyToOne(() => Order, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'order_id',
    foreignKeyConstraintName: 'fk_order_feedback',
  })
  order: Order;

  @ManyToOne(() => Dress, (dress) => dress.feedbacks, {
    nullable: true,
  })
  @JoinColumn({
    name: 'dress_id',
    foreignKeyConstraintName: 'fk_dress_feedback',
  })
  dress: Dress | null;

  @ManyToOne(() => Service, (service) => service.feedbacks, {
    nullable: true,
  })
  @JoinColumn({
    name: 'service_id',
    foreignKeyConstraintName: 'fk_service_feedback',
  })
  service: Service | null;

  @ManyToOne(() => Accessory, (accessory) => accessory.feedbacks, {
    nullable: true,
  })
  @JoinColumn({
    name: 'accessory_id',
    foreignKeyConstraintName: 'fk_accessory_feedback',
  })
  accessory: Accessory | null;

  @Column({
    name: 'content',
    type: 'text',
    nullable: false,
    comment: 'Nội dung đánh giá',
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
  })
  @ApiProperty({
    type: 'string',
    description: 'Nội dung đánh giá',
    example: 'Dịch vụ rất tốt, nhân viên thân thiện.',
    required: true,
  })
  content: string;

  @Column({
    name: 'rating',
    type: 'decimal',
    precision: 2,
    scale: 1,
    unsigned: true,
    nullable: false,
    comment: 'Điểm đánh giá (từ 0.0 đến 5.0)',
  })
  @ApiProperty({
    type: 'number',
    format: 'decimal',
    description: 'Điểm đánh giá (từ 0.0 đến 5.0, làm tròn đến 1 chữ số thập phân)',
    example: 4.5,
    minimum: 0,
    maximum: 5,
    required: true,
  })
  rating: number;
}
