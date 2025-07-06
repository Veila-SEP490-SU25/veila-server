import { Filtering, getOrder, getWhere, Sorting } from '@/common/decorators';
import { Accessory, AccessoryStatus, Category } from '@/common/models';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CUAccessoryDto } from '@/app/accessory/accessory.dto';

@Injectable()
export class AccessoryService {
  constructor(
    @InjectRepository(Accessory) private readonly accessoryRepository: Repository<Accessory>,
    @InjectRepository(Category) private readonly categoryRepository: Repository<Category>,
  ) {}

  async getAccessoryForCustomer(id: string): Promise<Accessory> {
    const where = {
      id,
      status: In([AccessoryStatus.AVAILABLE, AccessoryStatus.OUT_OF_STOCK]),
    };
    const existingAccessory = await this.accessoryRepository.findOne({ where });
    if (!existingAccessory) throw new NotFoundException('Không tìm thấy phụ kiện phù hợp');
    return existingAccessory;
  }

  async getAccessoriesForOwner(
    userId: string,
    take: number,
    skip: number,
    sort?: Sorting,
    filter?: Filtering,
  ): Promise<[Accessory[], number]> {
    const dynamicFilter = getWhere(filter);
    const where = {
      ...dynamicFilter,
      user: { id: userId },
    };
    const order = getOrder(sort);
    return await this.accessoryRepository.findAndCount({
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

  async getAccessoryForOwner(userId: string, id: string): Promise<Accessory> {
    const where = {
      user: { id: userId },
      id,
    };
    const existingAccessory = await this.accessoryRepository.findOne({
      where,
      withDeleted: true,
      relations: {
        category: true,
      },
    });
    if (!existingAccessory) throw new NotFoundException('Không tìm thấy phụ kiện phù hợp');
    return existingAccessory;
  }

  async createAccessoryForOwner(
    userId: string,
    { categoryId, ...newAccessory }: CUAccessoryDto,
  ): Promise<Accessory> {
    let accessory;
    if (categoryId) {
      if (!(await this.isCategoryExistForOwner(categoryId, userId)))
        throw new NotFoundException('Không tìm thấy phân loại phù hợp');
      accessory = { user: { id: userId }, category: { id: categoryId }, ...newAccessory };
    } else {
      accessory = { user: { id: userId }, ...newAccessory };
    }
    return await this.accessoryRepository.save(accessory);
  }

  async updateAccessoryForOwner(
    userId: string,
    id: string,
    { categoryId, ...body }: CUAccessoryDto,
  ): Promise<void> {
    let accessory;
    if (categoryId) {
      if (!(await this.isCategoryExistForOwner(categoryId, userId)))
        throw new NotFoundException('Không tìm thấy phân loại phù hợp');
      accessory = { category: { id: categoryId }, ...body };
    } else {
      accessory = { ...body };
    }
    await this.accessoryRepository.update({ id, user: { id: userId } }, accessory);
  }

  async removeAccessoryForOwner(userId: string, id: string): Promise<void> {
    await this.accessoryRepository.softDelete({ id, user: { id: userId } });
  }

  async restoreAccessoryForOwner(userId: string, id: string): Promise<void> {
    await this.accessoryRepository.restore({ id, user: { id: userId } });
  }

  async getAll(): Promise<Accessory[]> {
    return this.accessoryRepository.find({ withDeleted: true });
  }

  async create(accessory: Accessory): Promise<Accessory> {
    return this.accessoryRepository.save(accessory);
  }

  async isCategoryExistForOwner(id: string, userId: string): Promise<boolean> {
    return await this.categoryRepository.exists({
      where: { id, user: { id: userId } },
      withDeleted: true,
    });
  }
}
