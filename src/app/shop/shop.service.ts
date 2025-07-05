import { Filtering, getOrder, getWhere, Sorting } from '@/common/decorators';
import {
  Accessory,
  AccessoryStatus,
  Blog,
  BlogStatus,
  Category,
  Dress,
  DressStatus,
  Service,
  ServiceStatus,
  Shop,
  ShopStatus,
} from '@/common/models';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

@Injectable()
export class ShopService {
  constructor(
    @InjectRepository(Shop) private readonly shopRepository: Repository<Shop>,
    @InjectRepository(Shop) private readonly accessoryRepository: Repository<Accessory>,
    @InjectRepository(Shop) private readonly blogRepository: Repository<Blog>,
    @InjectRepository(Shop) private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Shop) private readonly dressRepository: Repository<Dress>,
    @InjectRepository(Shop) private readonly serviceRepository: Repository<Service>,
  ) {}

  async getShopsForCustomer(
    take: number,
    skip: number,
    sort?: Sorting,
    filter?: Filtering,
  ): Promise<[Shop[], number]> {
    const dynamicFilter = getWhere(filter);
    const where = {
      ...dynamicFilter,
      status: ShopStatus.ACTIVE,
      isVerified: true,
    };
    const order = getOrder(sort);

    return await this.shopRepository.findAndCount({
      where,
      order,
      take,
      skip,
    });
  }

  async getShopForCustomer(id: string): Promise<Shop> {
    const where = {
      id,
      status: ShopStatus.ACTIVE,
      isVerified: true,
    };
    const existingShop = await this.shopRepository.findOneBy(where);
    if (!existingShop) throw new NotFoundException('Không tìm thấy cửa hàng phù hợp');
    return existingShop;
  }

  async getDressesForCustomer(
    id: string,
    take: number,
    skip: number,
    sort?: Sorting,
    filter?: Filtering,
  ): Promise<[Dress[], number]> {
    const existingShop = await this.getShopWithUserWithoutDeletedById(id);
    const dynamicFilter = getWhere(filter);
    const where = {
      ...dynamicFilter,
      user: { id: existingShop.user.id },
      status: In([DressStatus.AVAILABLE, DressStatus.OUT_OF_STOCK]),
    };
    const order = getOrder(sort);
    return await this.dressRepository.findAndCount({
      where,
      order,
      take,
      skip,
    });
  }

  async getAccessoriesForCustomer(
    id: string,
    take: number,
    skip: number,
    sort?: Sorting,
    filter?: Filtering,
  ): Promise<[Accessory[], number]> {
    const existingShop = await this.getShopWithUserWithoutDeletedById(id);
    const dynamicFilter = getWhere(filter);
    const where = {
      ...dynamicFilter,
      user: { id: existingShop.user.id },
      status: In([AccessoryStatus.OUT_OF_STOCK, AccessoryStatus.AVAILABLE]),
    };
    const order = getOrder(sort);
    return await this.accessoryRepository.findAndCount({
      where,
      order,
      take,
      skip,
    });
  }

  async getServicesForCustomer(
    id: string,
    take: number,
    skip: number,
    sort?: Sorting,
    filter?: Filtering,
  ): Promise<[Service[], number]> {
    const existingShop = await this.getShopWithUserWithoutDeletedById(id);
    const dynamicFilter = getWhere(filter);
    const where = {
      ...dynamicFilter,
      user: { id: existingShop.user.id },
      status: ServiceStatus.ACTIVE,
    };
    const order = getOrder(sort);
    return await this.serviceRepository.findAndCount({
      where,
      order,
      take,
      skip,
    });
  }

  async getBlogsForCustomer(
    id: string,
    take: number,
    skip: number,
    sort?: Sorting,
    filter?: Filtering,
  ): Promise<[Blog[], number]> {
    const existingShop = await this.getShopWithUserWithoutDeletedById(id);
    const dynamicFilter = getWhere(filter);
    const where = {
      ...dynamicFilter,
      user: { id: existingShop.user.id },
      isVerified: true,
      status: BlogStatus.PUBLISHED,
    };
    const order = getOrder(sort);
    return await this.blogRepository.findAndCount({
      where,
      order,
      take,
      skip,
    });
  }

  async getCategoriesForCustomer(
    id: string,
    take: number,
    skip: number,
    sort?: Sorting,
    filter?: Filtering,
  ): Promise<[Category[], number]> {
    const existingShop = await this.getShopWithUserWithoutDeletedById(id);
    const dynamicFilter = getWhere(filter);
    const where = {
      ...dynamicFilter,
      user: { id: existingShop.user.id },
    };
    const order = getOrder(sort);
    return await this.categoryRepository.findAndCount({
      where,
      order,
      take,
      skip,
    });
  }

  async getShopsForOwner(
    userId: string,
    take: number,
    skip: number,
    sort?: Sorting,
    filter?: Filtering,
  ): Promise<[Shop[], number]> {
    const dynamicFilter = getWhere(filter);
    const where = {
      ...dynamicFilter,
      user: { id: userId },
    };
    const order = getOrder(sort);
    return await this.shopRepository.findAndCount({
      where,
      order,
      take,
      skip,
      withDeleted: true,
    });
  }

  async getShopForOwner(userId: string, id: string): Promise<Shop> {
    const where = {
      id,
      user: { id: userId },
    };
    const existingShop = await this.shopRepository.findOne({
      where,
      withDeleted: true,
    });
    if (!existingShop) throw new NotFoundException('Không tìm thấy cửa hàng phù hợp');
    return existingShop;
  }

  async getShopWithUserWithoutDeletedById(id: string): Promise<Shop> {
    const existingShop = await this.shopRepository.findOne({
      where: { id },
      relations: { user: true },
    });
    if (!existingShop) throw new NotFoundException('Không tìm thấy cửa hàng phù hợp');
    return existingShop;
  }

  async create(shop: Shop): Promise<Shop> {
    return await this.shopRepository.save(shop);
  }

  async getAll(): Promise<Shop[]> {
    return await this.shopRepository.find({ withDeleted: true });
  }
}
