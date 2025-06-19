import { Column, Entity, Index, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Base, IdentifierImage, User } from '../';

export enum IdentifierType {
  CCCD = 'CCCD',
  PASSPORT = 'PASSPORT',
  DRIVER_LICENSE = 'DRIVER_LICENSE',
  BUSINESS_LICENSE = 'BUSINESS_LICENSE', // Cho tài khoản shop
  OTHER = 'OTHER',
}

export enum IdentifierStatus {
  PENDING = 'PENDING', // Đang chờ xác thực
  APPROVED = 'APPROVED', // Đã xác thực thành công
  REJECTED = 'REJECTED', // Bị từ chối
  EXPIRED = 'EXPIRED', // Hết hạn
  SUSPENDED = 'SUSPENDED', // Tạm khóa
  RESUBMIT = 'RESUBMIT', // Yêu cầu gửi lại
}

@Entity('identifiers')
export class Identifier extends Base {
  @ManyToOne(() => User, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'user_id',
    foreignKeyConstraintName: 'fk_identifier_user',
  })
  @ApiProperty({
    description: 'Thông tin người dùng sở hữu giấy tờ',
    type: User,
  })
  user: User;

  @Column({
    name: 'identifier_type',
    type: 'enum',
    enum: IdentifierType,
    nullable: false,
    comment: 'Loại giấy tờ tùy thân',
  })
  @ApiProperty({
    enum: IdentifierType,
    description: 'Loại giấy tờ tùy thân',
    example: IdentifierType.CCCD,
    enumName: 'IdentifierType',
  })
  identifierType: IdentifierType;

  @Column({
    name: 'status',
    type: 'enum',
    enum: IdentifierStatus,
    default: IdentifierStatus.PENDING,
    nullable: false,
    comment: 'Trạng thái xác thực của giấy tờ',
  })
  @ApiProperty({
    enum: IdentifierStatus,
    description: 'Trạng thái xác thực của giấy tờ',
    example: IdentifierStatus.PENDING,
    enumName: 'IdentifierStatus',
  })
  status: IdentifierStatus;

  @Column({
    name: 'reject_reason',
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'Lý do từ chối xác thực (nếu có)',
  })
  @ApiProperty({
    type: 'string',
    description: 'Lý do từ chối xác thực (nếu có)',
    example: 'Hình ảnh mờ, không rõ nét',
    maxLength: 255,
    nullable: true,
  })
  rejectReason: string | null;

  @OneToMany(() => IdentifierImage, (identifierImage) => identifierImage.identifier)
  @ApiProperty({
    type: [IdentifierImage],
    description: 'Danh sách hình ảnh giấy tờ tùy thân',
  })
  identifierImage: IdentifierImage[];
}
