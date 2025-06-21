import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Base, BaseImage, Complaint } from '@/common/models';
import { ApiProperty } from '@nestjs/swagger';

@Entity('complaint_images')
export class ComplaintImage extends Base {
  @ManyToOne(() => Complaint, (complaint) => complaint.images, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'complaint_id',
    foreignKeyConstraintName: 'fk_complaint_complaint_image',
  })
  @ApiProperty({
    description: 'Khiếu nại liên quan đến hình ảnh này',
    type: Complaint,
  })
  complaint: Complaint;

  @Column(() => BaseImage)
  @ApiProperty({
    description: 'Thông tin hình ảnh minh họa',
    type: BaseImage,
  })
  image: BaseImage;
}
