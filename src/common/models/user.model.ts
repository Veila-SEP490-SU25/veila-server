import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export enum UserRole {
  Customer = 'customer',
  Supplier = 'supplier',
  SystemOperator = 'system_operator',
  Admin = 'admin',
  SuperAdmin = 'super_admin',
}

export enum UserStatus {
  Active = 'active',
  Inactive = 'inactive',
  Suspended = 'suspended',
  Deleted = 'deleted',
  Banned = 'banned',
}

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'ID của người dùng',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  @ApiProperty({
    description: 'Tên người dùng',
    example: 'john_doe',
  })
  username: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  @ApiProperty({
    description: 'Email của người dùng',
    example: 'john.doe@example.com',
  })
  email: string;

  @Column({ type: 'varchar', length: 100 })
  @Exclude()
  password: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
  })
  @ApiProperty({
    description: 'Tên của người dùng',
    example: 'John',
  })
  firstName: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
  })
  @ApiProperty({
    description: 'Tên giữa của người dùng',
    example: 'Doe',
  })
  middleName: string | null;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
  })
  @ApiProperty({
    description: 'Họ của người dùng',
    example: 'Doe',
  })
  lastName: string;

  @Column({ type: 'varchar', length: 12, nullable: true })
  @ApiProperty({
    description: 'Số điện thoại của người dùng',
    example: '0909090909',
  })
  phone: string | null;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
  })
  @ApiProperty({
    description: 'Địa chỉ của người dùng',
    example: '123 Main St, Anytown, USA',
  })
  address: string | null;

  @Column({ type: 'datetime', nullable: true, precision: 6 })
  @ApiProperty({
    description: 'Ngày sinh của người dùng',
    example: '1990-01-01',
  })
  birthDate: Date | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  @ApiProperty({
    description: 'URL ảnh đại diện của người dùng',
    example: 'https://example.com/avatar.jpg',
  })
  avatarUrl: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  @ApiProperty({
    description: 'URL ảnh bìa của người dùng',
    example: 'https://example.com/cover.jpg',
  })
  coverUrl: string | null;

  @Column({ type: 'boolean', default: false })
  @ApiProperty({
    description: 'Trạng thái xác thực của người dùng',
    example: false,
  })
  isVerified: boolean;

  @Column({ type: 'enum', default: UserRole.Customer, enum: UserRole })
  @ApiProperty({
    description: 'Vai trò của người dùng',
    example: UserRole.Customer,
  })
  role: UserRole;

  @Column({ type: 'enum', default: UserStatus.Active, enum: UserStatus })
  @ApiProperty({
    description: 'Trạng thái của người dùng',
    example: UserStatus.Active,
  })
  status: UserStatus;

  @CreateDateColumn()
  @ApiProperty({
    description: 'Ngày tạo của người dùng',
    example: '2021-01-01',
  })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({
    description: 'Ngày cập nhật của người dùng',
    example: '2021-01-01',
  })
  updatedAt: Date;
}
