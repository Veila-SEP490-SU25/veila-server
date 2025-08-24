import { MilestoneStatus, OrderStatus, Task, TaskStatus } from '@/common/models';
import {
  ConflictException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CUTaskDto, TaskDto } from './task.dto';
import { plainToInstance } from 'class-transformer';
import { Filtering, getOrder, getWhere, Sorting } from '@/common/decorators';
import { CreateTask, OrderService } from '@/app/order';
import { ShopService } from '../shop';
import { MilestoneService } from '../milestone';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @Inject(forwardRef(() => ShopService))
    private readonly shopService: ShopService,
    @Inject(forwardRef(() => OrderService))
    private readonly orderService: OrderService,
    @Inject(forwardRef(() => MilestoneService))
    private readonly milestoneService: MilestoneService,
  ) {}

  async createTaskForMilestone(userId: string, id: string, body: CUTaskDto): Promise<Task> {
    const milestone = await this.milestoneService.getMilestoneById(id);
    const order = await this.orderService.getOrderByIdV2(milestone.orderId);
    if (!milestone) throw new NotFoundException('Không tìm thấy mốc công việc');
    if (
      milestone.status === MilestoneStatus.CANCELLED ||
      milestone.status === MilestoneStatus.COMPLETED
    )
      throw new ConflictException('Mốc công việc không còn khả dụng để tạo công việc');
    if (!order) throw new NotFoundException('Không tìm thấy đơn hàng');
    if (order.status !== OrderStatus.PENDING)
      throw new ConflictException('Đơn hàng đang thực hiện/đã hoàn thành/đã hủy');

    await this.validateOwnerOfOrder(userId, milestone.orderId);

    const existingTasks = await this.getTasks(id);

    const task = {
      milestone: { id: id },
      title: body.title,
      description: body.description,
      index: existingTasks.length + 1,
      status: TaskStatus.PENDING,
      dueDate: body.dueDate,
    } as Task;

    return await this.taskRepository.save(task);
  }

  async updateTask(userId: string, id: string, taskId: string, body: CUTaskDto): Promise<void> {
    const milestone = await this.milestoneService.getMilestoneById(id);
    const order = await this.orderService.getOrderByIdV2(milestone.orderId);
    if (!milestone) throw new NotFoundException('Không tìm thấy mốc công việc');
    if (
      milestone.status === MilestoneStatus.CANCELLED ||
      milestone.status === MilestoneStatus.COMPLETED
    )
      throw new ConflictException('Mốc công việc không còn khả dụng để tạo công việc');
    if (!order) throw new NotFoundException('Không tìm thấy đơn hàng');
    if (order.status !== OrderStatus.PENDING)
      throw new ConflictException('Đơn hàng đang thực hiện/đã hoàn thành/đã hủy');

    await this.validateOwnerOfOrder(userId, milestone.orderId);

    const existingTask = await this.taskRepository.findOneBy({
      id: taskId,
    });
    if (!existingTask)
      throw new NotFoundException('Không tìm thấy chi tiết công việc trong mốc công việc');

    existingTask.title = body.title;
    existingTask.description = body.description;
    existingTask.dueDate = body.dueDate;

    await this.taskRepository.save(existingTask);
  }

  async cancelTask(userId: string, id: string, taskId: string): Promise<void> {
    const milestone = await this.milestoneService.getMilestoneById(id);
    if (!milestone) throw new NotFoundException('Không tìm thấy mốc công việc');
    if (
      milestone.status === MilestoneStatus.CANCELLED ||
      milestone.status === MilestoneStatus.COMPLETED
    )
      throw new ConflictException('Mốc công việc không còn khả dụng để tạo công việc');

    await this.validateOwnerOfOrder(userId, milestone.orderId);

    const existingTask = await this.taskRepository.findOneBy({
      id: taskId,
    });
    if (!existingTask)
      throw new NotFoundException('Không tìm thấy chi tiết công việc trong mốc công việc');

    existingTask.status = TaskStatus.CANCELLED;

    await this.taskRepository.save(existingTask);
  }

  async updateTaskStatus(id: string, status: TaskStatus): Promise<void> {
    const existingTask = await this.taskRepository.findOneBy({
      id,
    });
    if (!existingTask)
      throw new NotFoundException('Không tìm thấy chi tiết công việc trong mốc công việc');

    existingTask.status = status;

    await this.taskRepository.save(existingTask);
  }

  async getTasks(milestoneId: string): Promise<TaskDto[]> {
    const tasks = await this.taskRepository.find({
      where: { milestone: { id: milestoneId } },
      relations: ['milestone'],
      order: {
        index: 'ASC',
      },
    });
    return plainToInstance(TaskDto, tasks);
  }

  async getTaskById(id: string): Promise<TaskDto | null> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['milestone'],
    });
    return plainToInstance(TaskDto, task);
  }

  async getTaskByIdV2(id: string): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['milestone'],
    });
    if (!task) throw new NotFoundException('Không tìm thấy công việc');
    return task;
  }

  async deleteTask(userId: string, id: string, taskId: string): Promise<void> {
    const milestone = await this.milestoneService.getMilestoneById(id);
    if (!milestone) throw new NotFoundException('Không tìm thấy mốc công việc');
    if (
      milestone.status === MilestoneStatus.CANCELLED ||
      milestone.status === MilestoneStatus.COMPLETED
    )
      throw new ConflictException('Mốc công việc không còn khả dụng để tạo công việc');

    await this.validateOwnerOfOrder(userId, milestone.orderId);

    const existingTask = await this.taskRepository.findOneBy({
      id: taskId,
    });
    if (!existingTask)
      throw new NotFoundException('Không tìm thấy chi tiết công việc trong mốc công việc');

    if (existingTask.status !== TaskStatus.PENDING)
      throw new ForbiddenException(
        'Công việc đã/đang trong quá trình thực hiện, không cho phép xóa',
      );

    await this.taskRepository.delete(taskId);

    const remainingTasks = await this.taskRepository.find({
      where: { milestone: { id: id } },
      order: { index: 'ASC' },
    });

    // Cập nhật lại index liên tiếp
    for (let i = 0; i < remainingTasks.length; i++) {
      if (remainingTasks[i].index !== i + 1) {
        remainingTasks[i].index = i + 1;
        await this.taskRepository.save(remainingTasks[i]);
      }
    }
  }

  async createTaskForSeeding(task: Task): Promise<Task> {
    return await this.taskRepository.save(task);
  }

  async getTasksByMilestoneId(
    milestoneId: string,
    take: number,
    skip: number,
    sort?: Sorting,
    filter?: Filtering,
  ): Promise<[TaskDto[], number]> {
    const dynamicFilter = getWhere(filter);
    const where = {
      ...dynamicFilter,
      milestone: { id: milestoneId },
    };
    const order = getOrder(sort);
    const [tasks, total] = await this.taskRepository.findAndCount({
      where,
      order,
      take,
      skip,
      relations: { milestone: true },
    });
    const dtos = plainToInstance(TaskDto, tasks);
    return [dtos, total];
  }

  async getTaskByIdAndMilestoneId(milestoneId: string, taskId: string): Promise<TaskDto> {
    const task = await this.taskRepository.findOne({
      where: { id: taskId, milestone: { id: milestoneId } },
      relations: { milestone: true },
    });
    if (!task) throw new NotFoundException('Không tìm thấy công việc trong mốc công việc');
    return plainToInstance(TaskDto, task);
  }

  async getTasksByMilestoneIdV2(milestoneId: string): Promise<Task[]> {
    const tasks = await this.taskRepository.find({
      where: { milestone: { id: milestoneId } },
      order: { index: 'ASC' },
      relations: ['milestone'],
    });
    return tasks;
  }

  async getTaskByIdAndMilestoneIdV2(milestoneId: string, taskId: string): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id: taskId, milestone: { id: milestoneId } },
      relations: { milestone: true },
    });
    if (!task) throw new NotFoundException('Không tìm thấy công việc trong mốc công việc');
    return task;
  }

  async createTaskForOrderCustom(
    milestoneId: string,
    task: CreateTask,
    taskIndex: number,
  ): Promise<void> {
    await this.taskRepository.save({
      milestone: { id: milestoneId },
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      status: TaskStatus.PENDING,
      index: taskIndex,
    });
  }

  async updateTaskStatusForOrderCustomAfterCheckout(milestoneId: string): Promise<void> {
    const firstTask = await this.taskRepository.findOne({
      where: { milestone: { id: milestoneId }, index: 1 },
    });
    if (!firstTask)
      throw new NotFoundException('Không tìm thấy công việc đầu tiên trong mốc công việc');

    firstTask.status = TaskStatus.IN_PROGRESS;

    await this.taskRepository.save(firstTask);
  }

  private async validateOwnerOfOrder(userId: string, orderId: string): Promise<void> {
    const shop = await this.shopService.getShopByUserId(userId);
    if (!shop) throw new NotFoundException('Người dùng này chưa có cửa hàng nào');

    const orders = await this.orderService.getOrderByShopId(shop.id);
    if (!orders || orders.length === 0) {
      throw new NotFoundException(
        'Không tìm thấy đơn hàng đang chờ hoặc đang thực hiện của người dùng này',
      );
    }

    const matchedOrder = orders.find((order) => order.id === orderId);
    if (!matchedOrder) throw new NotFoundException('Đơn hàng không tồn tại');
  }

  async findFirstTaskOfMilestone(milestoneId: string): Promise<Task> {
    const firstTask = await this.taskRepository.findOne({
      where: { milestone: { id: milestoneId } },
      order: { index: 'ASC' },
    });

    if (!firstTask) throw new NotFoundException('Không tìm thấy công việc');
    return firstTask;
  }

  async saveTask(task: Task): Promise<void> {
    await this.taskRepository.save(task);
  }
}
