import { CUUpdateRequestDto } from '@/app/update-request/update-request.dto';
import { Filtering, getOrder, getWhere, Sorting } from '@/common/decorators';
import { Request, RequestStatus, UpdateRequest, UpdateRequestStatus } from '@/common/models';
import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class UpdateRequestService {
  constructor(
    @InjectRepository(UpdateRequest)
    private readonly updateRequestRepository: Repository<UpdateRequest>,
    @InjectRepository(Request)
    private readonly requestRepository: Repository<Request>,
  ) {}

  async isRequestAccepted(requestId: string): Promise<boolean> {
    const request = await this.requestRepository.exists({
      where: { id: requestId, status: RequestStatus.ACCEPTED },
    });
    return request;
  }

  async createUpdateRequestForCustomer(
    userId: string,
    { requestId, ...body }: CUUpdateRequestDto,
  ): Promise<UpdateRequest> {
    if (!(await this.isRequestAccepted(requestId))) {
      throw new NotFoundException(`Request with id ${requestId} is not accepted`);
    }
    const isUpdateRequestPending = await this.updateRequestRepository.exists({
      where: {
        request: { id: requestId, user: { id: userId } },
        status: UpdateRequestStatus.PENDING,
      },
    });
    if (isUpdateRequestPending) {
      throw new NotFoundException(`Update Request for requestId ${requestId} is already pending`);
    }
    const updateRequest = {
      ...body,
      request: { id: requestId },
      status: UpdateRequestStatus.PENDING,
    };
    return await this.updateRequestRepository.save(updateRequest);
  }

  async getUpdateRequestsForCustomer(
    userId: string,
    requestId: string,
    take: number,
    skip: number,
    sort?: Sorting,
    filter?: Filtering,
  ): Promise<[UpdateRequest[], number]> {
    const dynamicFilter = getWhere(filter);
    const where = {
      ...dynamicFilter,
      request: { id: requestId, user: { id: userId } },
    };
    const order = getOrder(sort);
    return await this.updateRequestRepository.findAndCount({
      where,
      order,
      take,
      skip,
      relations: { request: true },
    });
  }

  async getUpdateRequestForCustomer(userId: string, id: string): Promise<UpdateRequest> {
    const updateRequest = await this.updateRequestRepository.findOne({
      where: {
        id,
        request: { user: { id: userId } },
      },
      relations: { request: true },
    });
    if (!updateRequest)
      throw new NotFoundException(`Update Request with id ${id} not found for user ${userId}`);
    return updateRequest;
  }

  async updateUpdateRequestForCustomer(
    userId: string,
    id: string,
    { requestId, ...body }: CUUpdateRequestDto,
  ): Promise<void> {
    const isUpdateRequestPending = await this.updateRequestRepository.exists({
      where: {
        request: { id: requestId, user: { id: userId } },
        status: UpdateRequestStatus.PENDING,
      },
    });
    if (isUpdateRequestPending) {
      throw new NotFoundException(`Update Request for requestId ${requestId} is already pending`);
    }
    const updateRequest = await this.getUpdateRequestForCustomer(userId, id);
    if (updateRequest.status === UpdateRequestStatus.ACCEPTED) {
      throw new NotFoundException(`Cannot update accepted update request with id ${id}`);
    }
    await this.updateRequestRepository.update(id, {
      ...body,
      status: UpdateRequestStatus.PENDING,
    });
  }

  async deleteUpdateRequestForCustomer(userId: string, id: string): Promise<void> {
    const updateRequest = await this.getUpdateRequestForCustomer(userId, id);
    if (updateRequest.status === UpdateRequestStatus.ACCEPTED) {
      throw new NotFoundException(`Cannot delete accepted update request with id ${id}`);
    }
    await this.updateRequestRepository.delete(id);
  }
}
