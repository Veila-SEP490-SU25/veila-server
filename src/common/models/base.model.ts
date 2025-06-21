import { ApiProperty } from '@nestjs/swagger';
import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class Base {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    type: 'string',
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'The unique identifier for the record.',
  })
  id: string;

  @CreateDateColumn({
    nullable: false,
  })
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    example: '2023-10-01T12:00:00Z',
    description: 'The date when the record was created.',
  })
  createdAt: Date;

  @UpdateDateColumn({
    nullable: false,
  })
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    example: '2023-10-01T12:00:00Z',
    description: 'The date when the record was last updated.',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    nullable: true,
  })
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    example: '2023-10-01T12:00:00Z',
    description: 'The date when the record was deleted. Null if not deleted.',
  })
  deletedAt: Date | null;
}
