import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CUSlideDto {
  @ApiProperty({
    type: 'string',
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'The unique identifier for the slide.',
  })
  @IsString()
  title: string;

  @ApiProperty({
    type: 'string',
    nullable: true,
    description: 'Mô tả của slide',
  })
  @IsString()
  @IsOptional()
  description: string | null;

  @ApiProperty({
    type: 'string',
    format: 'text',
    nullable: true,
    description: "Chuỗi hình ảnh, cách nhau bằng dấu ','",
    example: 'https://veila.images/1,https://veila.images/2',
  })
  @IsString()
  @IsOptional()
  images: string | null;
}
