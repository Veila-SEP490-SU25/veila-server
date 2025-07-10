import { Base } from '@/common/models/base.model';
import { OrderServiceDetail } from '@/common/models/order/orderServiceDetail.model';
import { UpdateRequest } from '@/common/models/order/updateRequest.model';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

@Entity('update_order_service_details')
export class UpdateOrderServiceDetail extends Base {
  @ManyToOne(
    () => OrderServiceDetail,
    (orderServiceDetail) => orderServiceDetail.updateOrderServiceDetails,
    {
      nullable: false,
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({
    name: 'order_service_detail_id',
    foreignKeyConstraintName: 'fk_order_service_detail_update_order_service_detail',
  })
  @ApiProperty({
    description: 'Chi tiết dịch vụ đơn hàng liên quan',
    type: OrderServiceDetail,
  })
  orderServiceDetail: OrderServiceDetail;

  @OneToOne(() => UpdateRequest, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'update_request_id',
    foreignKeyConstraintName: 'fk_update_request_update_order_service_detail',
  })
  @ApiProperty({
    description: 'Yêu cầu cập nhật liên quan',
    type: UpdateRequest,
  })
  updateRequest: UpdateRequest;

  @Column({
    type: 'integer',
    unsigned: true,
    nullable: true,
    comment: 'Chiều cao của cô dâu',
  })
  @ApiProperty({
    type: 'number',
    nullable: true,
    description: 'Chiều cao của cô dâu (cm)',
    example: '170',
  })
  high: number | null;

  @Column({
    type: 'integer',
    unsigned: true,
    nullable: true,
    comment: 'Cân nặng',
  })
  @ApiProperty({
    type: 'number',
    nullable: true,
    description: 'Cân nặng (kg)',
    example: '45',
  })
  weight: number | null;

  @Column({
    type: 'integer',
    unsigned: true,
    nullable: true,
    comment: 'Vòng ngực',
  })
  @ApiProperty({
    type: 'number',
    nullable: true,
    description: 'Vòng ngực (cm)',
    example: '90',
  })
  bust: number | null;

  @Column({
    type: 'integer',
    unsigned: true,
    nullable: true,
    comment: 'Vòng eo',
  })
  @ApiProperty({
    type: 'number',
    nullable: true,
    description: 'Vòng eo (cm)',
    example: '60',
  })
  waist: number | null;

  @Column({
    type: 'integer',
    unsigned: true,
    nullable: true,
    comment: 'Vòng mông',
  })
  @ApiProperty({
    type: 'number',
    nullable: true,
    description: 'Vòng mông (cm)',
    example: '80',
  })
  hip: number | null;

  @Column({
    type: 'integer',
    unsigned: true,
    nullable: true,
    comment: 'Vòng nách',
  })
  @ApiProperty({
    type: 'number',
    nullable: true,
    description: 'Vòng nách (cm)',
    example: '10',
  })
  armpit: number | null;

  @Column({
    type: 'integer',
    unsigned: true,
    nullable: true,
    comment: 'Vòng bắp tay',
  })
  @ApiProperty({
    type: 'number',
    nullable: true,
    description: 'Vòng bắp tay (cm)',
    example: '10',
  })
  bicep: number | null;

  @Column({
    type: 'integer',
    unsigned: true,
    nullable: true,
    comment: 'Vòng cổ',
  })
  @ApiProperty({
    type: 'number',
    nullable: true,
    description: 'Vòng cổ (cm)',
    example: '20',
  })
  neck: number | null;

  @Column({
    type: 'integer',
    unsigned: true,
    nullable: true,
    comment: 'Chiều rộng vai',
  })
  @ApiProperty({
    type: 'number',
    nullable: true,
    description: 'Chiều rộng vai (cm)',
    example: '40',
  })
  shoulderWidth: number | null;

  @Column({
    type: 'integer',
    unsigned: true,
    nullable: true,
    comment: 'Chiều dài tay',
  })
  @ApiProperty({
    type: 'number',
    nullable: true,
    description: 'Chiều dài tay (cm)',
    example: '40',
  })
  sleeveLength: number | null;

  @Column({
    type: 'integer',
    unsigned: true,
    nullable: true,
    comment: 'Chiều dài lưng, từ chân cổ đến eo',
  })
  @ApiProperty({
    type: 'number',
    nullable: true,
    description: 'Chiều dài lưng, từ chân cổ đến eo (cm)',
    example: '60',
  })
  backLength: number | null;

  @Column({
    type: 'integer',
    unsigned: true,
    nullable: true,
    comment: 'Từ chân ngực đến eo',
  })
  @ApiProperty({
    type: 'number',
    nullable: true,
    description: 'Từ chân ngực đến eo (cm)',
    example: '50',
  })
  lowerWaist: number | null;

  @Column({
    type: 'integer',
    unsigned: true,
    nullable: true,
    comment: 'Độ dài tùng váy',
  })
  @ApiProperty({
    type: 'number',
    nullable: true,
    description: 'Độ dài tùng váy (cm)',
    example: '60',
  })
  waistToFloor: number | null;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: true,
    comment: 'Kiểu dáng váy',
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
  })
  @ApiProperty({
    type: 'string',
    maxLength: 200,
    nullable: true,
    description: 'Kiểu dáng váy',
    example: 'Váy ngắn hoặc vạt trước ngắn vạt sau dài.',
  })
  dressStyle: string | null;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: true,
    comment: 'Dạng cổ váy',
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
  })
  @ApiProperty({
    type: 'string',
    maxLength: 200,
    nullable: true,
    description: 'Dạng cổ váy',
    example: 'Cổ tim, cổ tròn, cổ thuyền, cổ yếm, cúp ngực',
  })
  curtainNeckline: string | null;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: true,
    comment: 'Dạng tay váy',
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
  })
  @ApiProperty({
    type: 'string',
    maxLength: 200,
    nullable: true,
    description: 'Dạng tay váy',
    example: 'Không tay, hai dây, tay trần, tay ngắn',
  })
  sleeveStyle: string | null;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: true,
    comment: 'Chất liệu',
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
  })
  @ApiProperty({
    type: 'string',
    maxLength: 200,
    nullable: true,
    description: 'Chất liệu',
    example: 'Kim sa, Đính kết pha lê/ngọc trai',
  })
  material: string | null;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: true,
    comment: 'Màu sắc',
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
  })
  @ApiProperty({
    type: 'string',
    maxLength: 200,
    nullable: true,
    description: 'Màu sắc',
    example: 'Trắng tinh, trắng ngà (ivory), kem',
  })
  color: string | null;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: true,
    comment: 'Yếu tố đặc biệt',
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
  })
  @ApiProperty({
    type: 'string',
    maxLength: 200,
    nullable: true,
    description: 'Yếu tố đặc biệt',
    example: 'Đuôi váy dài hay ngắn, có chi tiết xẻ tà',
  })
  specialElement: string | null;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: true,
    comment: 'Độ che phủ',
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
  })
  @ApiProperty({
    type: 'string',
    maxLength: 200,
    nullable: true,
    description: 'Độ che phủ',
    example: 'Mức độ hở lưng, xẻ ngực',
  })
  coverage: string | null;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: true,
    comment: 'Mô tả thêm',
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
  })
  @ApiProperty({
    type: 'string',
    maxLength: 200,
    nullable: true,
    description: 'Mô tả thêm',
    example: '...',
  })
  description: string | null;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    unsigned: true,
    nullable: false,
    default: 0,
    comment: 'Phí phụ thu cho yêu cầu cập nhật',
  })
  @ApiProperty({
    type: 'number',
    format: 'decimal',
    minimum: 0,
    nullable: false,
    description: 'Phí phụ thu cho yêu cầu cập nhật (VNĐ)',
    example: 1500000,
  })
  price: number;
}
