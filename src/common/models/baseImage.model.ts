import { ApiProperty } from '@nestjs/swagger';
import { Column } from 'typeorm';

export class BaseImage {
  @Column({
    name: 'image_url',
    type: 'varchar',
    length: 512,
    nullable: false,
    comment: 'Đường dẫn URL của hình ảnh',
  })
  @ApiProperty({
    type: 'string',
    format: 'uri',
    description: 'Đường dẫn URL của hình ảnh (tối đa 512 ký tự)',
    example: 'https://storage.veila.com/images/products/dress-123/main.jpg',
    maxLength: 512,
    nullable: false,
  })
  imageUrl: string;

  @Column({
    name: 'index',
    type: 'tinyint',
    unsigned: true,
    nullable: false,
    default: 0,
    comment: 'Số thứ tự hiển thị của hình ảnh (0-255)',
  })
  @ApiProperty({
    type: 'integer',
    description: 'Số thứ tự hiển thị của hình ảnh',
    example: 0,
    minimum: 0,
    maximum: 255,
    default: 0,
    nullable: false,
  })
  index: number;
}
