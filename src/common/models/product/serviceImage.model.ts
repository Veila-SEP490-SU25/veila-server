import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Base, BaseImage, Service } from '../';
import { ApiProperty } from '@nestjs/swagger';

@Entity('service_images')
export class ServiceImage extends Base {
  @ManyToOne(() => Service, (service) => service.images, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'service_id',
    foreignKeyConstraintName: 'fk_service_image_service',
  })
  @ApiProperty({
    description: 'Hình ảnh của dịch vụ',
    type: Service,
  })
  service: Service;

  @Column(() => BaseImage)
  @ApiProperty({
    description: 'Thông tin hình ảnh minh họa',
    type: BaseImage,
    required: true,
  })
  image: BaseImage;
}
