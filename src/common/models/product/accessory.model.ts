import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Base, Category, Feedback, User } from '@/common/models';
import { ApiProperty } from '@nestjs/swagger';

export enum AccessoryStatus {
  AVAILABLE = 'AVAILABLE',
  UNAVAILABLE = 'UNAVAILABLE',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
}

@Entity('accessories')
export class Accessory extends Base {
  @ManyToOne(() => User, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'user_id',
    foreignKeyConstraintName: 'fk_accessory_user',
  })
  @ApiProperty({
    description: 'Người dùng sở hữu phụ kiện',
    type: () => User,
    nullable: false,
  })
  user: User;

  @ManyToOne(() => Category, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({
    name: 'category_id',
    foreignKeyConstraintName: 'fk_accessory_category',
  })
  @ApiProperty({
    description: 'Danh mục phụ kiện',
    type: () => Category,
    nullable: true,
  })
  category: Category | null;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 100,
    nullable: false,
    comment: 'Tên của phụ kiện',
  })
  @ApiProperty({
    type: 'string',
    description: 'Tên của phụ kiện (tối đa 100 ký tự)',
    example: 'Vòng cổ ngọc trai',
    maxLength: 100,
    nullable: false,
  })
  name: string;

  @Column({
    name: 'description',
    type: 'text',
    nullable: true,
    comment: 'Mô tả chi tiết về phụ kiện',
  })
  @ApiProperty({
    type: 'string',
    description: 'Mô tả chi tiết về phụ kiện',
    example: 'Vòng cổ ngọc trai sang trọng, phù hợp với nhiều trang phục.',
    nullable: true,
  })
  description: string | null;

  @Column({
    name: 'sell_price',
    type: 'decimal',
    precision: 10,
    scale: 2,
    unsigned: true,
    nullable: false,
    default: 0.0,
    comment: 'Giá bán của phụ kiện',
  })
  @ApiProperty({
    type: 'number',
    format: 'float',
    description: 'Giá bán của phụ kiện (tối đa 10 chữ số, 2 chữ số thập phân)',
    example: 150.0,
    minimum: 0.0,
    default: 0.0,
    nullable: false,
  })
  sellPrice: number;

  @Column({
    name: 'rental_price',
    type: 'decimal',
    precision: 10,
    scale: 2,
    unsigned: true,
    nullable: false,
    default: 0.0,
    comment: 'Giá cho thuê của phụ kiện',
  })
  @ApiProperty({
    type: 'number',
    format: 'float',
    description: 'Giá cho thuê của phụ kiện (tối đa 10 chữ số, 2 chữ số thập phân)',
    example: 200.0,
    minimum: 0.0,
    default: 0.0,
    nullable: false,
  })
  rentalPrice: number;

  @Column({
    name: 'is_sellable',
    type: 'boolean',
    default: true,
    nullable: false,
    comment: 'Phụ kiện có thể bán hay không',
  })
  @ApiProperty({
    type: 'boolean',
    description: 'Phụ kiện có thể bán hay không',
    example: true,
    default: true,
    nullable: false,
  })
  isSellable: boolean;

  @Column({
    name: 'is_rentable',
    type: 'boolean',
    default: false,
    nullable: false,
    comment: 'Phụ kiện có thể cho thuê hay không',
  })
  @ApiProperty({
    type: 'boolean',
    description: 'Phụ kiện có thể cho thuê hay không',
    example: false,
    default: false,
    nullable: false,
  })
  isRentable: boolean;

  @Column({
    name: 'rating_average',
    type: 'decimal',
    precision: 3,
    scale: 2,
    unsigned: true,
    nullable: false,
    default: 0.0,
    comment: 'Điểm đánh giá trung bình của phụ kiện (từ 0.00 đến 5.00)',
  })
  @ApiProperty({
    type: 'number',
    format: 'decimal',
    description:
      'Điểm đánh giá trung bình của phụ kiện (giá trị từ 0.00 đến 5.00, làm tròn đến 2 chữ số thập phân)',
    example: 4.25,
    minimum: 0,
    maximum: 5,
    default: 0.0,
    required: true,
  })
  ratingAverage: number;

  @Column({
    name: 'rating_count',
    type: 'int',
    unsigned: true,
    nullable: false,
    default: 0,
    comment: 'Số lượng đánh giá mà phụ kiện đã nhận được',
  })
  @ApiProperty({
    type: 'integer',
    description: 'Tổng số lượt đánh giá của phụ kiện',
    example: 120,
    minimum: 0,
    default: 0,
    required: true,
  })
  ratingCount: number;

  @Column({
    name: 'status',
    type: 'enum',
    enum: AccessoryStatus,
    default: AccessoryStatus.AVAILABLE,
    comment: 'Trạng thái của phụ kiện',
  })
  @ApiProperty({
    enum: AccessoryStatus,
    description: 'Trạng thái của phụ kiện',
    example: AccessoryStatus.AVAILABLE,
    nullable: false,
  })
  status: AccessoryStatus;

  @OneToMany(() => Feedback, (feedback) => feedback.accessory)
  @ApiProperty({
    description: 'Danh sách Feedback của phụ kiện',
    type: () => [Feedback],
  })
  feedbacks: Feedback[];
}
