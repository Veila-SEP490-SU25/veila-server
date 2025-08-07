import { CURequestDto } from '@/app/request/request.dto';
import { Filtering, getOrder, getWhere, Sorting } from '@/common/decorators';
import { Request, RequestStatus } from '@/common/models';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RequestService {
  constructor(@InjectRepository(Request) private readonly requestRepository: Repository<Request>) {}

  async createRequestForCustomer(userId: string, body: CURequestDto): Promise<Request> {
    if (body.status === RequestStatus.ACCEPTED || body.status === RequestStatus.CANCELLED) {
      throw new NotFoundException(`Cannot create request with status ${body.status}`);
    }
    const request = {
      ...body,
      user: { id: userId },
    };
    return await this.requestRepository.save(request);
  }

  async getRequestsForCustomer(
    userId: string,
    take: number,
    skip: number,
    sort?: Sorting,
    filter?: Filtering,
  ): Promise<[Request[], number]> {
    const dynamicFilter = getWhere(filter);
    const where = {
      ...dynamicFilter,
      user: { id: userId },
    };
    const order = getOrder(sort);
    return await this.requestRepository.findAndCount({
      where,
      order,
      take,
      skip,
    });
  }

  async getRequestForCustomer(userId: string, id: string): Promise<Request> {
    const request = await this.requestRepository.findOne({
      where: {
        id,
        user: { id: userId },
      },
    });
    if (!request) throw new NotFoundException(`Request with id ${id} not found for user ${userId}`);
    return request;
  }

  async updateRequestForCustomer(userId: string, id: string, body: CURequestDto): Promise<void> {
    if (body.status === RequestStatus.ACCEPTED || body.status === RequestStatus.CANCELLED) {
      throw new NotFoundException(`Cannot update request with status ${body.status}`);
    }
    const request = await this.getRequestForCustomer(userId, id);
    if (request.status === RequestStatus.ACCEPTED) {
      throw new NotFoundException(`Cannot update request with id ${id} as it is already accepted`);
    }
    await this.requestRepository.update(id, {
      ...body,
    });
  }

  async deleteRequestForCustomer(userId: string, id: string): Promise<void> {
    const request = await this.getRequestForCustomer(userId, id);
    if (request.status === RequestStatus.ACCEPTED) {
      throw new NotFoundException(`Cannot delete request with id ${id} as it is already accepted`);
    }
    await this.requestRepository.delete(id);
  }

  async getRequestsForShop(
    take: number,
    skip: number,
    sort?: Sorting,
    filter?: Filtering,
  ): Promise<[Request[], number]> {
    const dynamicFilter = getWhere(filter);
    const where = {
      ...dynamicFilter,
      isPrivate: false,
      status: RequestStatus.SUBMIT,
    };
    const order = getOrder(sort);
    return await this.requestRepository.findAndCount({
      where,
      order,
      take,
      skip,
      relations: { user: true },
    });
  }

  async getRequestForShop(id: string): Promise<Request> {
    const request = await this.requestRepository.findOne({
      where: {
        id,
        status: RequestStatus.SUBMIT,
      },
      relations: { user: true },
    });
    if (!request) throw new NotFoundException(`Request with id ${id} not found`);
    return request;
  }
}
