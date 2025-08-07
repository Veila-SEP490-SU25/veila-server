import { Task, TaskStatus } from '@/common/models';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CUTaskDto, taskDto } from './task.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async saveTask(milestoneId: string, newTasks: CUTaskDto[]): Promise<void> {
    const tasks = newTasks.map((newTask) => ({
      milestoneId,
      title: newTask.title,
      description: newTask.description,
      index: newTask.index,
      status: TaskStatus.PENDING,
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
    existingTask.index = task.index;
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

  async getTasks(milestoneId: string): Promise<taskDto[]> {
    const tasks = await this.taskRepository.find({
      where: { milestone: { id: milestoneId } },
      relations: ['milestone'],
      order: {
        index: 'ASC',
      },
    });
    return plainToInstance(taskDto, tasks);
  }

  async getTaskById(id: string): Promise<taskDto | null> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['milestone'],
    });
    return plainToInstance(taskDto, task);
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
}
