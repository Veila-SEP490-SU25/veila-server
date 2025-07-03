import { Filtering, getOrder, getWhere, Sorting } from '@/common/decorators';
import { Accessory, AccessoryStatus } from '@/common/models';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CUAccessoryDto } from '@/app/accessory/accessory.dto';

@Injectable()
export class AccessoryService {
  constructor(
    @InjectRepository(Accessory) private readonly accessoryRepository: Repository<Accessory>,
  ) {}

  async getAccessoryForCustomer(id: string): Promise<Accessory> {
    const where = {
      id,
      status: AccessoryStatus.AVAILABLE,
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
    if (categoryId) {
      const accessory = {
        user: { id: userId },
        category: { id: categoryId },
        ...newAccessory,
      };
      return await this.accessoryRepository.save(accessory);
    } else {
      const accessory = {
        user: { id: userId },
        ...newAccessory,
      };
      return await this.accessoryRepository.save(accessory);
    }
  }

  async updateAccessoryForOwner(
    userId: string,
    id: string,
    { categoryId, ...body }: CUAccessoryDto,
  ): Promise<number | undefined> {
    if (categoryId) {
      const accessory = {
        category: { id: categoryId },
        ...body,
      };
      return (
        await this.accessoryRepository.update(
          {
            id,
            user: { id: userId },
          },
          accessory,
        )
      ).affected;
    } else {
      const accessory = {
        ...body,
      };
      return (
        await this.accessoryRepository.update(
          {
            id,
            user: { id: userId },
          },
          accessory,
        )
      ).affected;
    }
  }

  async removeAccessoryForOwner(userId: string, id: string): Promise<number | undefined> {
    return (await this.accessoryRepository.softDelete({ id, user: { id: userId } })).affected;
  }

  async restoreAccessoryForOwner(userId: string, id: string): Promise<number | undefined> {
    return (await this.accessoryRepository.restore({ id, user: { id: userId } })).affected;
  }

  async findAndCountOfCategoryForCustomer(
    categoryId: string,
    take: number,
    skip: number,
    sort?: Sorting,
    filter?: Filtering,
  ): Promise<[Accessory[], number]> {
    const dynamicFilter = getWhere(filter);
    const where = {
      ...dynamicFilter,
      category: { id: categoryId },
      status: AccessoryStatus.AVAILABLE,
    };
    const order = getOrder(sort);
    return await this.accessoryRepository.findAndCount({
      where,
      order,
      take,
      skip,
    });
  }

  async findAndCountOfShopForCustomer(
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
      status: AccessoryStatus.AVAILABLE,
    };
    const order = getOrder(sort);
    return await this.accessoryRepository.findAndCount({
      where,
      order,
      take,
      skip,
    });
  }
}
