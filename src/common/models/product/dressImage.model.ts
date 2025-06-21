import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Base, BaseImage, Dress } from '@/common/models';
import { ApiProperty } from '@nestjs/swagger';

@Entity('dress_images')
export class DressImage extends Base {
  @ManyToOne(() => Dress, (dress) => dress.images, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'dress_id',
    foreignKeyConstraintName: 'fk_dress_image_dress',
  })
  @ApiProperty({
    description: 'Sản phẩm liên kết với hình ảnh',
    type: Dress,
  })
  dress: Dress;

  @Column(() => BaseImage)
  @ApiProperty({
    description: 'Thông tin hình ảnh minh họa',
    type: BaseImage,
    required: true,
  })
  image: BaseImage;
}
