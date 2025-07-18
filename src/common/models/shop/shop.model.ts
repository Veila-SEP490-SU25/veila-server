import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Base, Contract, License, Membership, User } from '@/common/models';

export enum ShopStatus {
  PENDING = 'PENDING', // Đang chờ duyệt
  ACTIVE = 'ACTIVE', // Đang hoạt động
  INACTIVE = 'INACTIVE', // Tạm ngưng hoạt động (do chủ shop)
  SUSPENDED = 'SUSPENDED', // Tạm ngưng (do admin)
  BANNED = 'BANNED', // Bị cấm hoạt động
}

@Entity('shops')
export class Shop extends Base {
  @OneToOne(() => User, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'user_id',
    foreignKeyConstraintName: 'fk_shop_user',
  })
  @ApiProperty({
    description: 'Thông tin chủ sở hữu shop',
    type: () => User,
  })
  user: User;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 100,
    nullable: false,
    comment: 'Tên shop',
  })
  @ApiProperty({
    type: 'string',
    description: 'Tên shop',
    example: 'Cửa hàng thời trang ABC',
    maxLength: 100,
    nullable: false,
  })
  name: string;

  @Column({
    name: 'phone',
    type: 'varchar',
    length: 15,
    nullable: false,
    comment: 'Số điện thoại liên hệ',
  })
  @ApiProperty({
    type: 'string',
    description: 'Số điện thoại liên hệ của shop',
    example: '+84901234567',
    maxLength: 15,
    nullable: false,
  })
  phone: string;

  @Column({
    name: 'email',
    type: 'varchar',
    length: 64,
    nullable: false,
    comment: 'Email liên hệ',
  })
  @ApiProperty({
    type: 'string',
    format: 'email',
    description: 'Email liên hệ của shop',
    example: 'shop@example.com',
    maxLength: 64,
    nullable: false,
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
    description: 'Địa chỉ chi tiết của shop',
    example: '123 Đường ABC, Phường XYZ, Quận 1, TP.HCM',
    maxLength: 255,
    nullable: false,
  })
  address: string;

  @Column({
    name: 'description',
    type: 'text',
    nullable: true,
    comment: 'Mô tả về shop',
  })
  @ApiProperty({
    type: 'string',
    format: 'text',
    description: 'Mô tả chi tiết về shop',
    example: 'Shop chuyên cung cấp các sản phẩm thời trang...',
    nullable: true,
  })
  description: string | null;

  @Column({
    name: 'logo_url',
    type: 'varchar',
    length: 512,
    nullable: true,
    comment: 'URL logo của shop',
  })
  @ApiProperty({
    type: 'string',
    format: 'uri',
    description: 'URL logo của shop',
    example: 'https://storage.veila.com/shops/logo123.jpg',
    maxLength: 512,
    nullable: true,
  })
  logoUrl: string | null;

  @Column({
    name: 'cover_url',
    type: 'varchar',
    length: 512,
    nullable: true,
    comment: 'URL ảnh bìa của shop',
  })
  @ApiProperty({
    type: 'string',
    format: 'uri',
    description: 'URL ảnh bìa của shop',
    example: 'https://storage.veila.com/shops/cover123.jpg',
    maxLength: 512,
    nullable: true,
  })
  coverUrl: string | null;

  @Column({
    name: 'status',
    type: 'enum',
    enum: ShopStatus,
    default: ShopStatus.PENDING,
    nullable: false,
    comment: 'Trạng thái hoạt động của shop',
  })
  @ApiProperty({
    enum: ShopStatus,
    description: 'Trạng thái hoạt động của shop',
    example: ShopStatus.ACTIVE,
    enumName: 'ShopStatus',
    nullable: false,
  })
  status: ShopStatus;

  @Column({
    name: 'reputation',
    type: 'int',
    default: 100,
    nullable: false,
    comment: 'Điểm uy tín của shop (0-100)',
  })
  @ApiProperty({
    type: 'integer',
    description: 'Điểm uy tín của shop (0-100)',
    example: 85,
    minimum: 0,
    maximum: 100,
    nullable: false,
  })
  reputation: number;

  @Column({
    name: 'is_verified',
    type: 'boolean',
    default: false,
    nullable: false,
    comment: 'Trạng thái xác thực shop (đã xác minh giấy phép kinh doanh và ký kết điều khoản)',
  })
  @ApiProperty({
    type: 'boolean',
    default: false,
    description: 'Trạng thái xác thực shop',
    example: false,
    nullable: false,
  })
  isVerified: boolean;

  @OneToMany(() => Membership, (membership) => membership.shop)
  @ApiProperty({
    type: [Membership],
  })
  memberships: [Membership];

  @OneToOne(() => License, (license) => license.shop, {
    nullable: true,
  })
  @ApiProperty({
    type: () => License,
    description: 'Giấy phép kinh doanh của shop',
  })
  license: License | null;

  @OneToOne(() => Contract, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'contract_id',
    foreignKeyConstraintName: 'fk_shop_contract',
  })
  @ApiProperty({
    type: Contract,
    description: 'Hợp đồng liên quan đến shop',
  })
  contract: Contract;
}
