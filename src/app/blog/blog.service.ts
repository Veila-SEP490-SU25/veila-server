import { Filtering, getOrder, getWhere, Sorting } from '@/common/decorators';
import { Blog, BlogStatus, Category, ShopStatus, UserRole } from '@/common/models';
import { Injectable, MethodNotAllowedException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CUBlogDto, VerifyBlogDto } from './blog.dto';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog) private readonly blogRepository: Repository<Blog>,
    @InjectRepository(Category) private readonly categoryRepository: Repository<Category>,
  ) {}

  async getBlogs(
    currentRole: UserRole,
    take: number,
    skip: number,
    sort?: Sorting,
    filter?: Filtering,
  ): Promise<[Blog[], number]> {
    if (!currentRole || currentRole === UserRole.CUSTOMER) {
      const dynamicFilter = getWhere(filter);
      const where = {
        ...dynamicFilter,
        isVerified: true,
        status: BlogStatus.PUBLISHED,
        user: { shop: { status: ShopStatus.ACTIVE } },
      };
      const order = getOrder(sort);
      return await this.blogRepository.findAndCount({
        where,
        order,
        take,
        skip,
        relations: {
          user: { shop: true },
          category: true,
        },
      });
    } else {
      const dynamicFilter = getWhere(filter);
      const where = {
        ...dynamicFilter,
        status: BlogStatus.PUBLISHED,
      };
      const order = getOrder(sort);
      return await this.blogRepository.findAndCount({
        where,
        order,
        take,
        skip,
        relations: {
          user: { shop: true },
          category: true,
        },
      });
    }
  }

  async getBlog(currentRole: UserRole, id: string): Promise<Blog> {
    if (!currentRole || currentRole === UserRole.CUSTOMER) {
      const where = {
        id,
        status: BlogStatus.PUBLISHED,
        isVerified: true,
        user: { shop: { status: ShopStatus.ACTIVE } },
      };
      const blog = await this.blogRepository.findOne({
        where,
        relations: { category: true, user: { shop: true } },
      });
      if (!blog) throw new NotFoundException('Không tìm thấy bài blog phù hợp');
      return blog;
    } else {
      const where = {
        id,
      };
      const blog = await this.blogRepository.findOne({
        where,
        relations: { category: true, user: { shop: true } },
      });
      if (!blog) throw new NotFoundException('Không tìm thấy bài blog phù hợp');
      return blog;
    }
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
      relations: {
        category: true,
      },
    });
    if (!blog) throw new NotFoundException('Không tìm thấy bài blog phù hợp');
    return blog;
  }

  async createBlogForOwner(userId: string, { categoryId, ...body }: CUBlogDto): Promise<Blog> {
    let blog;
    if (body.status === BlogStatus.UNPUBLISHED)
      throw new MethodNotAllowedException('Không thể tạo blog với trạng thái không xuất bản');
    if (categoryId) {
      if (!(await this.isCategoryExistForOwner(categoryId, userId)))
        throw new NotFoundException('Không tìm thấy phân loại phù hợp');
      blog = { user: { id: userId }, category: { id: categoryId }, ...body };
    } else blog = { user: { id: userId }, ...body };
    return await this.blogRepository.save(blog);
  }

  async updateBlogForOwner(
    userId: string,
    id: string,
    { categoryId, ...body }: CUBlogDto,
  ): Promise<void> {
    if (!(await this.isBlogExistForOwner(id, userId)))
      throw new NotFoundException('Không tìm thấy bài blog phù hợp');
    let blog;
    if (body.status === BlogStatus.UNPUBLISHED)
      throw new MethodNotAllowedException('Không thể tạo blog với trạng thái không xuất bản');
    if (categoryId) {
      if (!(await this.isCategoryExistForOwner(categoryId, userId)))
        throw new NotFoundException('Không tìm thấy phân loại phù hợp');
      blog = { category: { id: categoryId }, ...body };
    } else blog = { ...body };
    await this.blogRepository.update({ user: { id: userId }, id }, blog);
  }

  async removeBlogForOwner(userId: string, id: string): Promise<void> {
    if (!(await this.isBlogExistForOwner(id, userId)))
      throw new NotFoundException('Không tìm thấy bài blog phù hợp');
    await this.blogRepository.softDelete({ user: { id: userId }, id });
  }

  async restoreBlogForOwner(userId: string, id: string): Promise<void> {
    if (!(await this.isBlogExistForOwner(id, userId)))
      throw new NotFoundException('Không tìm thấy bài blog phù hợp');
    await this.blogRepository.restore({ user: { id: userId }, id });
  }

  async create(blog: Blog): Promise<Blog> {
    return await this.blogRepository.save(blog);
  }

  async getAll(): Promise<Blog[]> {
    return await this.blogRepository.find({ withDeleted: true });
  }

  async isCategoryExistForOwner(id: string, userId: string): Promise<boolean> {
    return await this.categoryRepository.exists({
      where: { id, user: { id: userId } },
      withDeleted: true,
    });
  }

  async isBlogExistForOwner(id: string, userId: string): Promise<boolean> {
    return await this.blogRepository.exists({
      where: { id, user: { id: userId } },
      withDeleted: true,
    });
  }

  async verifyBlog(id: string, body: VerifyBlogDto): Promise<Blog> {
    const blog = await this.blogRepository.findOneBy({
      id,
      status: BlogStatus.PUBLISHED,
      isVerified: false,
    });
    if (!blog) throw new NotFoundException('Không tìm thấy bài blog phù hợp');
    if (body.isVerified === false) blog.status = BlogStatus.UNPUBLISHED;
    else blog.isVerified = true;
    await this.blogRepository.save(blog);
    return blog;
  }
}
