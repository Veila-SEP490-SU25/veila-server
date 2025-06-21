import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Base, BaseImage, License } from '@/common/models';

@Entity('license_images')
export class LicenseImage extends Base {
  @ManyToOne(() => License, (license) => license.images, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'license_id',
    foreignKeyConstraintName: 'fk_license_image_license',
  })
  @ApiProperty({
    description: 'Giấy phép liên quan',
    type: () => License,
  })
  license: License;

  @Column(() => BaseImage)
  @ApiProperty({
    description: 'Thông tin hình ảnh giấy phép',
    type: BaseImage,
  })
  image: BaseImage;

  @Column({
    name: 'note',
    type: 'varchar',
    length: 500,
    nullable: true,
    comment: 'Ghi chú về hình ảnh',
  })
  @ApiProperty({
    type: 'string',
    description: 'Ghi chú về hình ảnh',
    example: 'Hình ảnh được cập nhật sau khi sửa chữa',
    maxLength: 500,
    nullable: true,
  })
  note: string | null;
}
