import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Base, Dress, FeedbackImage, Order, Service, User } from '@/common/models';
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
  @ApiProperty({
    description: 'Khách hàng gửi đánh giá',
    type: User,
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
  @ApiProperty({
    description: 'Đơn hàng liên quan đến đánh giá',
    type: Order,
  })
  order: Order;

  @ManyToOne(() => Dress, (dress) => dress.feedbacks, {
    nullable: true,
  })
  @JoinColumn({
    name: 'dress_id',
    foreignKeyConstraintName: 'fk_dress_feedback',
  })
  @ApiProperty({
    description: 'Sản phẩm váy được đánh giá (nếu có)',
    type: Dress,
    nullable: true,
  })
  dress: Dress | null;

  @ManyToOne(() => Service, (service) => service.feedbacks, {
    nullable: true,
  })
  @JoinColumn({
    name: 'service_id',
    foreignKeyConstraintName: 'fk_service_feedback',
  })
  @ApiProperty({
    description: 'Dịch vụ được đánh giá (nếu có)',
    type: Service,
    nullable: true,
  })
  service: Service | null;

  @Column({
    name: 'content',
    type: 'text',
    nullable: false,
    comment: 'Nội dung đánh giá',
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

  @OneToMany(() => FeedbackImage, (feedbackImage) => feedbackImage.feedback)
  @ApiProperty({
    description: 'Danh sách hình ảnh minh họa cho đánh giá',
    type: [FeedbackImage],
  })
  images: FeedbackImage[];
}
