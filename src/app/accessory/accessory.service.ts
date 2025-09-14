import { Filtering, getOrder, getWhere, Sorting } from '@/common/decorators';
import { Accessory, AccessoryStatus, Category, ShopStatus } from '@/common/models';
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
      user: { shop: { status: ShopStatus.ACTIVE } },
    };
    const existingAccessory = await this.accessoryRepository.findOne({
      where,
      relations: { feedbacks: { customer: true }, user: { shop: true }, category: true },
    });
    if (!existingAccessory) throw new NotFoundException('Không tìm thấy phụ kiện phù hợp');
    return existingAccessory;
  }

  async getAccessoriesForOwner(
    userId: string,
    take: number,
    skip: number,
    sort?: Sorting[],
    filter?: Filtering[],
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
        feedbacks: true,
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
        feedbacks: true,
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
    if (!(await this.isAccessoryExistForOwner(id, userId)))
      throw new NotFoundException('Không tìm thấy phụ kiện phù hợp');
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
    if (!(await this.isAccessoryExistForOwner(id, userId)))
      throw new NotFoundException('Không tìm thấy phụ kiện phù hợp');
    await this.accessoryRepository.softDelete({ id, user: { id: userId } });
  }

  async restoreAccessoryForOwner(userId: string, id: string): Promise<void> {
    if (!(await this.isAccessoryExistForOwner(id, userId)))
      throw new NotFoundException('Không tìm thấy phụ kiện phù hợp');
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

  async isAccessoryExistForOwner(id: string, userId: string): Promise<boolean> {
    return await this.accessoryRepository.exists({
      where: { id, user: { id: userId } },
      withDeleted: true,
    });
  }

  async getOneAccessoryByUserId(userId: string): Promise<Accessory | null> {
    return await this.accessoryRepository.findOne({
      where: { user: { id: userId } },
      withDeleted: true,
    });
  }

  async getAccessoryById(id: string): Promise<Accessory> {
    const accessory = await this.accessoryRepository.findOne({
      where: {
        id,
        status: AccessoryStatus.AVAILABLE,
      },
    });

    if (!accessory) throw new NotFoundException('Không tìm thấy phụ kiện');
    return accessory;
  }

  async getAllByUserIdForSeeding(userId: string): Promise<Accessory[]> {
    return await this.accessoryRepository.find({
      where: { user: { id: userId } },
      withDeleted: true,
    });
  }

  async updateAccessoryRatingForSeedingFeedback(id: string): Promise<void> {
    const accessory = await this.accessoryRepository.findOne({
      where: { id },
      relations: { feedbacks: true },
    });
    if (!accessory) throw new NotFoundException('Không tìm thấy phụ kiện này');

    const feedbacks = accessory.feedbacks ?? [];
    const ratingCount = feedbacks.length;
    const totalRating = feedbacks.reduce((acc, feedback) => acc + Number(feedback.rating ?? 0), 0);
    accessory.ratingAverage = ratingCount > 0 ? Number(totalRating) / Number(ratingCount) : 0;
    accessory.ratingCount = Number(ratingCount);

    await this.accessoryRepository.save(accessory);
  }

  async updateRating(
    id: string,
    rating: number,
    ratingCount: number,
    ratingAverage: number,
  ): Promise<void> {
    const ratingTotal = Number(ratingAverage) * Number(ratingCount);
    const newRatingCount = Number(ratingCount) + 1;
    const newRatingAverage = (ratingTotal + Number(rating)) / newRatingCount;

    await this.accessoryRepository.update(id, {
      ratingCount: newRatingCount,
      ratingAverage: newRatingAverage,
    });
  }
}
