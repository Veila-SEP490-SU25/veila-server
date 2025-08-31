import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min, Max } from 'class-validator';

export class CancelPenaltyDto {
  @ApiProperty({
    example: 5,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  penalty: number;
}
