import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export class Audit {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    type: 'string',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @Column({ type: 'boolean', default: false })
  @ApiProperty({
    type: 'boolean',
    example: 'false',
  })
  isDeleted: boolean;

  @CreateDateColumn()
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    example: '2023-10-01T12:00:00Z',
  })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    example: '2023-10-01T12:00:00Z',
  })
  updatedAt: Date;
}
