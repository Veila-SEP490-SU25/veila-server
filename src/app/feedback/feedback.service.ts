import { Feedback } from '@/common/models';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(Feedback)
    private readonly feedbackRepository: Repository<Feedback>,
  ) {}

  async getAllFeedbacks(): Promise<Feedback[]> {
    return await this.feedbackRepository.find({
      withDeleted: true,
    });
  }

  async createFeedbackForSeeding(feedback: Feedback): Promise<Feedback> {
    return await this.feedbackRepository.save(feedback);
  }
}
