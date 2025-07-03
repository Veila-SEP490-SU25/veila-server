import { Column, Entity, OneToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Base, Shop } from '@/common/models';

export enum LicenseStatus {
  PENDING = 'PENDING', // Đang chờ duyệt
  APPROVED = 'APPROVED', // Đã duyệt
  REJECTED = 'REJECTED', // Bị từ chối
  EXPIRED = 'EXPIRED', // Hết hạn
  SUSPENDED = 'SUSPENDED', // Tạm ngưng
  RESUBMIT = 'RESUBMIT', // Yêu cầu gửi lại
}

@Entity('licenses')
export class License extends Base {
  @OneToOne(() => Shop, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'shop_id',
    foreignKeyConstraintName: 'fk_license_shop',
  })
  @ApiProperty({
    description: 'Shop sở hữu giấy phép',
    type: () => Shop,
  })
  shop: Shop;

  @Column({
    name: 'license_number',
    type: 'varchar',
    length: 50,
    nullable: false,
    comment: 'Số giấy phép kinh doanh',
  })
  @ApiProperty({
    type: 'string',
    description: 'Số giấy phép kinh doanh',
    example: 'GP-KD-123456789',
    maxLength: 50,
    nullable: false,
  })
  licenseNumber: string;

  @Column({
    name: 'title',
    type: 'varchar',
    length: 200,
    nullable: false,
    comment: 'Tên giấy phép',
  })
  @ApiProperty({
    type: 'string',
    description: 'Tên giấy phép',
    example: 'Giấy phép đăng ký kinh doanh',
    maxLength: 200,
    nullable: false,
  })
  title: string;

  @Column({
    name: 'description',
    type: 'text',
    nullable: true,
    comment: 'Mô tả giấy phép',
  })
  @ApiProperty({
    type: 'string',
    format: 'text',
    description: 'Mô tả giấy phép',
    example: 'Giấy phép kinh doanh cho cửa hàng thời trang',
    nullable: true,
  })
  description: string | null;

  @Column({
    name: 'status',
    type: 'enum',
    enum: LicenseStatus,
    default: LicenseStatus.PENDING,
    nullable: false,
    comment: 'Trạng thái giấy phép',
  })
  @ApiProperty({
    enum: LicenseStatus,
    description: 'Trạng thái giấy phép',
    example: LicenseStatus.PENDING,
    enumName: 'LicenseStatus',
    nullable: false,
  })
  status: LicenseStatus;

  @Column({
    name: 'reject_reason',
    type: 'varchar',
    length: 500,
    nullable: true,
    comment: 'Lý do từ chối (nếu có)',
  })
  @ApiProperty({
    type: 'string',
    description: 'Lý do từ chối (nếu có)',
    example: 'Giấy phép không rõ ràng, cần chụp lại',
    maxLength: 500,
    nullable: true,
  })
  rejectReason: string | null;
}
