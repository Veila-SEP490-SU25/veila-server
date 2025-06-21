import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Base, BaseImage, Identifier } from '@/common/models';
import { ApiProperty } from '@nestjs/swagger';

@Entity('identifier_images')
export class IdentifierImage extends Base {
  @ManyToOne(() => Identifier, (identifier) => identifier.identifierImage, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'identifier_id',
    foreignKeyConstraintName: 'fk_identifier_image_identifier',
  })
  @ApiProperty({
    description: 'Giấy tờ tùy thân liên quan',
    type: Identifier,
  })
  identifier: Identifier;

  @Column(() => BaseImage)
  @ApiProperty({
    description: 'Thông tin hình ảnh',
    type: BaseImage,
    required: true,
  })
  image: BaseImage;
}
