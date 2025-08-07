import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Base, Category, Feedback, User } from '@/common/models';
import { ApiProperty } from '@nestjs/swagger';

export enum DressStatus {
  AVAILABLE = 'AVAILABLE',
  UNAVAILABLE = 'UNAVAILABLE',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
}

@Entity('dresses')
export class Dress extends Base {
  @ManyToOne(() => User, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'user_id',
    foreignKeyConstraintName: 'fk_dress_user',
  })
  user: User;

  @ManyToOne(() => Category, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({
    name: 'category_id',
    foreignKeyConstraintName: 'fk_dress_category',
  })
  category: Category | null;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 100,
    nullable: false,
    comment: 'Tên sản phẩm',
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
  })
  @ApiProperty({
    type: 'string',
    description: 'Tên sản phẩm (tối đa 100 ký tự)',
    example: 'Váy dạ hội đỏ',
    maxLength: 100,
    nullable: false,
  })
  name: string;

  @Column({
    name: 'description',
    type: 'text',
    nullable: true,
    comment: 'Mô tả sản phẩm',
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
  })
  @ApiProperty({
    type: 'string',
    description: 'Mô tả sản phẩm (tối đa 500 ký tự)',
    example: 'Váy dạ hội đỏ sang trọng, phù hợp cho các buổi tiệc lớn.',
    maxLength: 500,
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
    comment: 'Giá bán sản phẩm',
  })
  @ApiProperty({
    type: 'number',
    format: 'float',
    description: 'Giá bán sản phẩm (tối đa 10 chữ số, 2 chữ số thập phân)',
    example: 199.99,
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
    comment: 'Giá cho thuê sản phẩm',
  })
  @ApiProperty({
    type: 'number',
    format: 'float',
    description: 'Giá cho thuê sản phẩm (tối đa 10 chữ số, 2 chữ số thập phân)',
    example: 49.99,
    minimum: 0.0,
    default: 0.0,
    nullable: false,
  })
  rentalPrice: number;

  @Column({
    name: 'is_sellable',
    type: 'boolean',
    nullable: false,
    default: true,
    comment: 'Sản phẩm có thể bán được hay không',
  })
  @ApiProperty({
    type: 'boolean',
    description: 'Sản phẩm có thể bán được hay không',
    example: true,
    default: true,
    nullable: false,
  })
  isSellable: boolean;

  @Column({
    name: 'is_rentable',
    type: 'boolean',
    nullable: false,
    default: false,
    comment: 'Sản phẩm có thể cho thuê hay không',
  })
  @ApiProperty({
    type: 'boolean',
    description: 'Sản phẩm có thể cho thuê hay không',
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
    comment: 'Điểm đánh giá trung bình của sản phẩm',
  })
  @ApiProperty({
    type: 'number',
    format: 'decimal',
    description:
      'Điểm đánh giá trung bình của sản phẩm (từ 0.00 đến 5.00, làm tròn đến 2 chữ số thập phân)',
    example: 4.25,
    minimum: 0,
    maximum: 5,
    default: 0.0,
  })
  ratingAverage: number;

  @Column({
    name: 'rating_count',
    type: 'int',
    unsigned: true,
    nullable: false,
    default: 0,
    comment: 'Số lượng đánh giá của sản phẩm',
  })
  @ApiProperty({
    type: 'integer',
    description: 'Số lượng đánh giá mà sản phẩm đã nhận được',
    example: 123,
    minimum: 0,
    default: 0,
  })
  ratingCount: number;

  @Column({
    name: 'status',
    type: 'enum',
    enum: DressStatus,
    default: DressStatus.AVAILABLE,
    comment: 'Trạng thái của sản phẩm',
  })
  @ApiProperty({
    enum: DressStatus,
    description: 'Trạng thái của sản phẩm',
    example: DressStatus.AVAILABLE,
    enumName: 'DressStatus',
  })
  status: DressStatus;

  @OneToMany(() => Feedback, (feedback) => feedback.dress)
  feedbacks: Feedback[];
}
