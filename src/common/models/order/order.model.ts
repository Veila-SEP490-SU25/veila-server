import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import {
  Base,
  Milestone,
  OrderAccessoryDetail,
  OrderDressDetail,
  OrderServiceDetail,
  Shop,
  Transaction,
  User,
} from '@/common/models';
import { ApiProperty } from '@nestjs/swagger';

export enum OrderStatus {
  PENDING = 'PENDING',
  IN_PROCESS = 'IN_PROCESS',
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
  customer: User;

  @ManyToOne(() => Shop, {
    nullable: false,
  })
  @JoinColumn({
    name: 'shop_id',
    foreignKeyConstraintName: 'fk_shop_order',
  })
  shop: Shop;

  @Column({
    name: 'phone',
    type: 'varchar',
    length: 15,
    nullable: false,
    comment: 'Số điện thoại liên hệ',
  })
  @ApiProperty({
    type: 'string',
    description: 'Số điện thoại liên hệ của khách',
    example: '+84901234567',
    maxLength: 15,
    nullable: false,
  })
  phone: string;

  @Column({
    name: 'email',
    type: 'varchar',
    length: 64,
    nullable: true,
    comment: 'Email liên hệ',
  })
  @ApiProperty({
    type: 'string',
    format: 'email',
    description: 'Email liên hệ của khách',
    example: 'shop@example.com',
    maxLength: 64,
    nullable: true,
  })
  email: string;

  @Column({
    name: 'address',
    type: 'varchar',
    length: 255,
    nullable: false,
    comment: 'Địa chỉ shop',
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
  })
  @ApiProperty({
    type: 'string',
    description: 'Địa chỉ chi tiết của khách',
    example: '123 Đường ABC, Phường XYZ, Quận 1, TP.HCM',
    maxLength: 255,
    nullable: false,
  })
  address: string;

  @Column({
    name: 'due_date',
    type: 'date',
    nullable: false,
    comment: 'Hạn giao hàng cho khách',
  })
  @ApiProperty({
    type: 'string',
    format: 'date',
    nullable: false,
    description: 'Hạn giao hàng cho khách',
    example: '2025-07-01',
  })
  dueDate: Date;

  @Column({
    name: 'return_date',
    type: 'date',
    nullable: true,
    comment: 'Ngày trả hàng (nếu là đơn thuê)',
  })
  @ApiProperty({
    type: 'string',
    format: 'date',
    nullable: true,
    description: 'Ngày trả hàng (nếu là đơn thuê)',
    example: '2025-07-15',
  })
  returnDate: Date | null;

  @Column({
    name: 'is_buy_back',
    type: 'boolean',
    nullable: false,
    default: false,
    comment: 'Cửa hàng có mua lại váy cưới sau khi may cho khách không',
  })
  @ApiProperty({
    type: 'boolean',
    default: false,
    nullable: false,
    description: 'Cửa hàng có mua lại váy cưới sau khi may cho khách không',
    example: false,
  })
  isBuyBack: boolean;

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

  @OneToMany(() => Milestone, (milestone) => milestone.order)
  milestones: Milestone[];

  @OneToMany(() => OrderAccessoryDetail, (orderAccessoryDetail) => orderAccessoryDetail.order, {
    nullable: true,
  })
  orderAccessoryDetail: OrderAccessoryDetail[] | null;

  @OneToOne(() => OrderDressDetail, (orderDressDetail) => orderDressDetail.order, {
    nullable: true,
  })
  orderDressDetail: OrderDressDetail | null;

  @OneToOne(() => OrderServiceDetail, (orderServiceDetail) => orderServiceDetail.order, {
    nullable: true,
  })
  orderServiceDetail: OrderServiceDetail | null;

  @OneToMany(() => Transaction, (transaction) => transaction.order, {
    nullable: false,
  })
  transaction: Transaction[];
}
