import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Base, User } from '@/common/models';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

@Entity('wallets')
export class Wallet extends Base {
  @OneToOne(() => User, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'user_id',
    foreignKeyConstraintName: 'fk_user_wallet',
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

  @Column({
    type: 'varchar',
    length: 6,
    nullable: true,
  })
  @ApiProperty({
    type: 'string',
    nullable: true,
    description: 'Mã BIN định danh ngân hàng',
  })
  bin: string | null;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  @ApiProperty({
    type: 'string',
    nullable: true,
    description: 'Số tài khoản ngân hàng',
  })
  bankNumber: string | null;

  @Column({
    type: 'varchar',
    length: 72,
    nullable: true,
    comment: 'Mật khẩu đã được mã hóa bằng bcrypt (72 ký tự)',
  })
  @Exclude()
  @ApiHideProperty()
  pin: string | null;
}
