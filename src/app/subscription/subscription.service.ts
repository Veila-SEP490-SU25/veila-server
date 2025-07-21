import { Subscription } from '@/common/models';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
  ) {}

  async findAll(): Promise<Subscription[]> {
    return this.subscriptionRepository.find({ withDeleted: true });
  }

  async findOneByDuration(duration: number): Promise<Subscription | null> {
    return this.subscriptionRepository.findOne({
      where: { duration },
      withDeleted: true,
    });
  }

  async create(subscription: Subscription): Promise<void> {
    await this.subscriptionRepository.save(subscription);
  }
}
