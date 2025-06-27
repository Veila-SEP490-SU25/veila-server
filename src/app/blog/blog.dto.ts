import { BlogStatus } from '@/common/models';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBlogDto {}

export class ListBlogDto {
  @ApiProperty({ description: 'ID blog', example: 'blog-uuid-123' })
  id: string;

  @ApiProperty({ description: 'Tiêu đề blog', example: 'Bí quyết chọn váy cưới đẹp' })
  title: string;

  @ApiProperty({ description: 'Ảnh đại diện blog (URL)', example: 'https://storage.veila.com/blogs/img123.jpg', nullable: true })
  images: string | null;

  @ApiProperty({ enum: BlogStatus, description: 'Trạng thái blog', example: BlogStatus.DRAFT })
  status: BlogStatus;
}
