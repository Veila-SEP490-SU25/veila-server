import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true})
  username: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 100 })
  password: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
  })
  firstName: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
  })
  middleName: string | null;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
  })
  lastName: string;

  @Column({ type: 'varchar', length: 12, nullable: true })
  phone: string | null;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
  })
  address: string | null;

  @Column({ type: 'datetime', nullable: true, precision: 6 })
  birthDate: Date | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  avatarUrl: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  coverUrl: string | null;

  @Column({ type: 'boolean', default: false })
  isVerified: boolean;

  @Column({ type: 'enum', default: UserRole.Customer, enum: UserRole })
  role: UserRole;

  @Column({ type: 'enum', default: UserStatus.Active, enum: UserStatus })
  status: UserStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
