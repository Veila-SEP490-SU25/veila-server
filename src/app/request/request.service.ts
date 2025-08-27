import { OrderService } from '@/app/order';
import { CUpdateRequestDto, CURequestDto, ReviewUpdateRequestDto } from '@/app/request/request.dto';
import { Filtering, getOrder, getWhere, Sorting } from '@/common/decorators';
import {
  OrderStatus,
  Request,
  RequestStatus,
  UpdateOrderServiceDetail,
  UpdateRequest,
  UpdateRequestStatus,
} from '@/common/models';
import {
  forwardRef,
  Inject,
  Injectable,
  MethodNotAllowedException,
  NotFoundException,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';

@Injectable()
export class RequestService {
  constructor(
    @InjectRepository(Request)
    private readonly requestRepository: Repository<Request>,
    @InjectRepository(UpdateRequest)
    private readonly updateRequestRepository: Repository<UpdateRequest>,
    @Inject(forwardRef(() => OrderService))
    private readonly orderService: OrderService,
  ) { }

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

  async getRequest(id: string): Promise<Request> {
    const request = await this.requestRepository.findOne({
      where: {
        id,
        status: Not(RequestStatus.DRAFT),
      },
      relations: { user: true },
    });
    if (!request) throw new NotFoundException(`Request with id ${id} not found`);
    return request;
  }

  async getAllRequestsForSeeding(): Promise<Request[]> {
    return await this.requestRepository.find({
      withDeleted: true,
      where: {
        status: RequestStatus.SUBMIT,
      },
    });
  }

  async createRequestForSeeding(request: Request): Promise<Request> {
    return await this.requestRepository.save(request);
  }

  async getRequestForOrderCustom(id: string): Promise<Request> {
    const request = await this.requestRepository.findOne({
      where: {
        id,
        status: RequestStatus.SUBMIT,
      },
    });
    if (!request) throw new NotFoundException(`Request with id ${id} not found`);
    return request;
  }

  async updateStatusRequestForOrderCustom(id: string, status: RequestStatus): Promise<void> {
    await this.requestRepository.update(id, { status });
  }

  async createUpdateRequest(
    userId: string,
    id: string,
    body: CUpdateRequestDto,
  ): Promise<UpdateRequest> {
    const request = await this.requestRepository.findOne({
      where: {
        user: { id: userId },
        id,
        status: RequestStatus.ACCEPTED,
      },
    });
    if (!request) throw new NotFoundException('Không tìm thấy yêu cầu');

    const order = await this.orderService.getOrderByRequestId(request.id);
    if (order.status !== OrderStatus.IN_PROCESS)
      throw new MethodNotAllowedException(
        `Không thể tạo yêu cầu cập nhật khi đơn hàng không ở trạng thái đang xử lý`,
      );

    const isUpdateRequestPending = await this.updateRequestRepository.exists({
      where: {
        request: { id: request.id, user: { id: userId } },
        status: UpdateRequestStatus.PENDING,
      },
    });
    if (isUpdateRequestPending)
      throw new NotFoundException(`Đang có yêu cầu cập nhật cho ${request.id}`);

    const updateRequest = {
      request: { id: request.id },
      status: UpdateRequestStatus.PENDING,
      ...body,
    } as UpdateRequest;
    const createdUpdateRequest = await this.updateRequestRepository.save(updateRequest);

    await this.orderService.updateOrderStatusForUpdateRequest(order.id, OrderStatus.PENDING);

    return createdUpdateRequest;
  }

  async getUpdateRequests(
    requestId: string,
    take: number,
    skip: number,
    sort?: Sorting,
    filter?: Filtering,
  ): Promise<[UpdateRequest[], number]> {
    const dynamicFilter = getWhere(filter);
    const where = {
      ...dynamicFilter,
      request: { id: requestId },
    };
    const order = getOrder(sort);
    return await this.updateRequestRepository.findAndCount({
      where,
      order,
      take,
      skip,
    });
  }

  async getUpdateRequest(id: string, updateId: string): Promise<UpdateRequest> {
    const updateRequest = await this.updateRequestRepository.findOne({
      where: {
        id: updateId,
        request: { id },
      },
    });
    if (!updateRequest) throw new NotFoundException(`Update request with id ${updateId} not found`);
    return updateRequest;
  }

  async deleteUpdateRequest(requestId: string, updateId: string, userId: string): Promise<void> {
    const updateRequest = await this.updateRequestRepository.findOne({
      where: {
        id: updateId,
        request: { id: requestId, user: { id: userId } },
      },
    });
    if (!updateRequest) throw new NotFoundException(`Update request with id ${updateId} not found`);
    if (updateRequest.status === UpdateRequestStatus.ACCEPTED)
      throw new MethodNotAllowedException(
        `Không thể xóa yêu cầu cập nhật khi nó đã được chấp nhận`,
      );
    else if (updateRequest.status === UpdateRequestStatus.PENDING) {
      const order = await this.orderService.getOrderByRequestId(requestId);
      await this.orderService.updateOrderStatusForUpdateRequest(order.id, OrderStatus.IN_PROCESS);
    }
    await this.updateRequestRepository.remove(updateRequest);
  }

  async reviewUpdateRequest(
    requestId: string,
    userId: string,
    id: string,
    body: ReviewUpdateRequestDto,
  ): Promise<void> {
    const updateRequest = await this.getUpdateRequest(requestId, id);
    const orderServiceDetail = await this.orderService.getOrderServiceDetailByRequestId(requestId);
    const order = orderServiceDetail.order;

    if (order.shop.user.id !== userId)
      throw new NotFoundException(`Bạn không có quyền đánh giá yêu cầu cập nhật này`);
    if (updateRequest.status !== UpdateRequestStatus.PENDING)
      throw new MethodNotAllowedException(
        'Không thể xét duyệt yêu cầu cập nhật khi nó không ở trạng thái chờ duyệt',
      );

    await this.updateRequestRepository.update(id, { status: body.status });
    if (body.status === UpdateRequestStatus.ACCEPTED) {
      await this.orderService.createUpdateOrderServiceDetail({
        orderServiceDetail,
        updateRequest,
        price: body.price,
      } as UpdateOrderServiceDetail);

      if (body.price === 0)
        await this.orderService.updateOrderStatusForUpdateRequest(order.id, OrderStatus.IN_PROCESS);
      else {
        const oldAmount = Number(order.amount);
        const newAmount = oldAmount + body.price;
        await this.orderService.updateOrderAmount(order.id, newAmount);
      }
    } else if (body.status === UpdateRequestStatus.REJECTED) {
      await this.orderService.updateOrderStatusForUpdateRequest(order.id, OrderStatus.IN_PROCESS);
    } else {
      throw new MethodNotAllowedException(`Trạng thái ${body.status} không hợp lệ`);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, { timeZone: 'Asia/Ho_Chi_Minh' })
  async updateRequestHandle(): Promise<void> {
    const updateRequests = await this.updateRequestRepository.find({
      where: { status: UpdateRequestStatus.PENDING },
    });
    const now = new Date();
    const threeDaysAgo = new Date(now.getDate() - 2);
    await updateRequests.map(async (updateRequest) => {
      if (updateRequest.createdAt < threeDaysAgo) {
        await this.updateRequestRepository.update(updateRequest.id, { status: UpdateRequestStatus.REJECTED });
      }
    });
  }
}
