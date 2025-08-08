import { CUComplaintDto } from '@/app/complaint/complaint.dto';
import { OrderService } from '@/app/order';
import { Filtering, getOrder, getWhere, Sorting } from '@/common/decorators';
import { Complaint, ComplaintStatus, OrderStatus } from '@/common/models';
import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  MethodNotAllowedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ComplaintService {
  constructor(
    @InjectRepository(Complaint)
    private readonly complaintRepository: Repository<Complaint>,
    @Inject(forwardRef(() => OrderService))
    private readonly orderService: OrderService,
  ) {}

  async getOwnerComplaints(
    userId: string,
    orderId: string,
    take: number,
    skip: number,
    sort?: Sorting,
    filter?: Filtering,
  ): Promise<[Complaint[], number]> {
    const dynamicFilter = getWhere(filter);
    const where = {
      ...dynamicFilter,
      sender: { id: userId },
      order: { id: orderId },
    };
    const order = getOrder(sort);

    return await this.complaintRepository.findAndCount({
      where,
      order,
      take,
      skip,
    });
  }

  async getOwnerComplaintById(userId: string, id: string): Promise<Complaint> {
    const complaint = await this.complaintRepository.findOne({
      where: { id, sender: { id: userId } },
      relations: {
        order: true,
      },
    });
    if (!complaint) throw new NotFoundException('Không tìm thấy khiếu nại nào phù hợp');
    return complaint;
  }

  async createComplaint(userId: string, orderId: string, body: CUComplaintDto): Promise<Complaint> {
    const order = await this.orderService.getOwnerOrderById(userId, orderId);
    if (!order) throw new NotFoundException('Không tìm thấy đơn hàng này');
    if (order.status !== OrderStatus.COMPLETED)
      throw new MethodNotAllowedException('Không thể tạo khiếu nại cho đơn hàng chưa hoàn thành');
    if (Date.now() - order.updatedAt.getTime() > 3 * 24 * 60 * 60 * 1000)
      throw new MethodNotAllowedException('Không thể tạo khiếu nại cho đơn hàng đã quá 3 ngày');

    if (await this.isExistsInProgressComplaint(userId, orderId))
      throw new MethodNotAllowedException('Bạn đã có khiếu nại đang xử lý cho đơn hàng này');

    if (body.status === ComplaintStatus.APPROVED || body.status === ComplaintStatus.REJECTED)
      throw new BadRequestException('Trạng thái khiếu nại không hợp lệ');

    const complaint = this.complaintRepository.create({
      ...body,
      sender: { id: userId },
      order: { id: orderId },
    }) as Complaint;
    return await this.complaintRepository.save(complaint);
  }

  async updateComplaint(userId: string, id: string, body: CUComplaintDto): Promise<void> {
    const complaint = await this.getOwnerComplaintById(userId, id);
    if (complaint.status !== ComplaintStatus.DRAFT)
      throw new MethodNotAllowedException('Chỉ có thể cập nhật khiếu nại ở trạng thái nháp');
    await this.complaintRepository.update(id, body);
  }

  async getComplaintsForStaff(
    take: number,
    skip: number,
    sort?: Sorting,
    filter?: Filtering,
  ): Promise<[Complaint[], number]> {
    const dynamicFilter = getWhere(filter);
    const where = {
      ...dynamicFilter,
    };
    const order = getOrder(sort);

    return await this.complaintRepository.findAndCount({
      where,
      order,
      take,
      skip,
      relations: {
        sender: true,
        order: true,
      },
    });
  }

  async getComplaintForStaff(id: string): Promise<Complaint> {
    const complaint = await this.complaintRepository.findOne({
      where: { id },
      relations: {
        sender: true,
        order: true,
      },
    });
    if (!complaint) throw new NotFoundException('Không tìm thấy khiếu nại nào phù hợp');
    return complaint;
  }

  async reviewComplaint(id: string, status: ComplaintStatus): Promise<void> {
    const complaint = await this.complaintRepository.findOne({
      where: { id },
    });
    if (!complaint) throw new NotFoundException('Không tìm thấy khiếu nại nào phù hợp');
    if (complaint.status !== ComplaintStatus.IN_PROGRESS)
      throw new MethodNotAllowedException('Chỉ có thể cập nhật khiếu nại ở trạng thái đang xử lý');
    if (status !== ComplaintStatus.APPROVED && status !== ComplaintStatus.REJECTED)
      throw new BadRequestException('Trạng thái khiếu nại không hợp lệ');

    await this.complaintRepository.update(id, { status });
  }

  async isExistsInProgressComplaint(userId: string, orderId: string): Promise<boolean> {
    const isExist = await this.complaintRepository.existsBy({
      sender: { id: userId },
      order: { id: orderId },
      status: ComplaintStatus.IN_PROGRESS,
    });
    return isExist;
  }

  async getAllForSeeding(): Promise<Complaint[]> {
    return await this.complaintRepository.find({
      withDeleted: true,
    });
  }

  async createComplaintForSeeding(complaint: Complaint): Promise<Complaint> {
    return await this.complaintRepository.save(complaint);
  }
}
