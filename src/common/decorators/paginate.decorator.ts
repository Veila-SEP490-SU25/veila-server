import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request } from 'express';
import {
  ILike,
  In,
  IsNull,
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Not,
} from 'typeorm';

export interface Pagination {
  page: number;
  size: number;
  limit: number;
  offset: number;
}

export interface Sorting {
  property: string;
  direction: string;
}

export interface Filtering {
  property: string;
  rule: string;
  value: string;
}

// valid filter rules
export enum FilterRule {
  EQUALS = 'eq',
  NOT_EQUALS = 'neq',
  GREATER_THAN = 'gt',
  GREATER_THAN_OR_EQUALS = 'gte',
  LESS_THAN = 'lt',
  LESS_THAN_OR_EQUALS = 'lte',
  LIKE = 'like',
  NOT_LIKE = 'nlike',
  IN = 'in',
  NOT_IN = 'nin',
  IS_NULL = 'isnull',
  IS_NOT_NULL = 'isnotnull',
}

export const PaginationParams = createParamDecorator((_, ctx: ExecutionContext): Pagination => {
  const req: Request = ctx.switchToHttp().getRequest();
  const page = parseInt(req.query.page as string) || 0;
  const size = parseInt(req.query.size as string) || 10;

  //Kiểm tra trang và kích thước hợp lệ
  if (isNaN(page) || page < 0 || isNaN(size) || size < 0)
    throw new BadRequestException('Page và size của trang phải là số dương');

  //Tính toán limit và offset
  const limit = size;
  const offset = page * limit;
  return { page, size, limit, offset };
});

export const SortingParams = createParamDecorator(
  (validParams, ctx: ExecutionContext): Sorting | null => {
    const req: Request = ctx.switchToHttp().getRequest();
    const sort = req.query.sort as string;
    if (!sort) return null;

    // Kiểm tra field sort có phải mảng không
    if (typeof validParams != 'object')
      throw new InternalServerErrorException('Kiểm tra lại field sort đúng theo mảng');

    // Kiểm tra đúng format sort: [tên_field]:[asc/desc]
    const sortPattern = /^([a-zA-Z0-9]+):(asc|desc)$/;
    if (!sort.match(sortPattern))
      throw new BadRequestException('Sort param không đúng định dạng [tên_field]:[asc/desc]');

    // Kiểm tra param sort khả dụng không
    const [property, direction] = sort.split(':');
    if (!validParams.includes(property))
      throw new BadRequestException(`Không hỗ trợ sort theo trường thông tin này: ${property}`);

    return { property, direction };
  },
);

export const FilteringParams = createParamDecorator(
  (validParams, ctx: ExecutionContext): Filtering | null => {
    const req: Request = ctx.switchToHttp().getRequest();
    const filter = req.query.filter as string;
    if (!filter) return null;

    // Kiểm tra field filter có phải mảng không
    if (typeof validParams != 'object')
      throw new InternalServerErrorException('Kiểm tra lại field filter đúng theo mảng');

    // Kiểm tra format filter: [tên_field]:[eq|neq|gt|gte|lt|lte|like|nlike|in|nin]:[keyword] hoặc [tên_field]:[isnull|isnotnull]
    if (
      !filter.match(/^[a-zA-Z0-9_]+:(eq|neq|gt|gte|lt|lte|like|nlike|in|nin):[a-zA-Z0-9_,]+$/) &&
      !filter.match(/^[a-zA-Z0-9_]+:(isnull|isnotnull)$/)
    ) {
      throw new BadRequestException(
        'Không đúng format filer: [tên_field]:[eq|neq|gt|gte|lt|lte|like|nlike|in|nin]:[keyword] hoặc [tên_field]:[isnull|isnotnull]',
      );
    }

    // Kiểm tra param filter khả dụng không
    const [property, rule, value] = filter.split(':');
    if (!validParams.includes(property))
      throw new BadRequestException(`Không hỗ trợ lọc theo trường thông tin này: ${property}`);
    if (!Object.values(FilterRule).includes(rule as FilterRule))
      throw new InternalServerErrorException(`Rule filter bất hợp lệ, kiểm tra lại: ${rule}`);

    return { property, rule, value };
  },
);

export const getOrder = (sort?: Sorting) => (sort ? { [sort.property]: sort.direction } : {});

export const getWhere = (filter?: Filtering) => {
  if (!filter) return {};

  if (filter.rule == FilterRule.IS_NULL) return { [filter.property]: IsNull() };
  if (filter.rule == FilterRule.IS_NOT_NULL) return { [filter.property]: Not(IsNull()) };
  if (filter.rule == FilterRule.EQUALS) return { [filter.property]: filter.value };
  if (filter.rule == FilterRule.NOT_EQUALS) return { [filter.property]: Not(filter.value) };
  if (filter.rule == FilterRule.GREATER_THAN) return { [filter.property]: MoreThan(filter.value) };
  if (filter.rule == FilterRule.GREATER_THAN_OR_EQUALS)
    return { [filter.property]: MoreThanOrEqual(filter.value) };
  if (filter.rule == FilterRule.LESS_THAN) return { [filter.property]: LessThan(filter.value) };
  if (filter.rule == FilterRule.LESS_THAN_OR_EQUALS)
    return { [filter.property]: LessThanOrEqual(filter.value) };
  if (filter.rule == FilterRule.LIKE) return { [filter.property]: ILike(`%${filter.value}%`) };
  if (filter.rule == FilterRule.NOT_LIKE)
    return { [filter.property]: Not(ILike(`%${filter.value}%`)) };
  if (filter.rule == FilterRule.IN) return { [filter.property]: In(filter.value.split(',')) };
  if (filter.rule == FilterRule.NOT_IN)
    return { [filter.property]: Not(In(filter.value.split(','))) };
};
