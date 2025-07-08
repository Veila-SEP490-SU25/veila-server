import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Base, Shop } from '@/common/models';
import { ApiProperty } from '@nestjs/swagger';

@Entity('contracts')
export class Contract extends Base {
  @ManyToOne(() => Shop, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'shop_id',
    foreignKeyConstraintName: 'fk_contract_shop',
  })
  @ApiProperty({
    description: 'Cửa hàng liên quan đến điều khoản ký',
    type: Shop,
  })
  shop: Shop;

  @Column({
    name: 'title',
    type: 'varchar',
    length: 255,
    nullable: false,
    comment: 'Tiêu đề của điều khoản',
  })
  @ApiProperty({
    type: 'string',
    description: 'Tiêu đề của điều khoản',
    example: 'Điều khoản chấp nhận các hình phạt từ nền tảng',
    maxLength: 255,
    nullable: false,
  })
  title: string;

  @Column({
    name: 'content',
    type: 'text',
    nullable: false,
    comment: 'Nội dung chi tiết của điều khoản',
  })
  @ApiProperty({
    type: 'string',
    format: 'text',
    description: 'Nội dung chi tiết của điều khoản',
    example:
      'Chúng tôi cam kết nếu có các hành vi sai phạm ảnh hưởng đến khách hàng sẽ chịu số tiền phạt theo điều khoản.',
    nullable: false,
  })
  content: string;

  @Column({
    name: 'is_signed',
    type: 'boolean',
    default: false,
    nullable: false,
    comment: 'Xác định xem điều khoản người dùng ký xác nhận hay chưa',
  })
  @ApiProperty({
    type: 'boolean',
    description: 'Xác định xem điều khoản người dùng đã ký xác nhận hay chưa',
    example: true,
    nullable: false,
  })
  isSigned: boolean;
}
