import { Task, TaskStatus } from '@/common/models';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CUTaskDto, TaskDto } from './task.dto';
import { plainToInstance } from 'class-transformer';
import { Filtering, getOrder, getWhere, Sorting } from '@/common/decorators';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async saveTask(milestoneId: string, newTasks: CUTaskDto[]): Promise<void> {
    const tasks = newTasks.map((newTask, index) => ({
      milestoneId,
      title: newTask.title,
      description: newTask.description,
      // ghi chú: index sẽ được đánh từ 1
      index: index + 1,
      status: index === 1 ? TaskStatus.IN_PROGRESS : TaskStatus.PENDING,
      dueDate: newTask.dueDate,
    }));
    await this.taskRepository.save(plainToInstance(Task, tasks));
  }

  async updateTask(id: string, task: CUTaskDto): Promise<void> {
    const existingTask = await this.taskRepository.findOneBy({
      id,
    });
    if (!existingTask)
      throw new NotFoundException('Không tìm thấy chi tiết công việc trong mốc công việc');

    existingTask.title = task.title;
    existingTask.description = task.description;
    existingTask.dueDate = task.dueDate;

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

  async deleteTask(id: string): Promise<void> {
    const existingTask = await this.taskRepository.findOneBy({ id });
    if (!existingTask) throw new NotFoundException('Không tìm thấy công việc trong mốc công việc');

    if (existingTask.status !== TaskStatus.PENDING)
      throw new ForbiddenException('Công việc đã/đang trong quá trình thực hiện');

    await this.taskRepository.delete(id);
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
}
