import { Filtering, getOrder, getWhere, Sorting } from '@/common/decorators';
import { Blog, BlogStatus } from '@/common/models';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CUBlogDto } from './blog.dto';

@Injectable()
export class BlogService {
  constructor(@InjectRepository(Blog) private readonly blogRepository: Repository<Blog>) {}

  async getBlogsForCustomer(
    take: number,
    skip: number,
    sort?: Sorting,
    filter?: Filtering,
  ): Promise<[Blog[], number]> {
    const dynamicFilter = getWhere(filter);
    const where = {
      ...dynamicFilter,
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

  async getBlogForCustomer(id: string): Promise<Blog> {
    const where = {
      id,
      status: BlogStatus.PUBLISHED,
      isVerified: true,
    };
    const blog = await this.blogRepository.findOne({
      where,
    });
    if (!blog) throw new NotFoundException('Không tìm thấy bài blog phù hợp');
    return blog;
  }

  async getBlogsForOwner(
    userId: string,
    take: number,
    skip: number,
    sort?: Sorting,
    filter?: Filtering,
  ): Promise<[Blog[], number]> {
    const dynamicFilter = getWhere(filter);
    const where = {
      ...dynamicFilter,
      user: { id: userId },
    };
    const order = getOrder(sort);
    return await this.blogRepository.findAndCount({
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

  async getBlogForOwner(userId: string, id: string): Promise<Blog> {
    const where = {
      user: { id: userId },
      id,
    };
    const blog = await this.blogRepository.findOne({
      where,
      withDeleted: true,
      relations: {
        category: true,
      },
    });
    if (!blog) throw new NotFoundException('Không tìm thấy bài blog phù hợp');
    return blog;
  }

  async createBlogForOwner(userId: string, { categoryId, ...body }: CUBlogDto): Promise<Blog> {
    let blog;
    if (categoryId)
      blog = {
        user: { id: userId },
        category: { id: categoryId },
        ...body,
      };
    else
      blog = {
        user: { id: userId },
        ...body,
      };
    return await this.blogRepository.save(blog);
  }

  async updateBlogForOwner(
    userId: string,
    id: string,
    { categoryId, ...body }: CUBlogDto,
  ): Promise<void> {
    let blog;
    if (categoryId)
      blog = {
        category: { id: categoryId },
        ...body,
      };
    else
      blog = {
        ...body,
      };
    const result = await this.blogRepository.update(
      {
        user: { id: userId },
        id,
      },
      blog,
    );
    if (result.affected !== 1)
      throw new BadRequestException('Cập nhật không thành công, kiểm tra lỗi');
  }

  async removeBlogForOwner(userId: string, id: string): Promise<void> {
    const result = await this.blogRepository.softDelete({
      user: { id: userId },
      id,
    });
    if (result.affected !== 1) throw new BadRequestException('Xóa không thành công,kiểm tra lỗi');
  }

  async restoreBlogForOwner(userId: string, id: string): Promise<void> {
    const result = await this.blogRepository.restore({
      user: { id: userId },
      id,
    });
    if (result.affected !== 1)
      throw new BadRequestException('Khôi phục không thành công,kiểm tra lỗi');
  }

  async findAndCountOfShopForCustomer(
    userId,
    limit: number,
    offset: number,
    sort?: Sorting,
    filter?: Filtering,
  ): Promise<[Blog[], number]> {
    const dynamicFilter = getWhere(filter);
    const where = {
      ...dynamicFilter,
      user: { id: userId },
      status: BlogStatus.PUBLISHED,
    };
    const order = getOrder(sort);
    return await this.blogRepository.findAndCount({
      where,
      order,
      take: limit,
      skip: offset,
    });
  }

  async findAndCountOfCategoryForCustomer(
    categoryId: string,
    limit: number,
    offset: number,
    sort?: Sorting,
    filter?: Filtering,
  ): Promise<[Blog[], number]> {
    const dynamicFilter = getWhere(filter);
    const where = {
      ...dynamicFilter,
      category: { id: categoryId },
      status: BlogStatus.PUBLISHED,
      isVerified: true,
    };
    const order = getOrder(sort);
    return await this.blogRepository.findAndCount({
      where,
      order,
      take: limit,
      skip: offset,
    });
  }
}
