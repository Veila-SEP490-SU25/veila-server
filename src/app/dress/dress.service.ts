import { ListResponse } from '@/common/base';
import { Filtering, getOrder, getWhere, Pagination, Sorting } from '@/common/decorators';
import { Dress } from '@/common/models';
import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class DressService {
  constructor(@InjectRepository(Dress) private readonly dressRepository: Repository<Dress>) {}

  async getDressesForCustomer(
    { page, size, limit, offset }: Pagination,
    sort?: Sorting,
    filter?: Filtering,
  ): Promise<ListResponse<Dress>> {
    const dynamicFilter = getWhere(filter);
    const where = {
      ...dynamicFilter,
    };
    const order = getOrder(sort);
    const [dresses, totalItems] = await this.dressRepository.findAndCount({
      where,
      order,
      take: limit,
      skip: offset,
    });
    const totalPages = Math.ceil(totalItems / size);
    return {
      message: 'Đây là danh sách các váy cưới khả dụng',
      statusCode: HttpStatus.OK,
      pageIndex: page,
      pageSize: size,
      totalItems,
      totalPages,
      hasNextPage: page + 1 < totalPages,
      hasPrevPage: 0 < page,
      items: dresses,
    };
  }

  async getDressForCustomer(id: string): Promise<Dress> {
    const dress = await this.dressRepository.findOne({ where: { id: id } });
    if (!dress) throw new NotFoundException('Không tìm thấy váy cưới nào phù hợp');
    return dress;
  }
}
