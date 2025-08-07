import { Base } from '@/common/models/base.model';
import { Order } from '@/common/models/order/order.model';
import { Accessory } from '@/common/models/product';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('order_accessory_details')
export class OrderAccessoryDetail extends Base {
  @ManyToOne(() => Order, (order) => order.orderDressDetail, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'order_id',
    foreignKeyConstraintName: 'fk_order_order_accessory_detail',
  })
  order: Order;

  @ManyToOne(() => Accessory, {
    nullable: true,
  })
  @JoinColumn({
    name: 'accessory_id',
    foreignKeyConstraintName: 'fk_accessory_order_accessory_detail',
  })
  accessory: Accessory;

  @Column({
    type: 'int',
    unsigned: true,
    nullable: false,
    default: 1,
    comment: 'Số lượng đặt',
  })
  @ApiProperty({
    type: 'integer',
    minimum: 1,
    nullable: false,
    description: 'Số lượng đặt',
    example: 2,
  })
  quantity: number;

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
    comment: 'Giá phụ kiện tại thời điểm đặt',
  })
  @ApiProperty({
    type: 'number',
    format: 'decimal',
    minimum: 0,
    nullable: false,
    description: 'Giá phụ kiện tại thời điểm đặt (VNĐ)',
    example: 2000000,
  })
  price: number;

  @Column({
    type: 'boolean',
    nullable: false,
    default: false,
    comment: 'phụ kiện đã được đánh giá hay chưa',
  })
  @ApiProperty({
    type: 'boolean',
    default: false,
    nullable: false,
    description: 'phụ kiện đã được đánh giá hay chưa',
    example: false,
  })
  isRated: boolean;
}
