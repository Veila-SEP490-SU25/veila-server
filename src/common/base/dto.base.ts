import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class ItemResponse<T> {
  @ApiProperty()
  message: string;

  @ApiProperty()
  statusCode: HttpStatus;

  item: T;
}

export class ListResponse<T> {
  @ApiProperty()
  message: string;

  @ApiProperty()
  statusCode: HttpStatus;

  @ApiProperty()
  pageIndex: number;

  @ApiProperty()
  pageSize: number;

  @ApiProperty()
  totalItems: number;

  @ApiProperty()
  totalPages: number;

  @ApiProperty()
  hasNextPage: boolean;

  @ApiProperty()
  hasPrevPage: boolean;

  items: T[];
}

export class ErrorResponse {
  message: string;
  statusCode: HttpStatus;
}
