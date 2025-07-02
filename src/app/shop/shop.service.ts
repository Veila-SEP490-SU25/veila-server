import { ListResponse } from '@/common/base';
import { Filtering, getOrder, getWhere, Pagination, Sorting } from '@/common/decorators';
import { Shop, ShopStatus } from '@/common/models';
import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ItemShopDto, ListShopDto } from '@/app/shop/shop.dto';
import { DressService, ListDressDto } from '@/app/dress';
import { ListServiceDto, ServiceService } from '@/app/service';
import { BlogService, ListBlogDto } from '@/app/blog';
import { CategoryService, ListCategoryDto } from '@/app/category';

@Injectable()
export class ShopService {
  constructor(
    @InjectRepository(Shop) private readonly shopRepository: Repository<Shop>,
    private readonly dressService: DressService,
    private readonly serviceService: ServiceService,
    private readonly blogService: BlogService,
    private readonly categoryService: CategoryService,
  ) {}

  async getShopsForCustomer(
    { page, size, limit, offset }: Pagination,
    sort?: Sorting,
    filter?: Filtering,
  ): Promise<ListResponse<ListShopDto>> {
    const dynamicFilter = getWhere(filter);
    const where = {
      ...dynamicFilter,
      status: ShopStatus.ACTIVE,
    };
    const order = getOrder(sort);

    const [shops, totalItems] = await this.shopRepository.findAndCount({
      where,
      order,
      take: limit,
      skip: offset,
    });
    const totalPages = Math.ceil(totalItems / size);
    return {
      message: 'Đây là danh sách các shop khả dụng',
      statusCode: HttpStatus.OK,
      pageIndex: page,
      pageSize: size,
      totalItems,
      totalPages,
      hasNextPage: page + 1 < totalPages,
      hasPrevPage: 0 < page,
      items: shops,
    };
  }

  async getShopForCustomer(id: string): Promise<ItemShopDto> {
    const where = {
      id,
      status: ShopStatus.ACTIVE,
    };
    const existingShop = await this.shopRepository.findOneBy(where);
    if (!existingShop) throw new NotFoundException('Không tìm thấy cửa hàng phù hợp');
    return { ...existingShop };
  }

  async getDressesForCustomer(
    id: string,
    { page, size, limit, offset }: Pagination,
    sort?: Sorting,
    filter?: Filtering,
  ): Promise<ListResponse<ListDressDto>> {
    const existingShop = await this.getShopWithUserWithoutDeletedById(id);
    const [dresses, totalItems] = await this.dressService.findAndCountOfShopForCustomer(
      existingShop.user.id,
      limit,
      offset,
      sort,
      filter,
    );
    const totalPages = Math.ceil(totalItems / size);
    return {
      message: 'Đây là danh sách váy cưới khả dụng của cửa hàng',
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

  async getServicesForCustomer(
    id: string,
    { page, size, limit, offset }: Pagination,
    sort?: Sorting,
    filter?: Filtering,
  ): Promise<ListResponse<ListServiceDto>> {
    const existingShop = await this.getShopWithUserWithoutDeletedById(id);
    const [services, totalItems] = await this.serviceService.findAndCountOfShopForCustomer(
      existingShop.user.id,
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

  async getBlogsForCustomer(
    id: string,
    { page, size, limit, offset }: Pagination,
    sort?: Sorting,
    filter?: Filtering,
  ): Promise<ListResponse<ListBlogDto>> {
    const existingShop = await this.getShopWithUserWithoutDeletedById(id);
    const [blogs, totalItems] = await this.blogService.findAndCountOfShopForCustomer(
      existingShop.user.id,
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

  async getCategoriesForCustomer(
    id: string,
    { page, size, limit, offset }: Pagination,
    sort?: Sorting,
    filter?: Filtering,
  ): Promise<ListResponse<ListCategoryDto>> {
    const existingShop = await this.getShopWithUserWithoutDeletedById(id);
    const [categories, totalItems] = await this.categoryService.findAndCountOfShopForCustomer(
      existingShop.user.id,
      limit,
      offset,
      sort,
      filter,
    );
    const totalPages = Math.ceil(totalItems / size);
    return {
      message: 'Đây là danh sách mục phân loại category khả dụng của cửa hàng',
      statusCode: HttpStatus.OK,
      pageIndex: page,
      pageSize: size,
      totalItems,
      totalPages,
      hasNextPage: page + 1 < totalPages,
      hasPrevPage: 0 < page,
      items: { ...categories },
    };
  }

  async getShopsForOwner(
    userId: string,
    { page, size, limit, offset }: Pagination,
    sort?: Sorting,
    filter?: Filtering,
  ): Promise<ListResponse<Shop>> {
    const dynamicFilter = getWhere(filter);
    const where = {
      ...dynamicFilter,
      user: { id: userId },
    };
    const order = getOrder(sort);

    const [shops, totalItems] = await this.shopRepository.findAndCount({
      where,
      order,
      take: limit,
      skip: offset,
      withDeleted: true,
    });
    const totalPages = Math.ceil(totalItems / size);
    return {
      message: 'Đây là danh sách các shop của bạn',
      statusCode: HttpStatus.OK,
      pageIndex: page,
      pageSize: size,
      totalItems,
      totalPages,
      hasNextPage: page + 1 < totalPages,
      hasPrevPage: 0 < page,
      items: shops,
    };
  }

  async getShopForOwner(userId: string, id: string): Promise<ItemShopDto> {
    const where = {
      id,
      user: { id: userId },
    };
    const existingShop = await this.shopRepository.findOne({
      where,
      withDeleted: true,
    });
    if (!existingShop) throw new NotFoundException('Không tìm thấy cửa hàng phù hợp');
    return { ...existingShop };
  }

  async getShopWithUserWithoutDeletedById(id: string): Promise<Shop> {
    const existingShop = await this.shopRepository.findOne({
      where: { id },
      relations: { user: true },
    });
    if (!existingShop) throw new NotFoundException('Không tìm thấy cửa hàng phù hợp');
    return existingShop;
  }
}
