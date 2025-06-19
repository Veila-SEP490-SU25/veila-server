import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Base, BaseImage, Feedback } from '../';
import { ApiProperty } from '@nestjs/swagger';

@Entity('feedback_images')
export class FeedbackImage extends Base {
  @ManyToOne(() => Feedback, (feedback) => feedback.images, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'feedback_id',
    foreignKeyConstraintName: 'fk_feedback_feedback_image',
  })
  @ApiProperty({
    description: 'Đánh giá liên quan đến hình ảnh này',
    type: Feedback,
    required: true,
  })
  feedback: Feedback;

  @Column(() => BaseImage)
  @ApiProperty({
    description: 'Thông tin hình ảnh minh họa',
    type: BaseImage,
    required: true,
  })
  image: BaseImage;
}
