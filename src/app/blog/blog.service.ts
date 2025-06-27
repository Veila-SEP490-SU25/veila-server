import { Filtering, getOrder, getWhere, Sorting } from '@/common/decorators';
import { Blog, BlogStatus } from '@/common/models';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class BlogService {
  constructor(@InjectRepository(Blog) private readonly blogRepository: Repository<Blog>) {}

  async findAndCountOfShopForCustomer(
    userId,
    limit: number,
    offset: number,
    sort?: Sorting,
    filter?: Filtering,
  ): Promise<[Blog[], number]> {
    const dynamicFilter = getWhere(filter);
    const where = {
      ...dynamicFilter,
      user: { id: userId },
      status: BlogStatus.PUBLISHED,
    };
    const order = getOrder(sort);
    return await this.blogRepository.findAndCount({
      where,
      order,
      take: limit,
      skip: offset,
    });
  }
}
