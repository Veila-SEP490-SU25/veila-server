import { Filtering, getOrder, getWhere, Sorting } from '@/common/decorators';
import { Service, ServiceStatus } from '@/common/models';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CUServiceDto } from '@/app/service/service.dto';

@Injectable()
export class ServiceService {
  constructor(@InjectRepository(Service) private readonly serviceRepository: Repository<Service>) {}

  async getServicesForCustomer(
    take: number,
    skip: number,
    sort?: Sorting,
    filter?: Filtering,
  ): Promise<[Service[], number]> {
    const dynamicFilter = getWhere(filter);
    const where = {
      ...dynamicFilter,
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

  async getServiceForCustomer(id: string): Promise<Service> {
    const where = {
      id,
      status: ServiceStatus.ACTIVE,
    };
    const existingService = await this.serviceRepository.findOne({
      where,
      relations: {
        feedbacks: { customer: true },
      },
    });
    if (!existingService) throw new NotFoundException('Không tìm thấy dịch vụ phù hợp');
    return existingService;
  }

  async getServicesForOwner(
    userId: string,
    take: number,
    skip: number,
    sort?: Sorting,
    filter?: Filtering,
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
    if (categoryId) {
      const newService = {
        user: { id: userId },
        category: { id: categoryId },
        ...body,
      };
      return await this.serviceRepository.save(newService);
    } else {
      const newService = {
        user: { id: userId },
        ...body,
      };
      return await this.serviceRepository.save(newService);
    }
  }

  async updateServiceForOwner(
    userId: string,
    id: string,
    { categoryId, ...body }: CUServiceDto,
  ): Promise<void> {
    let service;
    if (categoryId)
      service = {
        category: { id: categoryId },
        ...body,
      };
    else service = body;

    const result = await this.serviceRepository.update(
      {
        id,
        user: { id: userId },
      },
      service,
    );
    if (result.affected !== 1)
      throw new BadRequestException('Cập nhật không thành công, kiểm tra lỗi');
  }

  async removeServiceForOwner(userId: string, id: string): Promise<void> {
    const result = await this.serviceRepository.softDelete({
      id,
      user: { id: userId },
    });
    if (result.affected !== 1) throw new BadRequestException('Xóa không thành công, kiểm tra lỗi');
  }

  async restoreServiceForOwner(userId: string, id: string): Promise<void> {
    const result = await this.serviceRepository.restore({
      id,
      user: { id: userId },
    });
    if (result.affected !== 1)
      throw new BadRequestException('Khôi phục không thành công, kiểm tra lỗi');
  }

  async findAndCountOfCategoryForCustomer(
    categoryId: string,
    limit: number,
    offset: number,
    sort?: Sorting,
    filter?: Filtering,
  ): Promise<[Service[], number]> {
    const dynamicFilter = getWhere(filter);
    const where = {
      ...dynamicFilter,
      category: { id: categoryId },
      status: ServiceStatus.ACTIVE,
    };
    const order = getOrder(sort);
    return await this.serviceRepository.findAndCount({
      where,
      order,
      take: limit,
      skip: offset,
    });
  }

  async getAll(): Promise<Service[]> {
    return await this.serviceRepository.find({ withDeleted: true });
  }

  async create(service: Service): Promise<Service> {
    return await this.serviceRepository.save(service);
  }
}
