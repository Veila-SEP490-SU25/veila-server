import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Bank, Base, User } from '../';
import { ApiProperty } from '@nestjs/swagger';

@Entity('payment_infos')
export class PaymentInfo extends Base {
  @ManyToOne(() => User, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'user_id',
    foreignKeyConstraintName: 'fk_payment_info_user',
  })
  @ApiProperty({
    description: 'Người dùng sở hữu thông tin thanh toán',
    type: User,
  })
  user: User;

  @ManyToOne(() => Bank, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'bank_id',
    foreignKeyConstraintName: 'fk_payment_info_bank',
  })
  @ApiProperty({
    description: 'Ngân hàng hoặc ví điện tử liên kết với thông tin thanh toán',
    type: Bank,
  })
  bank: Bank;

  @Column({
    name: 'account_number',
    type: 'varchar',
    length: 50,
    nullable: false,
    comment: 'Số tài khoản ngân hàng hoặc ví điện tử',
    unique: true,
  })
  @ApiProperty({
    type: 'string',
    description: 'Số tài khoản ngân hàng hoặc ví điện tử',
    example: '1234567890',
    maxLength: 50,
    nullable: false,
  })
  accountNumber: string;

  @Column({
    name: 'account_name',
    type: 'varchar',
    length: 100,
    nullable: false,
    comment: 'Tên chủ tài khoản ngân hàng hoặc ví điện tử',
  })
  @ApiProperty({
    type: 'string',
    description: 'Tên chủ tài khoản ngân hàng hoặc ví điện tử',
    example: 'Nguyen Van A',
    maxLength: 100,
    nullable: false,
  })
  accountName: string;
}
