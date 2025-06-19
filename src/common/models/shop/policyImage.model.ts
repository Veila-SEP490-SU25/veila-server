import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Base, BaseImage, Policy } from '../';
import { ApiProperty } from '@nestjs/swagger';

@Entity('policy_images')
export class PolicyImage extends Base {
  @ManyToOne(() => Policy, (policy) => policy.policyImages, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'policy_id',
    foreignKeyConstraintName: 'fk_policy_image_policy',
  })
  @ApiProperty({
    description: 'Chính sách liên quan',
    type: Policy,
  })
  policy: Policy;

  @Column(() => BaseImage)
  @ApiProperty({
    description: 'Thông tin hình ảnh',
    type: BaseImage,
    required: true,
  })
  image = BaseImage;
}
