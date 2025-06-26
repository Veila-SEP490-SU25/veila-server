import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CategoryDto } from '@/app/category/category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '@/common/models';
import { Repository } from 'typeorm';
import { ListResponse } from '@/common/base';
import { Filtering, getOrder, getWhere, Pagination, Sorting } from '@/common/decorators';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category) private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(userId: string, categoryDto: CategoryDto): Promise<Category> {
    const category = new Category();
    Object.assign(category, { user: { id: userId }, ...categoryDto });
    return await this.categoryRepository.save(category);
  }

  async findAll(
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

  async findOne(userId: string, id: string): Promise<Category> {
    const where = { user: { id: userId }, id };
    const existingCategory = await this.categoryRepository.findOne({ where });
    if (!existingCategory) throw new NotFoundException('Không tìm thấy Category nào');
    return existingCategory;
  }

  async update(userId: string, id: string, body: CategoryDto) {
    await this.findOne(userId, id);
    await this.categoryRepository.update(id, body);
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    await this.categoryRepository.softDelete(id);
  }

  async restore(userId: string, id: string) {
    await this.findOne(userId, id);
    await this.categoryRepository.restore(id);
  }
}
