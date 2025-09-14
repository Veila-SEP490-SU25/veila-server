import { CUComplaintDto, CUComplaintReason } from '@/app/complaint/complaint.dto';
import { OrderService } from '@/app/order';
import { Filtering, getOrder, getWhere, Sorting } from '@/common/decorators';
import { Complaint, ComplaintStatus, MilestoneStatus, OrderStatus } from '@/common/models';
import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  MethodNotAllowedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { MilestoneService } from '../milestone';
import { ComplaintReason } from '@/common/models/single';
import { UserService } from '@/app/user';
import { ShopService } from '@/app/shop';

@Injectable()
export class ComplaintService {
  constructor(
    @InjectRepository(Complaint)
    private readonly complaintRepository: Repository<Complaint>,
    @InjectRepository(ComplaintReason)
    private readonly complaintReasonRepository: Repository<ComplaintReason>,
    @Inject(forwardRef(() => OrderService))
    private readonly orderService: OrderService,
    @Inject(forwardRef(() => MilestoneService))
    private readonly milestoneService: MilestoneService,
    @Inject(UserService)
    private readonly userService: UserService,
    @Inject(ShopService)
    private readonly shopService: ShopService,
  ) {}

  async getComplaintReasons(
    take: number,
    skip: number,
    sort?: Sorting[],
    filter?: Filtering[],
  ): Promise<[ComplaintReason[], number]> {
    const dynamicFilter = getWhere(filter);
    const where = {
      ...dynamicFilter,
    };
    const order = getOrder(sort);
    return await this.complaintReasonRepository.findAndCount({
      where,
      order,
      take,
      skip,
    });
  }

  async getOwnerComplaints(
    userId: string,
    orderId: string,
    take: number,
    skip: number,
    sort?: Sorting[],
    filter?: Filtering[],
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
    if (order.status === OrderStatus.COMPLETED)
      throw new MethodNotAllowedException('Không thể tạo khiếu nại cho đơn hàng chưa hoàn thành');
    const complaintMilestone = await this.milestoneService.getLastMilestoneByOrderId(order.id);
    if (complaintMilestone?.status !== MilestoneStatus.IN_PROGRESS)
      throw new MethodNotAllowedException(
        'Không thể tạo khiếu nại cho đơn hàng chưa vào giai đoạn khiếu nại',
      );
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
    sort?: Sorting[],
    filter?: Filtering[],
  ): Promise<[Complaint[], number]> {
    const dynamicFilter = getWhere(filter);
    let where = { ...dynamicFilter };
    // Nếu filter không truyền vào status thì mới loại DRAFT
    const hasStatusFilter = Array.isArray(filter) && filter.some(f => f.property === 'status');
    if (!hasStatusFilter) {
      where = { ...where, status: Not(ComplaintStatus.DRAFT) };
    }
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
      where: {
        id,
        status: Not(ComplaintStatus.DRAFT),
      },
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
      relations: {
        sender: true,
        order: { shop: { user: true }, customer: true },
      },
    });
    if (!complaint) throw new NotFoundException('Không tìm thấy khiếu nại nào phù hợp');
    if (complaint.status !== ComplaintStatus.IN_PROGRESS)
      throw new MethodNotAllowedException('Chỉ có thể cập nhật khiếu nại ở trạng thái đang xử lý');
    if (status !== ComplaintStatus.APPROVED && status !== ComplaintStatus.REJECTED)
      throw new BadRequestException('Trạng thái khiếu nại không hợp lệ');
    await this.complaintRepository.update(id, { status });

    if (status === ComplaintStatus.APPROVED) {
      const complaintReason = await this.complaintReasonRepository.findOneBy({
        code: complaint.title,
      });
      if (!complaintReason)
        throw new NotFoundException('Không tìm thấy lý do khiếu nại nào phù hợp');

      const isCustomer = complaint.sender === complaint.order.customer;
      if (isCustomer) {
        const shop = complaint.order.shop;
        shop.reputation -= complaintReason.reputationPenalty;
        await this.shopService.save(shop);
      } else {
        const customer = complaint.order.customer;
        customer.reputation -= complaintReason.reputationPenalty;
        await this.userService.updateUser(customer);
      }
    }
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

  async createComplaintReason(body: CUComplaintReason): Promise<ComplaintReason> {
    const reason = this.complaintReasonRepository.create(body);
    return await this.complaintReasonRepository.save(reason);
  }

  async updateComplaintReason(id: string, body: CUComplaintReason): Promise<void> {
    const reason = await this.complaintReasonRepository.findOne({ where: { id } });
    if (!reason) throw new NotFoundException('Không tìm thấy lý do khiếu nại nào phù hợp');
    await this.complaintReasonRepository.update(id, body);
  }

  async deleteComplaintReason(id: string): Promise<void> {
    const reason = await this.complaintReasonRepository.findOne({ where: { id } });
    if (!reason) throw new NotFoundException('Không tìm thấy lý do khiếu nại nào phù hợp');
    await this.complaintReasonRepository.delete(id);
  }
}
