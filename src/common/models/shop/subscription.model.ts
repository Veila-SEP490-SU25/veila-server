import { Base } from '@/common/models/base.model';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';

@Entity('subscriptions')
export class Subscription extends Base {
  @Column({
    name: 'name',
    type: 'varchar',
    length: 100,
    nullable: false,
    comment: 'Tiêu đề của gói thành viên',
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
  })
  @ApiProperty({
    type: 'string',
    description: 'Tiêu đề của gói thành viên (tối đa 100 ký tự)',
    example: 'Gói thành viên 1 năm Ultimate',
    maxLength: 100,
    nullable: false,
  })
  name: string;

  @Column({
    name: 'description',
    type: 'text',
    nullable: false,
    comment: 'Mô tả chi tiết gói',
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
  })
  @ApiProperty({
    type: 'string',
    description: 'Mô tả chi tiết của gói',
    example: 'Gói cung cấp dịch vụ 1 năm, tiết kiệm 20% chi phí theo tháng',
    nullable: false,
  })
  description: string;

  @Column({
    name: 'duration',
    type: 'int',
    unsigned: true,
    default: 30,
    nullable: false,
    comment: 'Thời gian hiệu lực của gói tính bằng ngày',
  })
  @ApiProperty({
    type: 'string',
    description: 'Thời gian hiệu lực của gói',
    example: '365 ngày',
    nullable: false,
  })
  duration: number;

  @Column({
    name: 'amount',
    type: 'decimal',
    precision: 10,
    scale: 2,
    unsigned: true,
    nullable: false,
    default: 0.0,
    comment: 'Giá bán của gói',
  })
  @ApiProperty({
    type: 'number',
    format: 'float',
    description: 'Giá bán của gói',
    example: 199.99,
    minimum: 0.0,
    default: 0.0,
    nullable: false,
  })
  amount: number;
}
