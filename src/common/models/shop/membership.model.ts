import { Base } from '@/common/models/base.model';
import { Shop } from '@/common/models/shop/shop.model';
import { Subscription } from '@/common/models/shop/subscription.model';
import { Transaction } from '@/common/models/wallet';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

export enum MembershipStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Entity('memberships')
export class Membership extends Base {
  @ManyToOne(() => Shop, (shop) => shop.memberships, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'shop_id',
    foreignKeyConstraintName: 'fk_membership_shop',
  })
  @ApiProperty({
    description: 'Gói của shop',
    type: () => Shop,
  })
  shop: Shop;

  @ManyToOne(() => Subscription, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'subscription_id',
    foreignKeyConstraintName: 'fk_membership_subscription',
  })
  @ApiProperty({
    description: 'Gói đã đăng ký',
    type: () => Subscription,
  })
  subscription: Subscription;

  @OneToOne(() => Transaction, (transaction) => transaction.membership)
  @ApiProperty({
    description: 'Giao dịch của gói',
    type: () => Transaction,
  })
  transaction: Transaction;

  @Column({
    name: 'start_date',
    type: 'date',
    nullable: false,
    comment: 'Thời gian bắt đầu của gói',
  })
  @ApiProperty({
    type: 'string',
    format: 'date',
    nullable: false,
    description: 'Thời gian bắt đầu của gói',
    example: '2025-07-01',
  })
  startDate: Date;

  @Column({
    name: 'end_date',
    type: 'date',
    nullable: false,
    comment: 'Thời hạn hết hiệu lực của gói',
  })
  @ApiProperty({
    type: 'string',
    format: 'date',
    nullable: false,
    description: 'Thời hạn hết hiệu lực của gói',
    example: '2025-07-01',
  })
  endDate: Date;

  @Column({
    name: 'status',
    type: 'enum',
    enum: MembershipStatus,
    default: MembershipStatus.ACTIVE,
    nullable: false,
    comment: 'Trạng thái hoạt động của gói',
  })
  @ApiProperty({
    enum: MembershipStatus,
    description: 'Trạng thái hoạt động của gói',
    example: MembershipStatus.ACTIVE,
    enumName: 'MembershipStatus',
    nullable: false,
  })
  status: MembershipStatus;
}
