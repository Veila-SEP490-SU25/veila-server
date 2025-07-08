import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

export class ProductFeedbacksDto {
  @Expose()
  @ApiProperty({ description: 'ID Feedback', example: 'uuid-feedback-1' })
  id: string;

  @Expose()
  @ApiProperty({ description: 'Tên người dùng đánh giá', example: 'customer123' })
  @Transform(({ obj: feedback }) => feedback.customer.username)
  username: string;

  @Expose()
  @ApiProperty({ description: 'Nội dung đánh giá', example: 'Váy rất đẹp!' })
  content: string;

  @Expose()
  @ApiProperty({ description: 'Điểm đánh giá', example: 4.5 })
  rating: number;

  @Expose()
  @ApiProperty({ description: 'Ảnh feedback (nếu có)', example: 'https://...' })
  images: string | null;
}
