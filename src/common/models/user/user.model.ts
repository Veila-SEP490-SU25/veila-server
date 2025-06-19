import { Column, Entity, Index, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import { Base } from '@/common/models/base.model';

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
    description: 'Tên người dùng (6-32 ký tự, chỉ cho phép chữ cái, số và dấu gạch dưới)',
    example: 'johndoe123',
    minLength: 6,
    maxLength: 32,
    pattern: '^[a-zA-Z0-9_]+$',
    nullable: false,
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
    description: 'Email của người dùng (tối đa 64 ký tự)',
    example: 'john.doe@example.com',
    maxLength: 64,
    nullable: false,
  })
  email: string;

  @Column({
    name: 'password',
    type: 'varchar',
    length: 72,
    nullable: false,
    select: false,
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
  })
  @ApiProperty({
    type: 'string',
    description: 'Tên của người dùng (tối đa 30 ký tự)',
    example: 'John',
    maxLength: 30,
    nullable: false,
  })
  firstName: string;

  @Column({
    name: 'middle_name',
    type: 'varchar',
    length: 30,
    nullable: true,
    comment: 'Tên đệm của người dùng',
  })
  @ApiProperty({
    type: 'string',
    description: 'Tên đệm của người dùng (tối đa 30 ký tự)',
    example: 'William',
    maxLength: 30,
    nullable: true,
  })
  middleName: string | null;

  @Column({
    name: 'last_name',
    type: 'varchar',
    length: 30,
    nullable: false,
    comment: 'Họ của người dùng',
  })
  @ApiProperty({
    type: 'string',
    description: 'Họ của người dùng (tối đa 30 ký tự)',
    example: 'Doe',
    maxLength: 30,
    nullable: false,
  })
  lastName: string;

  @Column({
    name: 'phone',
    type: 'varchar',
    length: 15,
    nullable: true,
    comment: 'Số điện thoại của người dùng (định dạng E.164)',
  })
  @ApiProperty({
    type: 'string',
    description: 'Số điện thoại của người dùng (định dạng E.164, tối đa 15 ký tự)',
    example: '+84901234567',
    pattern: '^\+[1-9]\d{1,14}$',
    maxLength: 15,
    nullable: true,
  })
  phone: string | null;

  @Column({
    name: 'address',
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'Địa chỉ của người dùng',
  })
  @ApiProperty({
    type: 'string',
    description: 'Địa chỉ của người dùng (tối đa 255 ký tự)',
    example: '123 Đường Nguyễn Huệ, Quận 1, TP.HCM',
    maxLength: 255,
    nullable: true,
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
    description: 'Ngày sinh của người dùng (định dạng YYYY-MM-DD)',
    example: '1990-01-01',
    nullable: true,
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
    description: 'URL ảnh đại diện của người dùng (tối đa 512 ký tự)',
    example: 'https://example.com/avatars/user123.jpg',
    maxLength: 512,
    nullable: true,
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
    description: 'URL ảnh bìa của người dùng (tối đa 512 ký tự)',
    example: 'https://example.com/covers/user123.jpg',
    maxLength: 512,
    nullable: true,
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
    description: 'Vai trò của người dùng',
    example: UserRole.CUSTOMER,
    enumName: 'UserRole',
    nullable: false,
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
    description: 'Trạng thái của người dùng',
    example: UserStatus.ACTIVE,
    enumName: 'UserStatus',
    nullable: false,
  })
  status: UserStatus;

  @Column({
    name: 'is_verified',
    type: 'boolean',
    default: false,
    nullable: false,
    comment: 'Đánh dấu người dùng đã xác thực email hay chưa',
  })
  @ApiProperty({
    type: 'boolean',
    description: 'Trạng thái xác thực email của người dùng',
    example: false,
    nullable: false,
  })
  isVerified: boolean;

  @Column({
    name: 'is_identified',
    type: 'boolean',
    default: false,
    nullable: false,
    comment: 'Đánh dấu người dùng đã xác thực danh tính (CCCD/CMND) hay chưa',
  })
  @ApiProperty({
    type: 'boolean',
    description: 'Trạng thái xác thực danh tính của người dùng (CCCD/CMND)',
    example: false,
    nullable: false,
  })
  isIdentified: boolean;
}
