import { Column, Entity, OneToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Base, Shop } from '@/common/models';

export enum LicenseStatus {
  PENDING = 'PENDING', // Đang chờ duyệt
  APPROVED = 'APPROVED', // Đã duyệt
  REJECTED = 'REJECTED', // Bị từ chối
  RESUBMIT = 'RESUBMIT', // Yêu cầu gửi lại
}

@Entity('licenses')
export class License extends Base {
  @OneToOne(() => Shop, (shop) => shop.license, {
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
