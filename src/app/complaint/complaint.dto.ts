import { ComplaintStatus } from '@/common/models';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class CUComplaintDto {
  @ApiProperty({
    description: 'The title of the complaint',
    example: 'Defective product',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'The description of the complaint',
    example: 'The product stopped working after one week.',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'The reason for the complaint',
    example: 'The product is defective',
  })
  @IsString()
  reason: string;

  @ApiProperty({
    description: 'The images related to the complaint',
    example: 'https://example.com/image1.jpg,https://example.com/image2.jpg',
  })
  @IsString()
  @IsOptional()
  images: string | null;

  @ApiProperty({
    description: 'The status of the complaint',
    example: ComplaintStatus.DRAFT,
  })
  @IsEnum(ComplaintStatus)
  status: ComplaintStatus;
}

export class ReviewComplaintDto {
  @ApiProperty({
    description: 'The status of the complaint',
    example: ComplaintStatus.APPROVED,
  })
  @IsEnum(ComplaintStatus)
  status: ComplaintStatus;
}
