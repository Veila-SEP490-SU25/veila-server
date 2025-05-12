import { HttpStatus } from '@nestjs/common';

export class ItemResponse<T> {
  message: string;
  statusCode: HttpStatus;
  item: T;
}

export class ListResponse<T> {
  message: string;
  statusCode: HttpStatus;
  pageIndex: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  items: T[];
}

export class ErrorResponse {
  message: string;
  statusCode: HttpStatus;
}
