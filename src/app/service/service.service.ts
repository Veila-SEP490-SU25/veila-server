import { Filtering, getOrder, getWhere, Sorting } from '@/common/decorators';
import { Category, Service, ServiceStatus, ShopStatus } from '@/common/models';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CUServiceDto } from '@/app/service/service.dto';

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(Service) private readonly serviceRepository: Repository<Service>,
    @InjectRepository(Category) private readonly categoryRepository: Repository<Category>,
  ) {}

  async getServicesForCustomer(
    take: number,
    skip: number,
    sort?: Sorting[],
    filter?: Filtering[],
  ): Promise<[Service[], number]> {
    const dynamicFilter = getWhere(filter);
    const where = {
      ...dynamicFilter,
      status: ServiceStatus.AVAILABLE,
      user: { shop: { status: ShopStatus.ACTIVE } },
    };
    const order = getOrder(sort);
    return await this.serviceRepository.findAndCount({
      where,
      order,
      take,
      skip,
      relations: { user: { shop: true }, category: true },
    });
  }

  async getServiceForCustomer(id: string): Promise<Service> {
    const where = {
      id,
      status: ServiceStatus.AVAILABLE,
      user: { shop: { status: ShopStatus.ACTIVE } },
    };
    const existingService = await this.serviceRepository.findOne({
      where,
      relations: {
        feedbacks: { customer: true },
        user: { shop: true },
        category: true,
      },
    });
    if (!existingService) throw new NotFoundException('Không tìm thấy dịch vụ phù hợp');
    return existingService;
  }

  async getServicesForOwner(
    userId: string,
    take: number,
    skip: number,
    sort?: Sorting[],
    filter?: Filtering[],
  ): Promise<[Service[], number]> {
    const dynamicFilter = getWhere(filter);
    const where = {
      ...dynamicFilter,
      user: { id: userId },
    };
    const order = getOrder(sort);
    return await this.serviceRepository.findAndCount({
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

  async getServiceForOwner(userId: string, id: string): Promise<Service> {
    const where = {
      user: { id: userId },
      id,
    };
    const existingService = await this.serviceRepository.findOne({
      where,
      withDeleted: true,
      relations: {
        category: true,
        feedbacks: true,
      },
    });
    if (!existingService) throw new NotFoundException('Không tìm thấy dịch vụ phù hợp');
    return existingService;
  }

  async createServiceForOwner(
    userId: string,
    { categoryId, ...body }: CUServiceDto,
  ): Promise<Service> {
    const existingService = await this.serviceRepository.findOne({
      where: { user: { id: userId } },
      withDeleted: true,
    });
    if (existingService) throw new NotFoundException('Chủ cửa hàng chỉ được tạo một dịch vụ');
    let service;
    if (categoryId) {
      if (!(await this.isCategoryExistForOwner(categoryId, userId)))
        throw new NotFoundException('Không tìm thấy phân loại phù hợp');
      service = { user: { id: userId }, category: { id: categoryId }, ...body };
    } else {
      service = { user: { id: userId }, ...body };
    }
    return await this.serviceRepository.save(service);
  }

  async updateServiceForOwner(
    userId: string,
    id: string,
    { categoryId, ...body }: CUServiceDto,
  ): Promise<void> {
    if (!(await this.isServiceExistForOwner(id, userId)))
      throw new NotFoundException('Không tìm thấy dịch vụ phù hợp');
    let service;
    if (categoryId) {
      if (!(await this.isCategoryExistForOwner(categoryId, userId)))
        throw new NotFoundException('Không tìm thấy phân loại phù hợp');
      service = { category: { id: categoryId }, ...body };
    } else service = body;
    await this.serviceRepository.update({ id, user: { id: userId } }, service);
  }

  async removeServiceForOwner(userId: string, id: string): Promise<void> {
    if (!(await this.isServiceExistForOwner(id, userId)))
      throw new NotFoundException('Không tìm thấy dịch vụ phù hợp');
    await this.serviceRepository.softDelete({ id, user: { id: userId } });
  }

  async restoreServiceForOwner(userId: string, id: string): Promise<void> {
    if (!(await this.isServiceExistForOwner(id, userId)))
      throw new NotFoundException('Không tìm thấy dịch vụ phù hợp');
    await this.serviceRepository.restore({ id, user: { id: userId } });
  }

  async getAll(): Promise<Service[]> {
    return await this.serviceRepository.find({ withDeleted: true });
  }

  async create(service: Service): Promise<Service> {
    return await this.serviceRepository.save(service);
  }

  async isCategoryExistForOwner(id: string, userId: string): Promise<boolean> {
    return await this.categoryRepository.exists({
      where: { id, user: { id: userId } },
      withDeleted: true,
    });
  }

  async isServiceExistForOwner(id: string, userId: string): Promise<boolean> {
    return await this.serviceRepository.exists({
      where: { id, user: { id: userId } },
      withDeleted: true,
    });
  }

  async getServiceForOrderCustom(userId: string): Promise<Service> {
    const service = await this.serviceRepository.findOne({
      where: {
        user: { id: userId },
        status: ServiceStatus.AVAILABLE,
      },
      relations: {
        user: { shop: true },
      },
    });
    if (!service) throw new NotFoundException(`Service with userId ${userId} not found`);
    return service;
  }

  async getServiceByUserIdForSeeding(userId: string): Promise<Service | null> {
    return await this.serviceRepository.findOne({
      where: { user: { id: userId } },
      withDeleted: true,
    });
  }

  async updateServiceRatingForSeedingFeedback(id: string): Promise<void> {
    const service = await this.serviceRepository.findOne({
      where: { id },
      relations: { feedbacks: true },
    });
    if (!service) throw new NotFoundException('Không tìm thấy dịch vụ này');

    const feedbacks = service.feedbacks ?? [];
    const ratingCount = feedbacks.length;
    const totalRating = feedbacks.reduce((acc, feedback) => acc + Number(feedback.rating ?? 0), 0);
    service.ratingAverage = ratingCount > 0 ? Number(totalRating) / Number(ratingCount) : 0;
    service.ratingCount = ratingCount;

    await this.serviceRepository.save(service);
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

    await this.serviceRepository.update(id, {
      ratingCount: newRatingCount,
      ratingAverage: newRatingAverage,
    });
  }
}
