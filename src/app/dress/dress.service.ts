import { Filtering, getOrder, getWhere, Sorting } from '@/common/decorators';
import { Category, Dress, DressStatus, ShopStatus } from '@/common/models';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CUDressDto } from '@/app/dress/dress.dto';

@Injectable()
export class DressService {
  constructor(
    @InjectRepository(Dress) private readonly dressRepository: Repository<Dress>,
    @InjectRepository(Category) private readonly categoryRepository: Repository<Category>,
  ) {}

  async getDressesForCustomer(
    take: number,
    skip: number,
    sort?: Sorting,
    filter?: Filtering,
  ): Promise<[Dress[], number]> {
    const dynamicFilter = getWhere(filter);
    const where = {
      ...dynamicFilter,
      status: In([DressStatus.AVAILABLE, DressStatus.OUT_OF_STOCK]),
      user: { shop: { status: ShopStatus.ACTIVE } },
    };
    const order = getOrder(sort);
    return await this.dressRepository.findAndCount({
      where,
      order,
      take,
      skip,
    });
  }

  async getDressForCustomer(id: string): Promise<Dress> {
    const dress = await this.dressRepository.findOne({
      where: {
        id,
        status: DressStatus.AVAILABLE,
        user: { shop: { status: ShopStatus.ACTIVE } },
      },
      relations: {
        feedbacks: { customer: true },
        user: { shop: true },
      },
    });
    if (!dress) throw new NotFoundException('Không tìm thấy váy cưới nào phù hợp');
    return dress;
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
        feedbacks: true,
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
        feedbacks: true,
      },
    });
    if (!existingDress) throw new NotFoundException('Không tìm thấy váy cưới phù hợp');
    return existingDress;
  }

  async createDressForOwner(
    userId: string,
    { categoryId, ...newDress }: CUDressDto,
  ): Promise<Dress> {
    let dress;
    if (categoryId) {
      if (!(await this.isCategoryExistForOwner(categoryId, userId)))
        throw new NotFoundException('Không tìm thấy phân loại phù hợp');
      dress = { userId, categoryId, ...newDress };
    } else {
      dress = { userId, ...newDress };
    }
    return await this.dressRepository.save(dress);
  }

  async updateDressForOwner(
    userId: string,
    id: string,
    { categoryId, ...newDress }: CUDressDto,
  ): Promise<void> {
    if (!(await this.isDressExistForOwner(id, userId)))
      throw new NotFoundException('Không tìm thấy cáy cưới phù hợp');
    let dress;
    if (categoryId) {
      if (!(await this.isCategoryExistForOwner(categoryId, userId)))
        throw new NotFoundException('Không tìm thấy phân loại phù hợp');
      dress = { categoryId, ...newDress };
    } else {
      dress = { ...newDress };
    }
    await this.dressRepository.update({ id, user: { id: userId } }, dress);
  }

  async removeDressForOwner(userId: string, id: string): Promise<void> {
    if (!(await this.isDressExistForOwner(id, userId)))
      throw new NotFoundException('Không tìm thấy cáy cưới phù hợp');
    await this.dressRepository.softDelete({ id, user: { id: userId } });
  }

  async restoreDressForOwner(userId: string, id: string): Promise<void> {
    if (!(await this.isDressExistForOwner(id, userId)))
      throw new NotFoundException('Không tìm thấy cáy cưới phù hợp');
    await this.dressRepository.restore({ id, user: { id: userId } });
  }

  async getAll(): Promise<Dress[]> {
    return await this.dressRepository.find({ withDeleted: true });
  }

  async create(dress: Dress): Promise<Dress> {
    return await this.dressRepository.save(dress);
  }

  async isCategoryExistForOwner(id: string, userId: string): Promise<boolean> {
    return await this.categoryRepository.exists({
      where: { id, user: { id: userId } },
      withDeleted: true,
    });
  }

  async isDressExistForOwner(id: string, userId: string): Promise<boolean> {
    return await this.dressRepository.exists({
      where: { user: { id: userId }, id },
      withDeleted: true,
    });
  }
}
