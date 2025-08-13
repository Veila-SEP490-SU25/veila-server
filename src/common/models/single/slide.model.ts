import { Base } from '@/common/models/base.model';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';

@Entity('slides')
export class Slide extends Base {
  @Column({
    name: 'title',
    type: 'varchar',
    length: 255,
    nullable: false,
    comment: 'Tiêu đề của slide',
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
  })
  @ApiProperty({
    type: 'string',
    nullable: false,
    description: 'Tiêu đề của slide',
    example: 'Khuyến mãi tháng 10',
  })
  title: string;

  @Column({
    name: 'images',
    type: 'text',
    nullable: true,
  })
  @ApiProperty({
    type: 'string',
    format: 'text',
    nullable: true,
    description: "Chuỗi hình ảnh, cách nhau bằng dấu ','",
    example: 'https://veila.images/1,https://veila.images/2',
  })
  images: string | null;

  @Column({
    name: 'description',
    type: 'text',
    nullable: true,
    comment: 'Mô tả của slide',
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
  })
  @ApiProperty({
    type: 'string',
    nullable: true,
    description: 'Mô tả của slide',
  })
  description: string | null;
}
