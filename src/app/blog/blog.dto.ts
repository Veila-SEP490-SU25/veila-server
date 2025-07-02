import { BlogStatus } from '@/common/models';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CUBlogDto {
  @ApiProperty()
  categoryId: string | null;

  @ApiProperty()
  title: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  images: string | null;

  @ApiProperty()
  status: BlogStatus;
}

export class ListBlogDto {
  @Expose()
  @ApiProperty({ description: 'ID blog', example: 'blog-uuid-123' })
  id: string;

  @Expose()
  @ApiProperty({ description: 'Tiêu đề blog', example: 'Bí quyết chọn váy cưới đẹp' })
  title: string;

  @Expose()
  @ApiProperty({
    description: 'Ảnh đại diện blog (URL)',
    example: 'https://storage.veila.com/blogs/img123.jpg',
    nullable: true,
  })
  images: string | null;
}

export class ItemBlogDto {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  images: string | null;

  @Expose()
  @ApiProperty()
  title: string;

  @Expose()
  @ApiProperty()
  content: string;
}
