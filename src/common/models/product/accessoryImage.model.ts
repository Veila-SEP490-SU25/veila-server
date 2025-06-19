import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Accessory, Base, BaseImage } from '../';
import { ApiProperty } from '@nestjs/swagger';

@Entity('accessory_images')
export class AccessoryImage extends Base {
  @ManyToOne(() => Accessory, (accessory) => accessory.images, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'accessory_id',
    foreignKeyConstraintName: 'fk_accessory_image_accessory',
  })
  @ApiProperty({
    description: 'Phụ kiện liên kết với hình ảnh',
    type: Accessory,
    nullable: false,
  })
  accessory: Accessory;

  @Column(() => BaseImage)
  @ApiProperty({
    description: 'Thông tin hình ảnh minh họa',
    type: BaseImage,
    required: true,
  })
  image: BaseImage;
}
