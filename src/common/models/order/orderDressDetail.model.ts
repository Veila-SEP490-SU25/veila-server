import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Base, Dress, Order } from '@/common/models';
import { ApiProperty } from '@nestjs/swagger';

@Entity('order_dress_details')
export class OrderDressDetail extends Base {
  @OneToOne(() => Order, (order) => order.orderDressDetail, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'order_id',
    foreignKeyConstraintName: 'fk_order_order_dress_detail',
  })
  order: Order;

  @ManyToOne(() => Dress, {
    nullable: true,
  })
  @JoinColumn({
    name: 'dress_id',
    foreignKeyConstraintName: 'fk_dress_order_dress_detail',
  })
  dress: Dress;

  @Column({
    type: 'integer',
    unsigned: true,
    nullable: true,
    comment: 'Chiều cao của cô dâu',
  })
  @ApiProperty({
    type: 'number',
    nullable: true,
    description: 'Chiều cao của cô dâu (cm)',
    example: '170',
  })
  high: number | null;

  @Column({
    type: 'integer',
    unsigned: true,
    nullable: true,
    comment: 'Cân nặng',
  })
  @ApiProperty({
    type: 'number',
    nullable: true,
    description: 'Cân nặng (kg)',
    example: '45',
  })
  weight: number | null;

  @Column({
    type: 'integer',
    unsigned: true,
    nullable: true,
    comment: 'Vòng ngực',
  })
  @ApiProperty({
    type: 'number',
    nullable: true,
    description: 'Vòng ngực (cm)',
    example: '90',
  })
  bust: number | null;

  @Column({
    type: 'integer',
    unsigned: true,
    nullable: true,
    comment: 'Vòng eo',
  })
  @ApiProperty({
    type: 'number',
    nullable: true,
    description: 'Vòng eo (cm)',
    example: '60',
  })
  waist: number | null;

  @Column({
    type: 'integer',
    unsigned: true,
    nullable: true,
    comment: 'Vòng mông',
  })
  @ApiProperty({
    type: 'number',
    nullable: true,
    description: 'Vòng mông (cm)',
    example: '80',
  })
  hip: number | null;

  @Column({
    type: 'integer',
    unsigned: true,
    nullable: true,
    comment: 'Vòng nách',
  })
  @ApiProperty({
    type: 'number',
    nullable: true,
    description: 'Vòng nách (cm)',
    example: '10',
  })
  armpit: number | null;

  @Column({
    type: 'integer',
    unsigned: true,
    nullable: true,
    comment: 'Vòng bắp tay',
  })
  @ApiProperty({
    type: 'number',
    nullable: true,
    description: 'Vòng bắp tay (cm)',
    example: '10',
  })
  bicep: number | null;

  @Column({
    type: 'integer',
    unsigned: true,
    nullable: true,
    comment: 'Vòng cổ',
  })
  @ApiProperty({
    type: 'number',
    nullable: true,
    description: 'Vòng cổ (cm)',
    example: '20',
  })
  neck: number | null;

  @Column({
    type: 'integer',
    unsigned: true,
    nullable: true,
    comment: 'Chiều rộng vai',
  })
  @ApiProperty({
    type: 'number',
    nullable: true,
    description: 'Chiều rộng vai (cm)',
    example: '40',
  })
  shoulderWidth: number | null;

  @Column({
    type: 'integer',
    unsigned: true,
    nullable: true,
    comment: 'Chiều dài tay',
  })
  @ApiProperty({
    type: 'number',
    nullable: true,
    description: 'Chiều dài tay (cm)',
    example: '40',
  })
  sleeveLength: number | null;

  @Column({
    type: 'integer',
    unsigned: true,
    nullable: true,
    comment: 'Chiều dài lưng, từ chân cổ đến eo',
  })
  @ApiProperty({
    type: 'number',
    nullable: true,
    description: 'Chiều dài lưng, từ chân cổ đến eo (cm)',
    example: '60',
  })
  backLength: number | null;

  @Column({
    type: 'integer',
    unsigned: true,
    nullable: true,
    comment: 'Từ chân ngực đến eo',
  })
  @ApiProperty({
    type: 'number',
    nullable: true,
    description: 'Từ chân ngực đến eo (cm)',
    example: '50',
  })
  lowerWaist: number | null;

  @Column({
    type: 'integer',
    unsigned: true,
    nullable: true,
    comment: 'Độ dài tùng váy',
  })
  @ApiProperty({
    type: 'number',
    nullable: true,
    description: 'Độ dài tùng váy (cm)',
    example: '60',
  })
  waistToFloor: number | null;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: true,
    comment: 'Mô tả thêm',
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
  })
  @ApiProperty({
    type: 'string',
    maxLength: 200,
    nullable: true,
    description: 'Mô tả thêm',
    example: '...',
  })
  description: string | null;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    unsigned: true,
    nullable: false,
    default: 0,
    comment: 'Giá váy/phụ kiện tại thời điểm đặt',
  })
  @ApiProperty({
    type: 'number',
    format: 'decimal',
    minimum: 0,
    nullable: false,
    description: 'Giá váy/phụ kiện tại thời điểm đặt (VNĐ)',
    example: 2000000,
  })
  price: number;

  @Column({
    type: 'boolean',
    nullable: false,
    default: false,
    comment: 'Váy cưới/phụ kiện đã được đánh giá hay chưa',
  })
  @ApiProperty({
    type: 'boolean',
    default: false,
    nullable: false,
    description: 'Váy cưới/phụ kiện đã được đánh giá hay chưa',
    example: false,
  })
  isRated: boolean;
}
