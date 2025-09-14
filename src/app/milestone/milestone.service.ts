import { Milestone, MilestoneStatus, OrderStatus, OrderType, TaskStatus } from '@/common/models';
import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CUMilestoneDtoV2, MilestoneDto } from './milestone.dto';
import { Filtering, getOrder, getWhere, Sorting } from '@/common/decorators';
import { plainToInstance } from 'class-transformer';
import { OrderService } from '../order';
import { ShopService } from '../shop';
import { TaskDto, TaskService } from '../task';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SingleService } from '../single';
import { MilestoneTemplateType } from '@/common/models/single/milestone-template.model';

@Injectable()
export class MilestoneService {
  constructor(
    @InjectRepository(Milestone)
    private readonly milestoneRepository: Repository<Milestone>,
    @Inject(forwardRef(() => OrderService))
    private readonly orderService: OrderService,
    @Inject(forwardRef(() => ShopService))
    private readonly shopService: ShopService,
    @Inject(forwardRef(() => TaskService))
    private readonly taskService: TaskService,
    private readonly singleService: SingleService,
  ) {}

  async createMilestone(orderId: string, orderType: OrderType): Promise<void> {
    let templatesType;
    if (orderType === OrderType.SELL) templatesType = MilestoneTemplateType.SELL;
    else if (orderType === OrderType.RENT) templatesType = MilestoneTemplateType.RENT;
    else if (orderType === OrderType.CUSTOM) templatesType = MilestoneTemplateType.CUSTOM;
    const templates = await this.singleService.getMilestoneTemplatesByType(templatesType);

    if (!templates.length) {
      throw new Error(`No milestone templates found for type: ${orderType}`);
    }
    //lấy ngày hôm nay
    const startDate = new Date();

    //Tạo milestone mặc định theo templates
    const milestoneEntities = templates.map((template) => {
      const dueDate = new Date(startDate);
      dueDate.setDate(dueDate.getDate() + template.timeGap);

      return this.milestoneRepository.create({
        order: { id: orderId },
        title: template.title,
        description: template.description,
        index: template.index,
        status: MilestoneStatus.PENDING,
        dueDate,
      });
    });

    const savedMilestones = await this.milestoneRepository.save(milestoneEntities);

    //Tạo task số 1 mặc định cho mỗi milestone
    await Promise.all(
      savedMilestones.map((milestone, i) => {
        if (i == savedMilestones.length - 1) return; // bỏ qua milestone cuối cùng
        this.taskService.createDefaultTask(milestone);
      }),
    );
  }

  async updateDeadlineMilestoneById(
    userId: string,
    id: string,
    body: CUMilestoneDtoV2,
  ): Promise<Milestone> {
    const existingMilestone = await this.milestoneRepository.findOne({
      where: { id },
      relations: { order: true },
    });

    if (!existingMilestone) throw new NotFoundException('Không tim thấy mốc công việc');

    await this.validateOwnerOfOrder(userId, existingMilestone.order.id);

    if (!(await this.isOrderInProcessOrderPending(existingMilestone.order.id)))
      throw new ConflictException('Đơn hàng chưa được bắt đầu/đã hoàn thành/bị hủy');

    if (existingMilestone.status !== MilestoneStatus.PENDING)
      throw new BadRequestException('Mốc công việc đã bắt đầu/đã hoàn thành/bị hủy');

    existingMilestone.dueDate = body.dueDate;

    return await this.milestoneRepository.save(existingMilestone);
  }

  async getTaskByIdAndMilestoneId(milestoneId: string, taskId: string): Promise<TaskDto> {
    return await this.taskService.getTaskByIdAndMilestoneId(milestoneId, taskId);
  }

  async getTasksByMilestonesId(
    milestoneId: string,
    take: number,
    skip: number,
    sort?: Sorting[],
    filter?: Filtering[],
  ): Promise<[TaskDto[], number]> {
    return await this.taskService.getTasksByMilestoneId(milestoneId, take, skip, sort, filter);
  }

  async getAllMilestonesForOrder(orderId: string, sort?: Sorting[]): Promise<MilestoneDto[]> {
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
    return plainToInstance(MilestoneDto, milestones);
  }

  async getMilestoneById(id: string): Promise<MilestoneDto> {
    const milestone = await this.milestoneRepository.findOne({
      where: { id },
      relations: ['order'],
    });
    if (!milestone) throw new NotFoundException('Không tìm thấy mốc công việc phù hợp');
    return plainToInstance(MilestoneDto, milestone);
  }

  async updateMilestoneStatus(
    userId: string,
    id: string,
    status: MilestoneStatus,
  ): Promise<Milestone> {
    const existingMilestone = await this.milestoneRepository.findOne({
      where: { id },
      relations: { order: true },
    });
    if (!existingMilestone) throw new NotFoundException('Không tim thấy mốc công việc');

    await this.validateOwnerOfOrder(userId, existingMilestone.order.id);

    if (!this.isOrderInProcess(existingMilestone.order.id))
      throw new ConflictException('Đơn hàng chưa được bắt đầu/đã hoàn thành/bị hủy');

    if (
      existingMilestone.status === MilestoneStatus.PENDING ||
      existingMilestone.status === MilestoneStatus.IN_PROGRESS
    )
      existingMilestone.status = status;
    else throw new ConflictException('Mốc công việc đã được hoàn thành/bị hủy');

    return await this.milestoneRepository.save(plainToInstance(Milestone, existingMilestone));
  }

  private async validateOwnerOfOrder(userId: string, orderId: string): Promise<void> {
    const shop = await this.shopService.getShopByUserId(userId);
    if (!shop) throw new NotFoundException('Người dùng này chưa có cửa hàng nào');

    const orders = await this.orderService.getOrderByShopId(shop.id);
    if (!orders) {
      throw new NotFoundException(
        'Không tìm thấy đơn hàng đang chờ hoặc đang thực hiện của người dùng này',
      );
    }

    const matchedOrder = orders.find((order) => order.id === orderId);
    if (!matchedOrder) throw new NotFoundException('Đơn hàng không tồn tại');
  }

  async createMilestoneForSeeding(milestone: Milestone): Promise<Milestone> {
    return await this.milestoneRepository.save(milestone);
  }

  async completeTask(id: string, taskId: string): Promise<void> {
    // Lấy task hiện tại
    const existingTask = await this.taskService.getTaskByIdAndMilestoneIdV2(id, taskId);
    if (!existingTask) {
      throw new NotFoundException('Không tìm thấy công việc trong mốc công việc');
    }

    // Kiểm tra trạng thái hợp lệ
    if (existingTask.status !== TaskStatus.IN_PROGRESS) {
      throw new BadRequestException('Công việc không ở trạng thái IN_PROGRESS');
    }

    //Kiểm tra đơn hàng chứa công việc có đang IN_PROCESS không
    const existingMilestone = await this.milestoneRepository.findOne({
      where: { id },
      relations: ['order'],
    });
    if (!existingMilestone) throw new NotFoundException('Không tim thấy mốc công việc');
    if (!(await this.isOrderInProcess(existingMilestone.order.id)))
      throw new ConflictException('Đơn hàng chưa được bắt đầu/đã hoàn thành/bị hủy');

    // Chuyển task hiện tại thành COMPLETED
    await this.taskService.updateTaskStatus(existingTask.id, TaskStatus.COMPLETED);

    // Lấy tất cả task trong milestone hiện tại (sort theo index)
    const allTasksInMilestone = await this.taskService.getTasksByMilestoneIdV2(id);
    allTasksInMilestone.sort((a, b) => a.index - b.index);

    // Tìm task tiếp theo
    const nextTask = allTasksInMilestone.find((t) => t.index > existingTask.index);

    if (nextTask) {
      // Nếu có task tiếp theo -> đặt nó thành IN_PROGRESS
      await this.taskService.updateTaskStatus(nextTask.id, TaskStatus.IN_PROGRESS);
      return; // Kết thúc ở đây vì milestone chưa xong
    }

    // Nếu không có task tiếp theo -> milestone hiện tại hoàn thành
    const currentMilestone = await this.getMilestoneByIdV2(id);
    await this.updateMilestoneStatusV2(currentMilestone.id, MilestoneStatus.COMPLETED);

    // Tìm milestone tiếp theo trong order (sort theo thứ tự)
    const milestonesInOrder = await this.getMilestonesByOrderId(currentMilestone.order.id);
    milestonesInOrder.sort((a, b) => a.index - b.index);

    const nextMilestone = milestonesInOrder.find((m) => m.index > currentMilestone.index);

    if (nextMilestone) {
      // Đặt milestone tiếp theo thành IN_PROGRESS
      await this.updateMilestoneStatusV2(nextMilestone.id, MilestoneStatus.IN_PROGRESS);

      // Lấy task đầu tiên của milestone tiếp theo và đặt IN_PROGRESS
      const firstTaskOfNextMilestone = (
        await this.taskService.getTasksByMilestoneIdV2(nextMilestone.id)
      ).sort((a, b) => a.index - b.index)[0];

      if (firstTaskOfNextMilestone) {
        await this.taskService.updateTaskStatus(
          firstTaskOfNextMilestone.id,
          TaskStatus.IN_PROGRESS,
        );
      }
    } else {
      // Nếu milestone hiện tại là cuối cùng -> hoàn thành order
      const order = await this.orderService.getOrderById(currentMilestone.order.id);
      await this.orderService.updateOrderStatusV2(order.id, OrderStatus.COMPLETED);
    }
  }

  private async getMilestoneByIdV2(id: string): Promise<Milestone> {
    const milestone = await this.milestoneRepository.findOne({
      where: { id },
      relations: ['order'],
    });
    if (!milestone) throw new NotFoundException('Không tìm thấy mốc công việc phù hợp');
    return milestone;
  }

  private async updateMilestoneStatusV2(id: string, status: MilestoneStatus): Promise<Milestone> {
    const existingMilestone = await this.milestoneRepository.findOneBy({ id });
    if (!existingMilestone) throw new NotFoundException('Không tim thấy mốc công việc');

    existingMilestone.status = status;

    return await this.milestoneRepository.save(plainToInstance(Milestone, existingMilestone));
  }

  async getMilestonesByOrderId(orderId: string): Promise<Milestone[]> {
    const milestones = await this.milestoneRepository.find({
      where: { order: { id: orderId } },
      relations: ['order'],
      order: {
        index: 'ASC',
      },
    });
    return milestones;
  }

  async getCompletedMilestonesByOrderId(orderId: string): Promise<Milestone[]> {
    const milestones = await this.milestoneRepository.find({
      where: {
        order: { id: orderId },
        status: MilestoneStatus.COMPLETED,
      },
      relations: ['order'],
      order: {
        index: 'ASC',
      },
    });
    return milestones;
  }

  async getDelayedMilestonesByOrderId(orderId: string): Promise<Milestone[]> {
    const milestones = await this.milestoneRepository.find({
      where: {
        order: { id: orderId },
        status: MilestoneStatus.DELAYED,
      },
      relations: ['order'],
    });
    return milestones;
  }

  async getLastMilestoneByOrderId(orderId: string): Promise<Milestone | null> {
    const milestone = await this.milestoneRepository.findOne({
      where: {
        order: { id: orderId },
      },
      relations: ['order'],
      order: {
        index: 'DESC',
      },
    });
    return milestone;
  }

  async updateMilestoneStatusForOrderCustomAfterCheckout(orderId: string): Promise<void> {
    const milestones = await this.milestoneRepository.find({
      where: { order: { id: orderId }, status: MilestoneStatus.PENDING },
      order: { index: 'ASC' },
    });
    const nextMilestone = milestones[0];
    nextMilestone.status = MilestoneStatus.IN_PROGRESS;
    const updatedMilestone = await this.milestoneRepository.save(nextMilestone);
    await this.taskService.updateTaskStatusForOrderCustomAfterCheckout(updatedMilestone.id);
  }

  async getOrderMilestones(
    orderId: string,
    take: number,
    skip: number,
    sort?: Sorting[],
    filter?: Filtering[],
  ): Promise<[Milestone[], number]> {
    const dynamicFilter = getWhere(filter);
    const where = {
      ...dynamicFilter,
      order: { id: orderId },
    };
    const order = getOrder(sort);

    const [milestones, totalItems] = await this.milestoneRepository.findAndCount({
      where,
      order,
      take,
      skip,
      relations: {
        tasks: true,
      },
    });

    return [milestones, totalItems];
  }

  async isOrderInProcessOrderPending(orderId: string): Promise<boolean> {
    const order = await this.orderService.getOrderByIdV2(orderId);
    let isBoolean = false;
    if (order.status === OrderStatus.PENDING || order.status === OrderStatus.IN_PROCESS)
      isBoolean = true;
    return isBoolean;
  }

  async isOrderInProcess(orderId: string): Promise<boolean> {
    const order = await this.orderService.getOrderByIdV2(orderId);
    return order.status === OrderStatus.IN_PROCESS ? true : false;
  }

  async startFirstMilestoneAndTask(orderId: string): Promise<void> {
    // Lấy milestone đầu tiên của đơn hàng
    const firstMilestone = await this.milestoneRepository.findOne({
      where: { order: { id: orderId } },
      order: { index: 'ASC' },
    });
    if (!firstMilestone) return;

    // Cập nhật milestone đầu tiên thành IN_PROGRESS
    if (firstMilestone.status === MilestoneStatus.PENDING) {
      firstMilestone.status = MilestoneStatus.IN_PROGRESS;
      await this.milestoneRepository.save(firstMilestone);
    }

    // Lấy task đầu tiên của milestone đầu tiên
    const firstTask = await this.taskService.findFirstTaskOfMilestone(firstMilestone.id);
    if (!firstTask) return;

    // Cập nhật task đầu tiên thành IN_PROGRESS
    if (firstTask.status === TaskStatus.PENDING) {
      firstTask.status = TaskStatus.IN_PROGRESS;
      await this.taskService.saveTask(firstTask);
    }
  }

  async updateMilestoneStatusForUpdateRequest(
    orderId: string,
    status: MilestoneStatus,
  ): Promise<void> {
    if (status === MilestoneStatus.PENDING) {
      const milestone = await this.milestoneRepository.findOne({
        where: { order: { id: orderId }, status: MilestoneStatus.IN_PROGRESS },
      });
      if (!milestone) throw new NotFoundException('Không tìm thấy mốc công việc phù hợp');
      await this.milestoneRepository.update(milestone.id, { status });
      await this.taskService.updateTaskStatusForUpdateRequest(milestone.id, TaskStatus.PENDING);
    } else if (status === MilestoneStatus.IN_PROGRESS) {
      const milestones = await this.milestoneRepository.find({
        where: { order: { id: orderId }, status: MilestoneStatus.PENDING },
        order: { index: 'ASC' },
      });
      const milestone = milestones[0];
      await this.milestoneRepository.update(milestone.id, { status });
      await this.taskService.updateTaskStatusForUpdateRequest(milestone.id, TaskStatus.IN_PROGRESS);
    }
  }

  async cancelOrder(orderId: string): Promise<void> {
    const milestones = await this.milestoneRepository.find({
      where: {
        order: { id: orderId },
        status: In([MilestoneStatus.IN_PROGRESS, MilestoneStatus.PENDING]),
      },
      withDeleted: true,
    });

    for (const milestone of milestones) {
      await this.milestoneRepository.update(milestone.id, { status: MilestoneStatus.CANCELLED });
      await this.taskService.cancelOrder(milestone.id);
    }
  }

  async completeComplaintMilestone(orderId: string, milestone: Milestone): Promise<void> {
    milestone.status = MilestoneStatus.COMPLETED;
    await this.milestoneRepository.save(milestone);
    await this.orderService.updateOrderStatusV2(orderId, OrderStatus.COMPLETED);
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, { timeZone: 'Asia/Ho_Chi_Minh' })
  private async markDelayForMilestone(): Promise<void> {
    //tìm tất cả các mốc công việc có trạng thái là PENDING, IN_PROGRESS
    const milestones = await this.milestoneRepository.find({
      where: {
        status: In([MilestoneStatus.PENDING, MilestoneStatus.IN_PROGRESS]),
      },
    });
    //xử lý các mốc công việc đã bị trễ
    await Promise.all(
      milestones.map(async (milestone) => {
        await this.markDelay(milestone);
      }),
    );
  }

  async markDelay(milestone: Milestone): Promise<void> {
    const now = new Date();
    if (milestone.dueDate < now) {
      milestone.status = MilestoneStatus.DELAYED;
      await this.milestoneRepository.save(milestone);
    }
  }
}
