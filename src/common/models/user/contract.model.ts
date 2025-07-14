import { Column, Entity } from 'typeorm';
import { Base } from '@/common/models';
import { ApiProperty } from '@nestjs/swagger';

export enum ContractType {
  SHOP = 'SHOP',
  CUSTOMER = 'CUSTOMER',
}

export enum ContractStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DRAFT = 'DRAFT',
}

@Entity('contracts')
export class Contract extends Base {
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
    name: 'contract_type',
    type: 'enum',
    enum: ContractType,
    nullable: false,
    comment: 'Loại hợp đồng (SHOP hoặc CUSTOMER)',
  })
  @ApiProperty({
    type: 'string',
    enum: ContractType,
    description: 'Loại hợp đồng (SHOP hoặc CUSTOMER',
    example: ContractType.SHOP,
    nullable: false,
  })
  contractType: ContractType;

  @Column({
    name: 'version',
    type: 'int',
    nullable: false,
    unique: true,
    default: 1,
    comment: 'Phiên bản của điều khoản',
  })
  @ApiProperty({
    type: 'integer',
    description: 'Phiên bản của điều khoản',
    example: 1,
    minimum: 1,
    nullable: false,
  })
  version: number;

  @Column({
    name: 'effective_from',
    type: 'timestamp',
    nullable: false,
    comment: 'Ngày bắt đầu hiệu lực của điều khoản',
  })
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    description: 'Ngày bắt đầu hiệu lực của điều khoản',
    example: '2023-10-01T12:00:00Z',
    nullable: false,
  })
  effectiveFrom: Date;

  @Column({
    name: 'status',
    type: 'enum',
    enum: ContractStatus,
    default: ContractStatus.DRAFT,
    nullable: false,
    comment: 'Trạng thái của điều khoản (ACTIVE, INACTIVE, DRAFT)',
  })
  @ApiProperty({
    type: 'string',
    enum: ContractStatus,
    description: 'Trạng thái của điều khoản (ACTIVE, INACTIVE, DRAFT)',
    example: ContractStatus.ACTIVE,
    enumName: 'ContractStatus',
    nullable: false,
  })
  status: ContractStatus;
}
