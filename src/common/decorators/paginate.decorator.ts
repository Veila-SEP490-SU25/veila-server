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
  (validParams, ctx: ExecutionContext): Sorting[] | null => {
    const req: Request = ctx.switchToHttp().getRequest();
    const sort = req.query.sort as string;
    if (!sort) return null;

    // Kiểm tra field sort có phải mảng không
    if (typeof validParams != 'object')
      throw new InternalServerErrorException('Kiểm tra lại field sort đúng theo mảng');

    // Split by comma to handle multiple sorts: field1:asc,field2:desc
    const sortFields = sort.split(',');
    const sortings: Sorting[] = [];

    for (const sortField of sortFields) {
      const trimmedSort = sortField.trim();

      // Kiểm tra đúng format sort: [tên_field]:[asc/desc]
      const sortPattern = /^([a-zA-Z0-9]+):(asc|desc)$/;
      if (!trimmedSort.match(sortPattern))
        throw new BadRequestException('Sort param không đúng định dạng [tên_field]:[asc/desc]');

      // Kiểm tra param sort khả dụng không
      const [property, direction] = trimmedSort.split(':');
      if (!validParams.includes(property))
        throw new BadRequestException(`Không hỗ trợ sort theo trường thông tin này: ${property}`);

      sortings.push({ property, direction });
    }

    return sortings;
  },
);

export const FilteringParams = createParamDecorator(
  (validParams, ctx: ExecutionContext): Filtering[] | null => {
    const req: Request = ctx.switchToHttp().getRequest();
    const filter = req.query.filter as string;
    if (!filter) return null;

    // Kiểm tra field filter có phải mảng không
    if (typeof validParams != 'object')
      throw new InternalServerErrorException('Kiểm tra lại field filter đúng theo mảng');

    // Split by comma to handle multiple filters: field1:eq:value1,field2:like:value2
    const filterFields = filter.split(',');
    const filterings: Filtering[] = [];

    for (const filterField of filterFields) {
      const trimmedFilter = filterField.trim();

      // Kiểm tra format filter: [tên_field]:[eq|neq|gt|gte|lt|lte|like|nlike|in|nin]:[keyword] hoặc [tên_field]:[isnull|isnotnull]
      if (
        !trimmedFilter.match(
          /^[a-zA-Z0-9_]+:(eq|neq|gt|gte|lt|lte|like|nlike|in|nin):[a-zA-Z0-9_,]+$/,
        ) &&
        !trimmedFilter.match(/^[a-zA-Z0-9_]+:(isnull|isnotnull)$/)
      ) {
        throw new BadRequestException(
          'Không đúng format filer: [tên_field]:[eq|neq|gt|gte|lt|lte|like|nlike|in|nin]:[keyword] hoặc [tên_field]:[isnull|isnotnull]',
        );
      }

      // Kiểm tra param filter khả dụng không
      const [property, rule, value] = trimmedFilter.split(':');
      if (!validParams.includes(property))
        throw new BadRequestException(`Không hỗ trợ lọc theo trường thông tin này: ${property}`);
      if (!Object.values(FilterRule).includes(rule as FilterRule))
        throw new InternalServerErrorException(`Rule filter bất hợp lệ, kiểm tra lại: ${rule}`);

      filterings.push({ property, rule, value });
    }

    return filterings;
  },
);

export const getOrder = (sort?: Sorting[]) => {
  if (!sort || sort.length === 0) return {};

  const order: Record<string, string> = {};
  sort.forEach((s) => {
    order[s.property] = s.direction;
  });

  return order;
};

export const getWhere = (filter?: Filtering[]) => {
  if (!filter || filter.length === 0) return {};

  const where: Record<string, unknown> = {};

  filter.forEach((f) => {
    if (f.rule == FilterRule.IS_NULL) where[f.property] = IsNull();
    else if (f.rule == FilterRule.IS_NOT_NULL) where[f.property] = Not(IsNull());
    else if (f.rule == FilterRule.EQUALS) where[f.property] = f.value;
    else if (f.rule == FilterRule.NOT_EQUALS) where[f.property] = Not(f.value);
    else if (f.rule == FilterRule.GREATER_THAN) where[f.property] = MoreThan(f.value);
    else if (f.rule == FilterRule.GREATER_THAN_OR_EQUALS)
      where[f.property] = MoreThanOrEqual(f.value);
    else if (f.rule == FilterRule.LESS_THAN) where[f.property] = LessThan(f.value);
    else if (f.rule == FilterRule.LESS_THAN_OR_EQUALS) where[f.property] = LessThanOrEqual(f.value);
    else if (f.rule == FilterRule.LIKE) where[f.property] = ILike(`%${f.value}%`);
    else if (f.rule == FilterRule.NOT_LIKE) where[f.property] = Not(ILike(`%${f.value}%`));
    else if (f.rule == FilterRule.IN) where[f.property] = In(f.value.split(','));
    else if (f.rule == FilterRule.NOT_IN) where[f.property] = Not(In(f.value.split(',')));
  });

  return where;
};
