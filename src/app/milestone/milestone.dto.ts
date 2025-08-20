import { MilestoneStatus } from '@/common/models';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class CUMilestoneDto {
  @ApiProperty({
    description: 'ID của đơn hàng',
    example: 'order-uuid-123',
    nullable: false,
  })
  @IsNotEmpty()
  @IsString()
  orderId: string;

  @ApiProperty({
    description: 'Tiêu đề của mốc công việc',
    example: 'ABC123',
    nullable: false,
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Mô tả cụ thể của mốc công việc',
    example: 'Tạo bản phác thảo, mua nguyên vật liệu',
    nullable: false,
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Hạn hoàn thành mốc công việc',
    example: '2025-07-01T17:00:00.000Z',
    nullable: false,
  })
  @IsNotEmpty()
  @IsString()
  dueDate: Date;
}

export class CUMilestoneDtoV2 {
  @ApiProperty({
    description: 'Hạn hoàn thành mốc công việc',
    example: '2025-07-01T17:00:00.000Z',
    nullable: false,
  })
  @IsNotEmpty()
  @IsString()
  dueDate: Date;
}

export class MilestoneDto {
  @Expose()
  @ApiProperty({ description: 'ID của mốc công việc', example: 'milestone-uuid-123' })
  milestoneId: string;

  @Expose()
  @ApiProperty({ description: 'ID của đơn hàng', example: 'order-uuid-123' })
  @Transform(({ obj: milestone }) => milestone.order?.id ?? null)
  orderId: string;

  @Expose()
  @ApiProperty({ description: 'Tiêu đề của mốc công việc', example: 'ABC123' })
  title: string;

  @Expose()
  @ApiProperty({
    description: 'Mô tả cụ thể của mốc công việc',
    example: 'Tạo bản phác thảo, mua nguyên vật liệu',
  })
  description: string;

  @Expose()
  @ApiProperty({ description: 'Số thứ tự của mốc công việc', example: 1 })
  index: number;

  @Expose()
  @ApiProperty({ description: 'Trạng thái mốc công việc', example: MilestoneStatus.IN_PROGRESS })
  status: MilestoneStatus;

  @Expose()
  @ApiProperty({ description: 'Hạn hoàn thành mốc công việc', example: '2025-07-01T17:00:00.000Z' })
  dueDate: Date;
}
