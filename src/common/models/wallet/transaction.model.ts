import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Base, Membership, Order, Wallet } from '@/common/models';
import { ApiProperty } from '@nestjs/swagger';

export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAW = 'WITHDRAW',
  TRANSFER = 'TRANSFER',
  RECEIVE = 'RECEIVE',
  REFUND = 'REFUND',
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

export enum TypeBalance {
  AVAILABLE = 'AVAILABLE',
  LOCKED = 'LOCKED',
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
  wallet: Wallet;

  @ManyToOne(() => Order, (order) => order.transaction, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({
    name: 'order_id',
    foreignKeyConstraintName: 'fk_order_transaction',
  })
  order: Order | null;

  @OneToOne(() => Membership, (membership) => membership.transaction, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({
    name: 'membership_id',
    foreignKeyConstraintName: 'fk_membership_transaction',
  })
  membership: Membership | null;

  @Column({
    name: 'from',
    type: 'varchar',
    length: 64,
    nullable: false,
    comment: 'Nguồn chuyển tiền (có thể là user, ví, hệ thống, v.v.)',
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
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
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
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
    example: TransactionType.TRANSFER,
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
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
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

  @Column({
    name: 'available_balance_snapshot',
    type: 'decimal',
    precision: 18,
    scale: 2,
    unsigned: true,
    nullable: false,
    comment: 'Số dư khả dụng của ví tại thời điểm giao dịch',
  })
  @ApiProperty({
    type: 'number',
    format: 'decimal',
    description: 'Số dư khả dụng ví tại thời điểm giao dịch',
    example: 1200000,
    minimum: 0,
    required: true,
  })
  availableBalanceSnapshot: number;

  @Column({
    name: 'locked_balance_snapshot',
    type: 'decimal',
    precision: 18,
    scale: 2,
    unsigned: true,
    nullable: false,
    comment: 'Số dư bị khóa của ví tại thời điểm giao dịch',
  })
  @ApiProperty({
    type: 'number',
    format: 'decimal',
    description: 'Số dư bị khóa ví tại thời điểm giao dịch',
    example: 300000,
    minimum: 0,
    required: true,
  })
  lockedBalanceSnapshot: number;
}
