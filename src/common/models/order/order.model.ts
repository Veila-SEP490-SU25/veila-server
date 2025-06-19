import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import {
  Base,
  Milestone,
  OrderDressDetail,
  OrderServiceDetail,
  Shop,
  Transaction,
  User,
} from '../';
import { ApiProperty } from '@nestjs/swagger';

export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum OrderType {
  SELL = 'SELL',
  RENT = 'RENT',
  CUSTOM = 'CUSTOM',
}

@Entity('orders')
export class Order extends Base {
  @ManyToOne(() => User, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'customer_id',
    foreignKeyConstraintName: 'fk_customer_order',
  })
  @ApiProperty({
    description: 'Khách hàng đặt đơn',
    type: User,
  })
  customer: User;

  @ManyToOne(() => Shop, {
    nullable: false,
  })
  @JoinColumn({
    name: 'shop_id',
    foreignKeyConstraintName: 'fk_shop_order',
  })
  @ApiProperty({
    description: 'Cửa hàng thực hiện đơn',
    type: Shop,
  })
  shop: Shop;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    unsigned: true,
    nullable: false,
    default: 0,
    comment: 'Tổng số tiền của đơn hàng',
  })
  @ApiProperty({
    type: 'number',
    format: 'decimal',
    minimum: 0,
    nullable: false,
    description: 'Tổng số tiền của đơn hàng (VNĐ)',
    example: 5000000,
  })
  amount: number;

  @Column({
    type: 'enum',
    enum: OrderType,
    nullable: false,
    comment: 'Loại đơn hàng',
  })
  @ApiProperty({
    enum: OrderType,
    nullable: false,
    description: 'Loại đơn hàng',
    example: OrderType.SELL,
  })
  type: OrderType;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
    nullable: false,
    comment: 'Trạng thái đơn hàng',
  })
  @ApiProperty({
    enum: OrderStatus,
    default: OrderStatus.PENDING,
    nullable: false,
    description: 'Trạng thái đơn hàng',
    example: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Column({
    type: 'boolean',
    nullable: false,
    default: false,
    comment: 'Đơn hàng đã được đánh giá hay chưa',
  })
  @ApiProperty({
    type: 'boolean',
    default: false,
    nullable: false,
    description: 'Đơn hàng đã được đánh giá hay chưa',
    example: false,
  })
  isRated: boolean;

  @OneToMany(() => Milestone, (milestone) => milestone.order)
  @ApiProperty({
    type: [Milestone],
    description: 'Danh sách các mốc công việc của đơn hàng',
  })
  milestones: Milestone[];

  @OneToMany(() => OrderDressDetail, (orderDressDetail) => orderDressDetail.order, {
    nullable: true,
  })
  @ApiProperty({
    type: [OrderDressDetail],
    nullable: true,
    description: 'Danh sách chi tiết váy/phụ kiện của đơn hàng',
  })
  orderDressDetail: OrderDressDetail[];

  @OneToMany(() => OrderServiceDetail, (orderServiceDetail) => orderServiceDetail.order, {
    nullable: true,
  })
  @ApiProperty({
    type: [OrderServiceDetail],
    nullable: true,
    description: 'Danh sách chi tiết dịch vụ của đơn hàng',
  })
  orderServiceDetail: OrderServiceDetail[];

  @OneToMany(() => Transaction, (transaction) => transaction.order, {
    nullable: false,
  })
  @ApiProperty({
    type: [Transaction],
    nullable: false,
    description: 'Danh sách chi tiết các giao dịch của đơn hàng',
  })
  transaction: Transaction[];
}
