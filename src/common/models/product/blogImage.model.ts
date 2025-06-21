import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Base, BaseImage, Blog } from '@/common/models';
import { ApiProperty } from '@nestjs/swagger';

@Entity('blog_images')
export class BlogImage extends Base {
  @ManyToOne(() => Blog, (blog) => blog.images, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'blog_id',
    foreignKeyConstraintName: 'fk_blog_image_blog',
  })
  @ApiProperty({
    description: 'Blog liên kết với hình ảnh',
    type: Blog,
    nullable: false,
  })
  blog: Blog;

  @Column(() => BaseImage)
  @ApiProperty({
    description: 'Thông tin hình ảnh minh họa',
    type: BaseImage,
    required: true,
  })
  image: BaseImage;
}
