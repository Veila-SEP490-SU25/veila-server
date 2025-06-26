import { Column, Entity } from 'typeorm';
import { Base } from '@/common/models';
import { ApiProperty } from '@nestjs/swagger';

@Entity('banks')
export class Bank extends Base {
  @Column({
    name: 'name',
    type: 'varchar',
    length: 100,
    nullable: false,
    comment: 'Tên ngân hàng',
  })
  @ApiProperty({
    type: 'string',
    description: 'Tên ngân hàng',
    example: 'Ngân hàng TMCP Ngoại thương Việt Nam (Vietcombank)',
    maxLength: 100,
    nullable: false,
  })
  name: string;

  @Column({
    name: 'short_name',
    type: 'varchar',
    length: 50,
    nullable: false,
    comment: 'Tên viết tắt của ngân hàng',
  })
  @ApiProperty({
    type: 'string',
    description: 'Tên viết tắt của ngân hàng',
    example: 'Vietcombank',
    maxLength: 50,
    nullable: false,
  })
  shortName: string;

  @Column({
    name: 'bin',
    type: 'varchar',
    length: 20,
    nullable: false,
    comment: 'Mã BIN của ngân hàng',
  })
  @ApiProperty({
    type: 'string',
    description: 'Mã BIN của ngân hàng',
    example: '123456',
    maxLength: 20,
    nullable: false,
  })
  bin: string;

  @Column({
    name: 'logo_url',
    type: 'varchar',
    length: 512,
    nullable: false,
    comment: 'Đường dẫn URL của logo ngân hàng',
  })
  @ApiProperty({
    type: 'string',
    format: 'uri',
    description: 'Đường dẫn URL của logo ngân hàng (tối đa 512 ký tự)',
    example: 'https://storage.veila.com/images/banks/vietcombank/logo.png',
    maxLength: 512,
    nullable: false,
  })
  logoUrl: string;

  @Column({
    name: 'transfer_support',
    type: 'boolean',
    default: true,
    nullable: false,
    comment: 'Hỗ trợ chuyển khoản ngân hàng',
  })
  @ApiProperty({
    type: 'boolean',
    description: 'Hỗ trợ chuyển khoản ngân hàng',
    example: true,
    nullable: false,
  })
  transferSupport: boolean;

  @Column({
    name: 'lookup_support',
    type: 'boolean',
    default: true,
    nullable: false,
    comment: 'Hỗ trợ tra cứu thông tin giao dịch',
  })
  @ApiProperty({
    type: 'boolean',
    description: 'Hỗ trợ tra cứu thông tin giao dịch',
    example: true,
    nullable: false,
  })
  lookupSupport: boolean;
}
