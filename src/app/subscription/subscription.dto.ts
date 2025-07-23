import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ListSubscriptionDto {
  @Expose()
  @ApiProperty({})
  id: string;

  @Expose()
  @ApiProperty({})
  name: string;

  @Expose()
  @ApiProperty({})
  description: string;

  @Expose()
  @ApiProperty({})
  images: string | null;

  @Expose()
  @ApiProperty({})
  duration: number;

  @Expose()
  @ApiProperty({})
  amount: number;
}

export class ItemSubscriptionDto {
  @Expose()
  @ApiProperty({})
  id: string;

  @Expose()
  @ApiProperty({})
  name: string;

  @Expose()
  @ApiProperty({})
  description: string;

  @Expose()
  @ApiProperty({})
  images: string | null;

  @Expose()
  @ApiProperty({})
  duration: number;

  @Expose()
  @ApiProperty({})
  amount: number;
}

export class CUSubscriptionDto {
  @ApiProperty({
    description: 'Tên gói thành viên',
    example: 'Gói thành viên 1 năm Ultimate',
    maxLength: 100,
    nullable: false,
  })
  name: string;

  @ApiProperty({
    description: 'Mô tả chi tiết gói',
    example: 'Gói cung cấp dịch vụ 1 năm, tiết kiệm 20% chi phí theo tháng',
    nullable: false,
  })
  description: string;

  @ApiProperty({
    description: 'Hình ảnh của gói thành viên',
    example: 'https://example.com/image.jpg',
    nullable: true,
  })
  images: string | null;

  @ApiProperty({
    description: 'Thời gian hiệu lực của gói tính bằng ngày',
    example: 365,
    nullable: false,
  })
  duration: number;

  @ApiProperty({
    description: 'Số tiền của gói thành viên',
    example: 1200000,
    nullable: false,
  })
  amount: number;
}
