import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Base, Category, User } from '@/common/models';
import { ApiProperty } from '@nestjs/swagger';

export enum BlogStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  UNPUBLISHED = 'UNPUBLISHED',
}

@Entity('blogs')
export class Blog extends Base {
  @ManyToOne(() => User, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'user_id',
    foreignKeyConstraintName: 'fk_blog_user',
  })
  @ApiProperty({
    description: 'Người dùng sở hữu blog',
    type: User,
  })
  user: User;

  @ManyToOne(() => Category, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({
    name: 'category_id',
    foreignKeyConstraintName: 'fk_blog_category',
  })
  @ApiProperty({
    description: 'Danh mục blog',
    type: Category,
    nullable: true,
  })
  category: Category | null;

  @Column({
    name: 'title',
    type: 'varchar',
    length: 100,
    nullable: false,
    comment: 'Tiêu đề của blog',
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
  })
  @ApiProperty({
    type: 'string',
    description: 'Tiêu đề của blog (tối đa 100 ký tự)',
    example: 'Hướng dẫn chọn váy dạ hội hoàn hảo',
    maxLength: 100,
    nullable: false,
  })
  title: string;

  @Column({
    name: 'content',
    type: 'text',
    nullable: false,
    comment: 'Nội dung của blog',
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
  })
  @ApiProperty({
    type: 'string',
    description: 'Nội dung của blog',
    example:
      'Trong bài viết này, chúng ta sẽ khám phá cách chọn váy dạ hội hoàn hảo cho từng dịp...',
    nullable: false,
  })
  content: string;

  @Column({
    name: 'is_verified',
    type: 'boolean',
    default: false,
    nullable: false,
    comment: 'Trạng thái xác minh của blog',
  })
  @ApiProperty({
    type: 'boolean',
    description: 'Trạng thái xác minh của blog',
    example: true,
    default: false,
    nullable: false,
  })
  isVerified: boolean;

  @Column({
    name: 'status',
    type: 'enum',
    enum: BlogStatus,
    default: BlogStatus.DRAFT,
    nullable: false,
    comment: 'Trạng thái của blog',
  })
  @ApiProperty({
    enum: BlogStatus,
    description: 'Trạng thái của blog',
    example: BlogStatus.DRAFT,
    default: BlogStatus.DRAFT,
    nullable: false,
  })
  status: BlogStatus;
}
