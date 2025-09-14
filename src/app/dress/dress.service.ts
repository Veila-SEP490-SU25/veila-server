import { Filtering, getOrder, getWhere, Sorting } from '@/common/decorators';
import { Category, Dress, DressStatus, ShopStatus } from '@/common/models';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CUDressDto, ItemDressDto } from '@/app/dress/dress.dto';
import { UserService } from '@/app/user';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class DressService {
  constructor(
    @InjectRepository(Dress) private readonly dressRepository: Repository<Dress>,
    @InjectRepository(Category) private readonly categoryRepository: Repository<Category>,
    @Inject(UserService)
    private readonly userService: UserService,
  ) {}

  async getDressesForCustomer(
    take: number,
    skip: number,
    sort?: Sorting[],
    filter?: Filtering[],
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
      relations: { user: { shop: true }, category: true },
    });
  }

  async getDressForCustomer(userId: string, id: string): Promise<ItemDressDto> {
    const dress = await this.dressRepository.findOne({
      where: {
        id,
        status: DressStatus.AVAILABLE,
        user: { shop: { status: ShopStatus.ACTIVE } },
      },
      relations: {
        feedbacks: { customer: true },
        user: { shop: true },
        category: true,
      },
    });
    if (!dress) throw new NotFoundException('Không tìm thấy váy cưới nào phù hợp');
    if (userId) {
      const user = await this.userService.getSelf(userId);
      const isFavorite = user.favDresses ? user.favDresses.includes(id) : null;
      return plainToInstance(
        ItemDressDto,
        { ...dress, isFavorite },
        { excludeExtraneousValues: true },
      );
    }
    return plainToInstance(ItemDressDto, dress, { excludeExtraneousValues: true });
  }

  async getDressById(id: string): Promise<Dress> {
    const dress = await this.dressRepository.findOne({
      where: {
        id,
        status: DressStatus.AVAILABLE,
        user: { shop: { status: ShopStatus.ACTIVE } },
      },
      relations: {
        feedbacks: { customer: true },
        user: { shop: true },
        category: true,
      },
    });
    if (!dress) throw new NotFoundException('Không tìm thấy váy cưới');
    return dress;
  }

  async getOne(id: string): Promise<Dress> {
    const dress = await this.dressRepository.findOne({
      where: {
        id,
        status: DressStatus.AVAILABLE,
        user: { shop: { status: ShopStatus.ACTIVE } },
      },
      relations: {
        feedbacks: { customer: true },
        user: { shop: true },
        category: true,
      },
    });
    if (!dress) throw new NotFoundException('Không tìm thấy váy cưới nào phù hợp');
    return dress;
  }

  async getDressesForOwner(
    userId: string,
    take: number,
    skip: number,
    sort?: Sorting[],
    filter?: Filtering[],
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
      dress = { user: { id: userId }, category: { id: categoryId }, ...newDress } as Dress;
    } else {
      dress = { user: { id: userId }, ...newDress } as Dress;
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

  async getAllDressesByUserIdForSeeding(userId: string): Promise<Dress[]> {
    return await this.dressRepository.find({
      where: { user: { id: userId } },
      withDeleted: true,
    });
  }

  async updateDressRatingForSeedingFeedback(id: string): Promise<void> {
    const dress = await this.dressRepository.findOne({
      where: { id },
      relations: { feedbacks: true },
    });
    if (!dress) throw new NotFoundException('Không tìm thấy váy cưới này');

    const feedbacks = dress.feedbacks ?? [];
    const ratingCount = feedbacks.length;
    const totalRating = feedbacks.reduce((sum, feedback) => sum + Number(feedback.rating ?? 0), 0);
    const ratingAverage = ratingCount > 0 ? Number(totalRating) / Number(ratingCount) : 0;

    await this.dressRepository.update({ id }, { ratingAverage, ratingCount } as Dress);
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

    await this.dressRepository.update(id, {
      ratingCount: newRatingCount,
      ratingAverage: newRatingAverage,
    });
  }

  async addFavorite(userId: string, id: string): Promise<void> {
    const dress = await this.dressRepository.findOne({
      where: {
        id,
        status: DressStatus.AVAILABLE,
        user: { shop: { status: ShopStatus.ACTIVE } },
      },
    });
    if (!dress) throw new NotFoundException('Không tìm thấy váy cưới này');

    const user = await this.userService.getSelf(userId);
    let favDresses = user.favDresses;
    if (!favDresses) favDresses = [];
    if (favDresses.includes(dress.id)) return; // Already a favorite
    // Add to favorites
    favDresses.push(dress.id);
    await this.userService.updateFavDresses(user.id, favDresses);
  }

  async getFavorite(
    userId: string,
    take: number,
    skip: number,
    sort?: Sorting[],
    filter?: Filtering[],
  ): Promise<[Dress[], number]> {
    const user = await this.userService.getSelf(userId);
    if (!user.favDresses || user.favDresses.length === 0) {
      return [[], 0];
    }
    const dynamicFilter = getWhere(filter);
    const where = {
      ...dynamicFilter,
      id: In(user.favDresses),
      status: In([DressStatus.AVAILABLE, DressStatus.OUT_OF_STOCK]),
      user: { shop: { status: ShopStatus.ACTIVE } },
    };
    const order = getOrder(sort);
    return await this.dressRepository.findAndCount({
      where,
      order,
      take,
      skip,
      relations: { user: { shop: true }, category: true },
    });
  }

  async removeFavorite(userId: string, dressId: string): Promise<void> {
    const user = await this.userService.getSelf(userId);
    if (!user.favDresses || user.favDresses.length === 0) {
      return;
    }
    const updatedFavDresses = user.favDresses.filter((id) => id !== dressId);
    await this.userService.updateFavDresses(user.id, updatedFavDresses);
  }
}
