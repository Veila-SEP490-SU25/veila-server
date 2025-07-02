import { Filtering, getOrder, getWhere, Sorting } from '@/common/decorators';
import { Service, ServiceStatus } from '@/common/models';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ServiceService {
  constructor(@InjectRepository(Service) private readonly serviceRepository: Repository<Service>) {}

  async findAndCountOfShopForCustomer(
    userId,
    limit: number,
    offset: number,
    sort?: Sorting,
    filter?: Filtering,
  ): Promise<[Service[], number]> {
    const dynamicFilter = getWhere(filter);
    const where = {
      ...dynamicFilter,
      user: { id: userId },
      status: ServiceStatus.ACTIVE,
    };
    const order = getOrder(sort);
    return await this.serviceRepository.findAndCount({
      where,
      order,
      take: limit,
      skip: offset,
    });
  }

  async findAndCountOfCategoryForCustomer(
    categoryId: string,
    limit: number,
    offset: number,
    sort?: Sorting,
    filter?: Filtering,
  ): Promise<[Service[], number]> {
    const dynamicFilter = getWhere(filter);
    const where = {
      ...dynamicFilter,
      category: { id: categoryId },
      status: ServiceStatus.ACTIVE,
    };
    const order = getOrder(sort);
    return await this.serviceRepository.findAndCount({
      where,
      order,
      take: limit,
      skip: offset,
    });
  }
}
