import { ListResponse } from '@/common/base';
import { Filtering, getOrder, getWhere, Pagination, Sorting } from '@/common/decorators';
import { Dress, DressStatus } from '@/common/models';
import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CUDressDto, ItemDressDto, ListDressDto } from '@/app/dress/dress.dto';

@Injectable()
export class DressService {
  constructor(@InjectRepository(Dress) private readonly dressRepository: Repository<Dress>) {}

  async getDressesForCustomer(
    { page, size, limit, offset }: Pagination,
    sort?: Sorting,
    filter?: Filtering,
  ): Promise<ListResponse<ListDressDto>> {
    const dynamicFilter = getWhere(filter);
    const where = {
      ...dynamicFilter,
      status: DressStatus.AVAILABLE,
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
      items: { ...dresses },
    };
  }

  async getDressForCustomer(id: string): Promise<ItemDressDto> {
    const dress = await this.dressRepository.findOne({
      where: {
        id,
        status: DressStatus.AVAILABLE,
      },
      relations: {
        feedbacks: { customer: true },
      },
    });
    if (!dress) throw new NotFoundException('Không tìm thấy váy cưới nào phù hợp');

    // Ánh xạ feedbacks sang ProductFeedbacksDto
    const feedbacks = (dress.feedbacks || []).map((fb) => ({
      username: fb.customer.username,
      content: fb.content,
      rating: fb.rating,
      images: fb.images,
    }));

    // Trả về ItemDressDto, chú ý gán feedbacks đã ánh xạ
    return {
      ...dress,
      feedbacks,
    };
  }

  async getDressesForOwner(
    userId: string,
    take: number,
    skip: number,
    sort?: Sorting,
    filter?: Filtering,
  ): Promise<[Dress[], number]> {
    const dynamicFilter = getWhere(filter);
    const where = {
      ...dynamicFilter,
      user: { id: userId },
    };
    const order = getOrder(sort);
    return await this.dressRepository.findAndCount({
      where,
      order,
      take,
      skip,
      withDeleted: true,
      relations: {
        category: true,
      },
    });
  }

  async findDressForOwner(userId: string, id: string): Promise<Dress> {
    const where = {
      user: { id: userId },
      id,
    };
    const existingDress = await this.dressRepository.findOne({
      where,
      withDeleted: true,
      relations: {
        category: true,
      },
    });
    if (!existingDress) throw new NotFoundException('Không tìm thấy váy cưới phù hợp');
    return existingDress;
  }

  async createDressForOwner(
    userId: string,
    { categoryId, ...newDress }: CUDressDto,
  ): Promise<Dress> {
    if (categoryId) {
      const dress = { userId, categoryId, ...newDress };
      return await this.dressRepository.save(dress);
    } else {
      const dress = { userId, ...newDress };
      return await this.dressRepository.save(dress);
    }
  }

  async updateDressForOwner(
    userId: string,
    id: string,
    { categoryId, ...newDress }: CUDressDto,
  ): Promise<number | undefined> {
    await this.findDressWithDeleted(userId, id);
    if (categoryId) {
      const dress = { categoryId, ...newDress };
      return (await this.dressRepository.update(id, dress)).affected;
    } else {
      const dress = { ...newDress };
      return (await this.dressRepository.update(id, dress)).affected;
    }
  }

  async removeDressForOwner(userId: string, id: string): Promise<number | undefined> {
    await this.findDressWithDeleted(userId, id);
    return (await this.dressRepository.softDelete(id)).affected;
  }

  async restoreDressForOwner(userId: string, id: string): Promise<number | undefined> {
    await this.findDressWithDeleted(userId, id);
    return (await this.dressRepository.restore(id)).affected;
  }

  async findDressWithDeleted(userId: string, id: string): Promise<Dress> {
    const where = {
      user: { id: userId },
      id,
    };
    const existingDress = await this.dressRepository.findOne({
      where,
      withDeleted: true,
    });
    if (!existingDress) throw new NotFoundException('Không tìm thấy váy cưới phù hợp');
    return existingDress;
  }

  async findAndCountOfShopForCustomer(
    userId,
    limit: number,
    offset: number,
    sort?: Sorting,
    filter?: Filtering,
  ): Promise<[Dress[], number]> {
    const dynamicFilter = getWhere(filter);
    const where = {
      ...dynamicFilter,
      user: { id: userId },
      status: DressStatus.AVAILABLE,
    };
    const order = getOrder(sort);
    return await this.dressRepository.findAndCount({
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
  ): Promise<[Dress[], number]> {
    const dynamicFilter = getWhere(filter);
    const where = {
      ...dynamicFilter,
      category: { id: categoryId },
      status: DressStatus.AVAILABLE,
    };
    const order = getOrder(sort);
    return await this.dressRepository.findAndCount({
      where,
      order,
      take: limit,
      skip: offset,
    });
  }

  async getAll(): Promise<Dress[]> {
    return await this.dressRepository.find({ withDeleted: true });
  }

  async create(dress: Dress): Promise<Dress> {
    return await this.dressRepository.save(dress);
  }
}
