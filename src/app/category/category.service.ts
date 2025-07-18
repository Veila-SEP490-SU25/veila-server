import { Injectable, NotFoundException } from '@nestjs/common';
import { CUCategoryDto } from '@/app/category/category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Accessory,
  AccessoryStatus,
  Blog,
  BlogStatus,
  Category,
  CategoryType,
  Dress,
  DressStatus,
  Service,
  ServiceStatus,
} from '@/common/models';
import { Repository } from 'typeorm';
import { Filtering, getOrder, getWhere, Sorting } from '@/common/decorators';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category) private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Accessory) private readonly accessoryRepository: Repository<Accessory>,
    @InjectRepository(Blog) private readonly blogRepository: Repository<Blog>,
    @InjectRepository(Dress) private readonly dressRepository: Repository<Dress>,
    @InjectRepository(Service) private readonly serviceRepository: Repository<Service>,
  ) {}

  async findCategoryForCustomer(id: string): Promise<Category> {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) throw new NotFoundException('Không tìm thấy Category phù hợp');
    return category;
  }

  async findDressesForCustomer(
    id: string,
    take: number,
    skip: number,
    sort?: Sorting,
    filter?: Filtering,
  ): Promise<[Dress[], number]> {
    const dynamicFilter = getWhere(filter);
    const where = {
      ...dynamicFilter,
      category: { id },
      status: DressStatus.AVAILABLE,
    };
    const order = getOrder(sort);
    return await this.dressRepository.findAndCount({
      where,
      order,
      take,
      skip,
    });
  }

  async findServicesForCustomer(
    id: string,
    take: number,
    skip: number,
    sort?: Sorting,
    filter?: Filtering,
  ): Promise<[Service[], number]> {
    const dynamicFilter = getWhere(filter);
    const where = {
      ...dynamicFilter,
      category: { id },
      status: ServiceStatus.AVAILABLE,
    };
    const order = getOrder(sort);
    return await this.serviceRepository.findAndCount({
      where,
      order,
      take,
      skip,
    });
  }

  async findBlogsForCustomer(
    id: string,
    take: number,
    skip: number,
    sort?: Sorting,
    filter?: Filtering,
  ): Promise<[Blog[], number]> {
    const dynamicFilter = getWhere(filter);
    const where = {
      ...dynamicFilter,
      category: { id },
      status: BlogStatus.PUBLISHED,
      isVerified: true,
    };
    const order = getOrder(sort);
    return await this.blogRepository.findAndCount({
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
    const dynamicFilter = getWhere(filter);
    const where = {
      ...dynamicFilter,
      category: { id },
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

  async createCategoryForOwner(userId: string, categoryDto: CUCategoryDto): Promise<Category> {
    const category = { user: { id: userId }, ...categoryDto };
    return await this.categoryRepository.save(category);
  }

  async findCategoriesForOwner(
    userId: string,
    take: number,
    skip: number,
    sort?: Sorting,
    filter?: Filtering,
  ): Promise<[Category[], number]> {
    const dynamicFilter = getWhere(filter);
    const where = {
      ...dynamicFilter,
      user: { id: userId },
    };
    const order = getOrder(sort);
    return await this.categoryRepository.findAndCount({
      where,
      order,
      take,
      skip,
      withDeleted: true,
    });
  }

  async findCategoryForOwner(userId: string, id: string): Promise<Category> {
    const where = { user: { id: userId }, id };
    const existingCategory = await this.categoryRepository.findOne({ where, withDeleted: true });
    if (!existingCategory) throw new NotFoundException('Không tìm thấy Category nào');
    return existingCategory;
  }

  async updateCategoryForOwner(userId: string, id: string, body: CUCategoryDto): Promise<void> {
    await this.findCategoryForOwner(userId, id);
    await this.categoryRepository.update({ id, user: { id: userId } }, body);
  }

  async removeCategoryForOwner(userId: string, id: string): Promise<void> {
    await this.findCategoryForOwner(userId, id);
    await this.categoryRepository.softDelete({ id, user: { id: userId } });
  }

  async restoreCategoryForOwner(userId: string, id: string): Promise<void> {
    await this.findCategoryForOwner(userId, id);
    await this.categoryRepository.restore({ id, user: { id: userId } });
  }

  async getAll(): Promise<Category[]> {
    return this.categoryRepository.find({ withDeleted: true });
  }
  async create(category: Category): Promise<Category> {
    return this.categoryRepository.save(category);
  }
  async getOneByUserAndType(userId: string, type: CategoryType): Promise<Category | null> {
    return this.categoryRepository.findOneBy({ user: { id: userId }, type });
  }
}
