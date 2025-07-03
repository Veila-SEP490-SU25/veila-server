import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Accessory, Base, Dress, Order } from '@/common/models';
import { ApiProperty } from '@nestjs/swagger';

@Entity('order_dress_details')
export class OrderDressDetail extends Base {
  @ManyToOne(() => Order, (order) => order.orderDressDetail, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'order_id',
    foreignKeyConstraintName: 'fk_order_order_dress_detail',
  })
  @ApiProperty({
    description: 'Đơn hàng liên quan',
    type: Order,
  })
  order: Order;

  @ManyToOne(() => Dress, {
    nullable: true,
  })
  @JoinColumn({
    name: 'dress_id',
    foreignKeyConstraintName: 'fk_dress_order_dress_detail',
  })
  @ApiProperty({
    description: 'Váy được đặt (có thể null nếu chỉ đặt phụ kiện)',
    type: Dress,
    nullable: true,
  })
  dress: Dress | null;

  @ManyToOne(() => Accessory, {
    nullable: true,
  })
  @JoinColumn({
    name: 'accessory_id',
    foreignKeyConstraintName: 'fk_accessory_order_dress_detail',
  })
  @ApiProperty({
    description: 'Phụ kiện đi kèm (có thể null)',
    type: Accessory,
    nullable: true,
  })
  accessory: Accessory | null;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    comment: 'Kích cỡ hoặc thông số váy',
  })
  @ApiProperty({
    type: 'string',
    maxLength: 50,
    nullable: false,
    description: 'Kích cỡ hoặc thông số váy',
    example: 'M',
  })
  assizes: string;

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
}
