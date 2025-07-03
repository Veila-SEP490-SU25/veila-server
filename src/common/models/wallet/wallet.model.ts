import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Base, User } from '@/common/models';
import { ApiProperty } from '@nestjs/swagger';

@Entity('wallets')
export class Wallet extends Base {
  @ManyToOne(() => User, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'user_id',
    foreignKeyConstraintName: 'fk_user_wallet',
  })
  @ApiProperty({
    type: User,
    description: 'Chủ sở hữu ví',
  })
  user: User;

  @Column({
    name: 'available_balance',
    type: 'decimal',
    precision: 18,
    scale: 2,
    unsigned: true,
    nullable: false,
    default: 0,
    comment: 'Số dư khả dụng (có thể sử dụng) trong ví, đơn vị VNĐ',
  })
  @ApiProperty({
    type: 'number',
    format: 'decimal',
    nullable: false,
    description: 'Số dư khả dụng trong ví (VNĐ)',
    example: 1500000,
    minimum: 0,
    default: 0,
  })
  availableBalance: number;

  @Column({
    name: 'locked_balance',
    type: 'decimal',
    precision: 18,
    scale: 2,
    unsigned: true,
    nullable: false,
    default: 0,
    comment: 'Số dư đang bị khóa (không thể sử dụng), đơn vị VNĐ',
  })
  @ApiProperty({
    type: 'number',
    format: 'decimal',
    nullable: false,
    description: 'Số dư đang bị khóa trong ví (VNĐ)',
    example: 500000,
    minimum: 0,
    default: 0,
  })
  lockedBalance: number;
}
