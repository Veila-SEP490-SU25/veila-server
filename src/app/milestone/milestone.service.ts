import { Milestone, MilestoneStatus, OrderStatus, TaskStatus } from '@/common/models';
import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateMilestoneRequestDto, CUMilestoneDto, MilestoneDto } from './milestone.dto';
import { Filtering, getOrder, getWhere, Sorting } from '@/common/decorators';
import { plainToInstance } from 'class-transformer';
import { CreateMilestone, OrderService } from '../order';
import { ShopService } from '../shop';
import { TaskDto, TaskService } from '../task';

@Injectable()
export class MilestoneService {
  constructor(
    @InjectRepository(Milestone)
    private readonly milestoneRepository: Repository<Milestone>,
    @Inject(forwardRef(() => OrderService))
    private readonly orderService: OrderService,
    private readonly shopService: ShopService,
    private readonly taskService: TaskService,
  ) {}

  async getTaskByIdAndMilestoneId(milestoneId: string, taskId: string): Promise<TaskDto> {
    return await this.taskService.getTaskByIdAndMilestoneId(milestoneId, taskId);
  }

  async getTasksByMilestonesId(
    milestoneId: string,
    take: number,
    skip: number,
    sort?: Sorting,
    filter?: Filtering,
  ): Promise<[TaskDto[], number]> {
    return await this.taskService.getTasksByMilestoneId(milestoneId, take, skip, sort, filter);
  }

  async getAllMilestonesForOrder(orderId: string, sort?: Sorting): Promise<MilestoneDto[]> {
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

  async createMilestone(userId: string, body: CreateMilestoneRequestDto): Promise<Milestone> {
    let milestoneStatus = MilestoneStatus.PENDING;

    await this.validateOwnerOfOrder(userId, body.newMilestone.orderId);

    const existingMilestones = await this.getAllMilestonesForOrder(body.newMilestone.orderId);
    if (existingMilestones.length === 0) milestoneStatus = MilestoneStatus.IN_PROGRESS;

    const milestone = {
      order: { id: body.newMilestone.orderId },
      title: body.newMilestone.title,
      description: body.newMilestone.description,
      //ghi chú: index sẽ được đánh từ 1
      index: Number(existingMilestones.length) + 1,
      status: milestoneStatus,
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

  async createMilestoneForOrderCustom(
    orderId: string,
    body: CreateMilestone,
    milestoneIndex: number,
  ): Promise<void> {
    const newMilestone = await this.milestoneRepository.save({
      order: { id: orderId },
      title: body.title,
      description: body.description,
      dueDate: body.dueDate,
      status: MilestoneStatus.PENDING,
      index: milestoneIndex,
    } as Milestone);
    for (let index = 0; index < body.tasks.length; index++) {
      await this.taskService.createTaskForOrderCustom(
        newMilestone.id,
        body.tasks[index],
        index + 1,
      );
    }
  }

  async updateMilestoneStatusForOrderCustomAfterCheckout(orderId: string): Promise<void> {
    const firstMilestone = await this.milestoneRepository.findOne({
      where: { order: { id: orderId }, index: 1 },
    });
    if (!firstMilestone) throw new NotFoundException('Không tìm thấy mốc công việc');

    firstMilestone.status = MilestoneStatus.IN_PROGRESS;
    const updatedMilestone = await this.milestoneRepository.save(firstMilestone);
    await this.taskService.updateTaskStatusForOrderCustomAfterCheckout(updatedMilestone.id);
  }

  async getOrderMilestones(
    orderId: string,
    take: number,
    skip: number,
    sort?: Sorting,
    filter?: Filtering,
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
}
