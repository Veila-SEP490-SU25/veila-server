import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CategoryDto, ItemCategoryDto } from '@/app/category/category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Accessory, Category, CategoryType } from '@/common/models';
import { Repository } from 'typeorm';
import { ListResponse } from '@/common/base';
import { Filtering, getOrder, getWhere, Pagination, Sorting } from '@/common/decorators';
import { DressService, ListDressDto } from '@/app/dress';
import { ListServiceDto, ServiceService } from '@/app/service';
import { BlogService, ListBlogDto } from '@/app/blog';
import { AccessoryService } from '@/app/accessory';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category) private readonly categoryRepository: Repository<Category>,
    private readonly dressService: DressService,
    private readonly serviceService: ServiceService,
    private readonly blogService: BlogService,
    private readonly accessoryService: AccessoryService,
  ) {}

  async findCategoryForCustomer(id: string): Promise<ItemCategoryDto> {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) throw new NotFoundException('Không tìm thấy Category phù hợp');
    return category;
  }

  async findDressesForCustomer(
    id: string,
    { page, size, limit, offset }: Pagination,
    sort?: Sorting,
    filter?: Filtering,
  ): Promise<ListResponse<ListDressDto>> {
    const [dresses, totalItems] = await this.dressService.findAndCountOfCategoryForCustomer(
      id,
      limit,
      offset,
      sort,
      filter,
    );
    const totalPages = Math.ceil(totalItems / size);
    return {
      message: 'Đây là danh sách váy cưới khả dụng của mục phân loại',
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

  async findServicesForCustomer(
    id: string,
    { page, size, limit, offset }: Pagination,
    sort?: Sorting,
    filter?: Filtering,
  ): Promise<ListResponse<ListServiceDto>> {
    const [services, totalItems] = await this.serviceService.findAndCountOfCategoryForCustomer(
      id,
      limit,
      offset,
      sort,
      filter,
    );
    const totalPages = Math.ceil(totalItems / size);
    return {
      message: 'Đây là danh sách dịch vụ khả dụng của cửa hàng',
      statusCode: HttpStatus.OK,
      pageIndex: page,
      pageSize: size,
      totalItems,
      totalPages,
      hasNextPage: page + 1 < totalPages,
      hasPrevPage: 0 < page,
      items: { ...services },
    };
  }

  async findBlogsForCustomer(
    id: string,
    { page, size, limit, offset }: Pagination,
    sort?: Sorting,
    filter?: Filtering,
  ): Promise<ListResponse<ListBlogDto>> {
    const [blogs, totalItems] = await this.blogService.findAndCountOfCategoryForCustomer(
      id,
      limit,
      offset,
      sort,
      filter,
    );
    const totalPages = Math.ceil(totalItems / size);
    return {
      message: 'Đây là danh sách bài blog khả dụng của cửa hàng',
      statusCode: HttpStatus.OK,
      pageIndex: page,
      pageSize: size,
      totalItems,
      totalPages,
      hasNextPage: page + 1 < totalPages,
      hasPrevPage: 0 < page,
      items: { ...blogs },
    };
  }

  async getAccessoriesForCustomer(
    id: string,
    take: number,
    skip: number,
    sort?: Sorting,
    filter?: Filtering,
  ): Promise<[Accessory[], number]> {
    return await this.accessoryService.findAndCountOfCategoryForCustomer(
      id,
      take,
      skip,
      sort,
      filter,
    );
  }

  async createCategoryForOwner(userId: string, categoryDto: CategoryDto): Promise<Category> {
    const category = new Category();
    Object.assign(category, { user: { id: userId }, ...categoryDto });
    return await this.categoryRepository.save(category);
  }

  async findCategoriesForOwner(
    userId: string,
    { page, size, limit, offset }: Pagination,
    sort?: Sorting,
    filter?: Filtering,
  ): Promise<ListResponse<Category>> {
    const dynamicFilter = getWhere(filter);
    const where = {
      ...dynamicFilter,
      user: { id: userId },
    };
    const order = getOrder(sort);
    const [categories, totalItems] = await this.categoryRepository.findAndCount({
      where,
      order,
      take: limit,
      skip: offset,
      withDeleted: true,
    });
    const totalPages = Math.ceil(totalItems / size);
    return {
      message: 'Đây là danh sách các mục phân loại của bạn',
      statusCode: HttpStatus.OK,
      pageIndex: page,
      pageSize: size,
      totalItems,
      totalPages,
      hasNextPage: page + 1 < totalPages,
      hasPrevPage: 0 < page,
      items: categories,
    };
  }

  async findCategoryForOwner(userId: string, id: string): Promise<Category> {
    const where = { user: { id: userId }, id };
    const existingCategory = await this.categoryRepository.findOne({ where });
    if (!existingCategory) throw new NotFoundException('Không tìm thấy Category nào');
    return existingCategory;
  }

  async updateCategoryForOwner(userId: string, id: string, body: CategoryDto) {
    await this.findCategoryForOwner(userId, id);
    await this.categoryRepository.update(id, body);
  }

  async removeCategoryForOwner(userId: string, id: string) {
    await this.findCategoryForOwner(userId, id);
    await this.categoryRepository.softDelete(id);
  }

  async restoreCategoryForOwner(userId: string, id: string) {
    await this.findCategoryForOwner(userId, id);
    await this.categoryRepository.restore(id);
  }

  async findAndCountOfShopForCustomer(
    userId,
    limit: number,
    offset: number,
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
      take: limit,
      skip: offset,
    });
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
