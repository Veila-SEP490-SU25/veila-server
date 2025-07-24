import { TaskStatus } from '@/common/models';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CUTaskDto {
  @ApiProperty({
    description: 'ID của mốc công việc',
    example: 'milestone-uuid-123',
    nullable: false,
  })
  @IsNotEmpty()
  @IsString()
  milestoneId: string;

  @ApiProperty({
    description: 'Tiêu đề của công việc',
    example: 'May cổ áo',
    nullable: false,
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Mô tả công việc',
    example: 'Đo, cắt',
    nullable: false,
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Số thứ tự của công việc',
    example: 1,
    nullable: false,
  })
  @IsNotEmpty()
  @IsNumber()
  index: number;

  @ApiProperty({
    description: 'Trạng thái công việc',
    example: TaskStatus.IN_PROGRESS,
    nullable: false,
  })
  status: TaskStatus;

  @ApiProperty({
    description: 'Hạn hoàn thành công việc',
    example: '2025-07-01T17:00:00.000Z',
    nullable: false,
  })
  @IsNotEmpty()
  @IsString()
  dueDate: Date;
}

export class taskDto {
  @Expose()
  @ApiProperty({ description: 'ID của công việc', example: 'task-uuid-123' })
  @Expose()
  @ApiProperty({ description: 'ID của mốc công việc', example: 'milestone-uuid-123' })
  @Transform(({ obj: task }) => task.milestone.id)
  milestoneId: string;

  @Expose()
  @ApiProperty({ description: 'Tiêu đề của công việc', example: 'May cổ áo' })
  title: string;

  @Expose()
  @ApiProperty({ description: 'Mô tả công việc', example: 'Đo, cắt' })
  description: string;

  @Expose()
  @ApiProperty({ description: 'Số thứ tự của công việc', example: 1 })
  index: number;

  @Expose()
  @ApiProperty({ description: 'Trạng thái công việc', example: TaskStatus.IN_PROGRESS })
  status: TaskStatus;

  @Expose()
  @ApiProperty({ description: 'Hạn hoàn thành công việc', example: '2025-07-01T17:00:00.000Z' })
  dueDate: Date;
}
