import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Exclude } from 'class-transformer';
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import { Base, Contract, Shop, Wallet } from '@/common/models';

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
  SHOP = 'SHOP',
  CUSTOMER = 'CUSTOMER',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  BANNED = 'BANNED',
}

@Entity('users')
export class User extends Base {
  @Column({
    name: 'username',
    type: 'varchar',
    length: 32,
    unique: true,
    nullable: false,
    comment: 'Tên người dùng, chỉ cho phép chữ cái, số và dấu gạch dưới',
  })
  @ApiProperty({
    type: 'string',
    minLength: 6,
    maxLength: 32,
    nullable: false,
    description: 'Tên người dùng (6-32 ký tự, chỉ cho phép chữ cái, số và dấu gạch dưới)',
    example: 'johndoe123',
  })
  username: string;

  @Column({
    name: 'email',
    type: 'varchar',
    length: 64,
    unique: true,
    nullable: false,
    comment: 'Email của người dùng, định dạng chuẩn email',
  })
  @ApiProperty({
    type: 'string',
    format: 'email',
    maxLength: 64,
    nullable: false,
    description: 'Email của người dùng (tối đa 64 ký tự)',
    example: 'john.doe@example.com',
  })
  email: string;

  @Column({
    name: 'password',
    type: 'varchar',
    length: 72,
    nullable: false,
    comment: 'Mật khẩu đã được mã hóa bằng bcrypt (72 ký tự)',
  })
  @Exclude()
  @ApiHideProperty()
  password: string;

  @Column({
    name: 'first_name',
    type: 'varchar',
    length: 30,
    nullable: false,
    comment: 'Tên của người dùng',
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
  })
  @ApiProperty({
    type: 'string',
    maxLength: 30,
    nullable: false,
    description: 'Tên của người dùng (tối đa 30 ký tự)',
    example: 'John',
  })
  firstName: string;

  @Column({
    name: 'middle_name',
    type: 'varchar',
    length: 30,
    nullable: true,
    comment: 'Tên đệm của người dùng',
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
  })
  @ApiProperty({
    type: 'string',
    maxLength: 30,
    nullable: true,
    description: 'Tên đệm của người dùng (tối đa 30 ký tự)',
    example: 'William',
  })
  middleName: string | null;

  @Column({
    name: 'last_name',
    type: 'varchar',
    length: 30,
    nullable: false,
    comment: 'Họ của người dùng',
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
  })
  @ApiProperty({
    type: 'string',
    maxLength: 30,
    nullable: false,
    description: 'Họ của người dùng (tối đa 30 ký tự)',
    example: 'Doe',
  })
  lastName: string;

  @Column({
    name: 'phone',
    type: 'varchar',
    length: 15,
    nullable: true,
    unique: true,
    comment: 'Số điện thoại của người dùng',
  })
  @ApiProperty({
    type: 'string',
    maxLength: 15,
    nullable: true,
    description: 'Số điện thoại của người dùng',
    example: '0901234567',
  })
  phone: string | null;

  @Column({
    name: 'address',
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'Địa chỉ của người dùng',
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
  })
  @ApiProperty({
    type: 'string',
    maxLength: 255,
    nullable: true,
    description: 'Địa chỉ của người dùng (tối đa 255 ký tự)',
    example: '123 Đường Nguyễn Huệ, Quận 1, TP.HCM',
  })
  address: string | null;

  @Column({
    name: 'birth_date',
    type: 'date',
    nullable: true,
    comment: 'Ngày sinh của người dùng (YYYY-MM-DD)',
  })
  @ApiProperty({
    type: 'string',
    format: 'date',
    nullable: true,
    description: 'Ngày sinh của người dùng (định dạng YYYY-MM-DD)',
    example: '1990-01-01',
  })
  birthDate: Date | null;

  @Column({
    name: 'avatar_url',
    type: 'varchar',
    length: 512,
    nullable: true,
    comment: 'URL ảnh đại diện của người dùng',
  })
  @ApiProperty({
    type: 'string',
    format: 'uri',
    maxLength: 512,
    nullable: true,
    description: 'URL ảnh đại diện của người dùng (tối đa 512 ký tự)',
    example: 'https://example.com/avatars/user123.jpg',
  })
  avatarUrl: string | null;

  @Column({
    name: 'cover_url',
    type: 'varchar',
    length: 512,
    nullable: true,
    comment: 'URL ảnh bìa của người dùng',
  })
  @ApiProperty({
    type: 'string',
    format: 'uri',
    maxLength: 512,
    nullable: true,
    description: 'URL ảnh bìa của người dùng (tối đa 512 ký tự)',
    example: 'https://example.com/covers/user123.jpg',
  })
  coverUrl: string | null;

  @Column({
    name: 'role',
    type: 'enum',
    enum: UserRole,
    default: UserRole.CUSTOMER,
    nullable: false,
    comment: 'Vai trò của người dùng trong hệ thống (SUPER_ADMIN/ADMIN/STAFF/SHOP/CUSTOMER)',
  })
  @ApiProperty({
    enum: UserRole,
    enumName: 'UserRole',
    nullable: false,
    description: 'Vai trò của người dùng',
    example: UserRole.CUSTOMER,
  })
  role: UserRole;

  @Column({
    name: 'status',
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
    nullable: false,
    comment: 'Trạng thái tài khoản (ACTIVE/INACTIVE/SUSPENDED/BANNED)',
  })
  @ApiProperty({
    enum: UserStatus,
    enumName: 'UserStatus',
    nullable: false,
    description: 'Trạng thái của người dùng',
    example: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @Column({
    name: 'reputation',
    type: 'int',
    default: 100,
    nullable: false,
    comment: 'Điểm uy tín của user (0-100)',
  })
  @ApiProperty({
    type: 'integer',
    description: 'Điểm uy tín của user (0-100)',
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
    comment: 'Đánh dấu người dùng đã xác thực email hay chưa',
  })
  @ApiProperty({
    type: 'boolean',
    nullable: false,
    description: 'Trạng thái xác thực email của người dùng',
    example: false,
  })
  isVerified: boolean;

  @Column({
    name: 'is_identified',
    type: 'boolean',
    default: false,
    nullable: false,
    comment: 'Đánh dấu người dùng đã xác thực danh tính (SDT) hay chưa',
  })
  @ApiProperty({
    type: 'boolean',
    nullable: false,
    description: 'Trạng thái xác thực danh tính của người dùng (SDT)',
    example: false,
  })
  isIdentified: boolean;

  @OneToOne(() => Shop, (shop) => shop.user, {
    nullable: true,
  })
  shop: Shop | null;

  @ManyToOne(() => Contract, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'contract_id',
    foreignKeyConstraintName: 'fk_user_contract',
  })
  contract: Contract;

  @OneToOne(() => Wallet, (wallet) => wallet.user, {
    nullable: true,
    cascade: true,
  })
  wallet: Wallet | null;
}
