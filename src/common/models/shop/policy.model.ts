import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Base, PolicyImage, Shop } from '@/common/models';
import { ApiProperty } from '@nestjs/swagger';

@Entity('policies')
export class Policy extends Base {
  @ManyToOne(() => Shop, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'shop_id',
    foreignKeyConstraintName: 'fk_policy_shop',
  })
  @ApiProperty({
    description: 'Cửa hàng liên quan đến chính sách',
    type: Shop,
  })
  shop: Shop;

  @Column({
    name: 'title',
    type: 'varchar',
    length: 255,
    nullable: false,
    comment: 'Tiêu đề của chính sách',
  })
  @ApiProperty({
    type: 'string',
    description: 'Tiêu đề của chính sách',
    example: 'Chính sách bảo hành sản phẩm',
    maxLength: 255,
    nullable: false,
  })
  title: string;

  @Column({
    name: 'content',
    type: 'text',
    nullable: false,
    comment: 'Nội dung chi tiết của chính sách',
  })
  @ApiProperty({
    type: 'string',
    format: 'text',
    description: 'Nội dung chi tiết của chính sách',
    example: 'Chúng tôi cam kết bảo hành sản phẩm trong vòng 12 tháng kể từ ngày mua.',
    nullable: false,
  })
  content: string;

  @Column({
    name: 'is_signed',
    type: 'boolean',
    default: false,
    nullable: false,
    comment: 'Xác định xem chính sách người dùng ký xác nhận hay chưa',
  })
  @ApiProperty({
    type: 'boolean',
    description: 'Xác định xem chính sách người dùng đã ký xác nhận hay chưa',
    example: true,
    nullable: false,
  })
  isSigned: boolean;

  @OneToMany(() => PolicyImage, (policyImage) => policyImage.policy, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @ApiProperty({
    description: 'Danh sách hình ảnh liên quan đến chính sách',
    type: PolicyImage,
  })
  policyImages: PolicyImage[];
}
