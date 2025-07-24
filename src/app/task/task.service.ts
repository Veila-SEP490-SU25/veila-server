import { Task } from '@/common/models';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CUTaskDto, TaskDto } from './task.dto';
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
      status: newTask.status,
      dueDate: newTask.dueDate,
    }));
    await this.taskRepository.save(plainToInstance(Task, tasks));
  }

  async getTasks(milestoneId: string): Promise<TaskDto[]> {
    const tasks = await this.taskRepository.find({
      where: { milestone: { id: milestoneId } },
      relations: ['milestone'],
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
}
