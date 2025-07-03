import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Base, User } from '@/common/models';
import { ApiProperty } from '@nestjs/swagger';

export enum CategoryType {
  BLOG = 'BLOG',
  DRESS = 'DRESS',
  ACCESSORY = 'ACCESSORY',
  SERVICE = 'SERVICE',
}

@Entity('categories')
export class Category extends Base {
  @ManyToOne(() => User, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'user_id',
    foreignKeyConstraintName: 'fk_category_user',
  })
  @ApiProperty({
    description: 'Người dùng sở hữu danh mục sản phẩm',
    type: User,
  })
  user: User;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 50,
    nullable: false,
    comment: 'Tên danh mục sản phẩm',
  })
  @ApiProperty({
    type: 'string',
    description: 'Tên danh mục sản phẩm (tối đa 50 ký tự)',
    example: 'Đầm Dự Tiệc',
    maxLength: 50,
    nullable: false,
  })
  name: string;

  @Column({
    name: 'description',
    type: 'varchar',
    length: 255,
    nullable: false,
    comment: 'Mô tả ngắn gọn về danh mục sản phẩm',
  })
  @ApiProperty({
    type: 'string',
    description: 'Mô tả ngắn gọn về danh mục sản phẩm (tối đa 255 ký tự)',
    example: 'Những mẫu đầm dự tiệc sang trọng và thanh lịch',
    maxLength: 255,
    nullable: true,
  })
  description: string | null;

  @Column({
    name: 'type',
    type: 'enum',
    enum: CategoryType,
    nullable: false,
    comment: 'Loại danh mục sản phẩm',
  })
  @ApiProperty({
    enum: CategoryType,
    description: 'Loại danh mục sản phẩm',
    example: CategoryType.DRESS,
    nullable: false,
  })
  type: CategoryType;
}
