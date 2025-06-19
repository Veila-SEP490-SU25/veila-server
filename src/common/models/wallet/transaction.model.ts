import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Base, Order, Wallet } from '../';
import { ApiProperty } from '@nestjs/swagger';

export enum TransactionType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfer',
  PAYMENT = 'payment',
  REFUND = 'refund',
  OTHER = 'other',
}
export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
  DISPUTED = 'disputed',
}
export enum TypeBalance {
  AVAILABLE = 'available',
  LOCKED = 'locked',
}

@Entity('transactions')
export class Transaction extends Base {
  @ManyToOne(() => Wallet, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'wallet_id',
    foreignKeyConstraintName: 'fk_wallet_transaction',
  })
  @ApiProperty({
    description: 'Ví thực hiện giao dịch',
    type: Wallet,
  })
  wallet: Wallet;

  @ManyToOne(() => Order, (order) => order.transaction, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({
    name: 'order_id',
    foreignKeyConstraintName: 'fk_order_transaction',
  })
  @ApiProperty({
    description: 'Đơn hàng liên quan (nếu có)',
    type: Order,
    nullable: true,
  })
  order: Order | null;

  @Column({
    name: 'from',
    type: 'varchar',
    length: 64,
    nullable: false,
    comment: 'Nguồn chuyển tiền (có thể là user, ví, hệ thống, v.v.)',
  })
  @ApiProperty({
    type: 'string',
    description: 'Nguồn chuyển tiền (user, ví, hệ thống, ...)',
    example: 'user_1',
    maxLength: 64,
    required: true,
  })
  from: string;

  @Column({
    name: 'to',
    type: 'varchar',
    length: 64,
    nullable: false,
    comment: 'Nơi nhận tiền (có thể là user, ví, hệ thống, v.v.)',
  })
  @ApiProperty({
    type: 'string',
    description: 'Nơi nhận tiền (user, ví, hệ thống, ...)',
    example: 'shop_2',
    maxLength: 64,
    required: true,
  })
  to: string;

  @Column({
    name: 'from_type_balance',
    type: 'enum',
    enum: TypeBalance,
    nullable: false,
    comment: 'Loại số dư nguồn chuyển (AVAILABLE/LOCKED)',
  })
  @ApiProperty({
    enum: TypeBalance,
    description: 'Loại số dư nguồn chuyển',
    example: TypeBalance.AVAILABLE,
    required: true,
  })
  fromTypeBalance: TypeBalance;

  @Column({
    name: 'to_type_balance',
    type: 'enum',
    enum: TypeBalance,
    nullable: false,
    comment: 'Loại số dư nơi nhận (AVAILABLE/LOCKED)',
  })
  @ApiProperty({
    enum: TypeBalance,
    description: 'Loại số dư nơi nhận',
    example: TypeBalance.AVAILABLE,
    required: true,
  })
  toTypeBalance: TypeBalance;

  @Column({
    name: 'amount',
    type: 'decimal',
    precision: 18,
    scale: 2,
    unsigned: true,
    nullable: false,
    comment: 'Số tiền giao dịch (VNĐ)',
  })
  @ApiProperty({
    type: 'number',
    format: 'decimal',
    description: 'Số tiền giao dịch (VNĐ)',
    example: 200000,
    minimum: 0,
    required: true,
  })
  amount: number;

  @Column({
    name: 'type',
    type: 'enum',
    enum: TransactionType,
    nullable: false,
    comment: 'Loại giao dịch',
  })
  @ApiProperty({
    enum: TransactionType,
    description: 'Loại giao dịch',
    example: TransactionType.PAYMENT,
    required: true,
  })
  type: TransactionType;

  @Column({
    name: 'status',
    type: 'enum',
    enum: TransactionStatus,
    nullable: false,
    default: TransactionStatus.PENDING,
    comment: 'Trạng thái giao dịch',
  })
  @ApiProperty({
    enum: TransactionStatus,
    description: 'Trạng thái giao dịch',
    example: TransactionStatus.PENDING,
    required: true,
    default: TransactionStatus.PENDING,
  })
  status: TransactionStatus;

  @Column({
    name: 'note',
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'Ghi chú giao dịch (nếu có)',
  })
  @ApiProperty({
    type: 'string',
    description: 'Ghi chú giao dịch (nếu có)',
    example: 'Hoàn tiền cho đơn hàng #123',
    maxLength: 255,
    required: false,
    nullable: true,
  })
  note?: string;
}
