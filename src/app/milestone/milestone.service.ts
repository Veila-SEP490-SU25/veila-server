import { Milestone, MilestoneStatus } from '@/common/models';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { createMilestoneRequestDto, CUMilestoneDto, milestoneDto } from './milestone.dto';
import { getOrder, Sorting } from '@/common/decorators';
import { plainToInstance } from 'class-transformer';
import { OrderService } from '../order';
import { ShopService } from '../shop';
import { TaskService } from '../task';

@Injectable()
export class MilestoneService {
  constructor(
    @InjectRepository(Milestone)
    private readonly milestoneRepository: Repository<Milestone>,
    private readonly orderService: OrderService,
    private readonly shopService: ShopService,
    private readonly taskService: TaskService,
  ) {}

  async getAllMilestonesForOrder(orderId: string, sort?: Sorting): Promise<milestoneDto[]> {
    const existingOrder = await this.orderService.getOrderById(orderId);
    if (!existingOrder) throw new NotFoundException('Không tìm thấy đơn hàng');

    const where = {
      order: { id: orderId },
      status: In([
        MilestoneStatus.PENDING,
        MilestoneStatus.IN_PROGRESS,
        MilestoneStatus.COMPLETED,
        MilestoneStatus.CANCELLED,
      ]),
    };
    const order = getOrder(sort);
    const milestones = await this.milestoneRepository.find({
      where,
      order,
      relations: ['order'],
    });
    return plainToInstance(milestoneDto, milestones);
  }

  async getMilestoneById(id: string): Promise<milestoneDto> {
    const milestone = await this.milestoneRepository.findOne({
      where: { id },
      relations: ['order'],
    });
    if (!milestone) throw new NotFoundException('Không tìm thấy mốc công việc phù hợp');
    return plainToInstance(milestoneDto, milestone);
  }

  async createMilestone(userId: string, body: createMilestoneRequestDto): Promise<Milestone> {
    await this.validateOwnerOfOrder(userId, body.newMilestone.orderId);

    const milestone = {
      order: { id: body.newMilestone.orderId },
      title: body.newMilestone.title,
      description: body.newMilestone.description,
      index: body.newMilestone.index,
      status: MilestoneStatus.PENDING,
      dueDate: body.newMilestone.dueDate,
    } as Milestone;

    const milestoneId = (await this.milestoneRepository.save(milestone)).id;
    await this.taskService.saveTask(milestoneId, body.tasks);

    return milestone;
  }

  async updateMilestone(
    userId: string,
    id: string,
    updateMilestone: CUMilestoneDto,
  ): Promise<Milestone> {
    await this.validateOwnerOfOrder(userId, updateMilestone.orderId);

    const existingMilestone = await this.getMilestoneById(id);
    if (
      !existingMilestone ||
      (existingMilestone.status !== MilestoneStatus.COMPLETED &&
        existingMilestone.status !== MilestoneStatus.CANCELLED)
    )
      throw new NotFoundException('Không tìm thấy mốc công việc phù hợp');

    existingMilestone.title = updateMilestone.title;
    existingMilestone.description = updateMilestone.description;
    existingMilestone.index = updateMilestone.index;
    existingMilestone.dueDate = updateMilestone.dueDate;

    return await this.milestoneRepository.save(plainToInstance(Milestone, existingMilestone));
  }

  async updateMilestoneStatus(
    userId: string,
    id: string,
    status: MilestoneStatus,
  ): Promise<Milestone> {
    const existingMilestone = await this.milestoneRepository.findOneBy({ id });
    if (!existingMilestone) throw new NotFoundException('Không tim thấy mốc công việc');

    await this.validateOwnerOfOrder(userId, existingMilestone.order.id);

    existingMilestone.status = status;

    return await this.milestoneRepository.save(plainToInstance(Milestone, existingMilestone));
  }

  private async validateOwnerOfOrder(userId: string, orderId: string): Promise<void> {
    const shop = await this.shopService.getShopByUserId(userId);
    if (!shop) throw new NotFoundException('Người dùng này chưa có cửa hàng nào');

    const orders = await this.orderService.getOrderByShopId(shop.id);
    if (!orders)
      throw new NotFoundException(
        'Không tìm thấy đơn hàng đang chờ, đang thực hiện của người dùng này',
      );

    const matchedOrder = orders.find((order) => order.id === orderId);
    if (!matchedOrder) throw new NotFoundException('Đơn hàng cần tạo milestone không tồn tại');
  }

  async createMilestoneForSeeding(milestone: Milestone): Promise<Milestone> {
    return await this.milestoneRepository.save(milestone);
  }
}
