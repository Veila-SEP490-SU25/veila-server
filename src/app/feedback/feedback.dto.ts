import { ApiProperty } from '@nestjs/swagger';

export class ProductFeedbacksDto {
  @ApiProperty({ description: 'Tên người dùng đánh giá', example: 'customer123' })
  username: string;

  @ApiProperty({ description: 'Nội dung đánh giá', example: 'Váy rất đẹp!' })
  content: string;

  @ApiProperty({ description: 'Điểm đánh giá', example: 4.5 })
  rating: number;

  @ApiProperty({ description: 'Ảnh feedback (nếu có)', example: 'https://...' })
  images: string | null;
}
