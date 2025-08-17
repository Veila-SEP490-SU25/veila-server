import { CUSubscriptionDto } from '@/app/subscription/subscription.dto';
import { Filtering, getOrder, getWhere, Sorting } from '@/common/decorators';
import { Subscription, UserRole } from '@/common/models';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
  ) {}

  async createSubscription(body: CUSubscriptionDto): Promise<Subscription> {
    return await this.subscriptionRepository.save({ ...body });
  }

  async updateSubscription(id: string, body: CUSubscriptionDto): Promise<void> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { id },
      withDeleted: true,
    });
    if (!subscription) throw new NotFoundException(`Subscription with id ${id} not found`);
    await this.subscriptionRepository.update(id, { ...body });
  }

  async removeSubscription(id: string): Promise<void> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { id },
      withDeleted: true,
    });
    if (!subscription) throw new NotFoundException(`Subscription with id ${id} not found`);
    await this.subscriptionRepository.softDelete(id);
  }

  async restoreSubscription(id: string): Promise<void> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { id },
      withDeleted: true,
    });
    if (!subscription) throw new NotFoundException(`Subscription with id ${id} not found`);
    await this.subscriptionRepository.restore(id);
  }

  async getSubscriptions(
    currentRole: UserRole,
    take: number,
    skip: number,
    sort?: Sorting,
    filter?: Filtering,
  ): Promise<[Subscription[], number]> {
    if (
      currentRole === UserRole.ADMIN ||
      currentRole === UserRole.SUPER_ADMIN ||
      currentRole === UserRole.STAFF
    ) {
      const dynamicFilter = getWhere(filter);
      const where = {
        ...dynamicFilter,
      };
      const order = getOrder(sort);

      return await this.subscriptionRepository.findAndCount({
        where,
        order,
        take,
        skip,
        withDeleted: true,
      });
    } else {
      const dynamicFilter = getWhere(filter);
      const where = {
        ...dynamicFilter,
      };
      const order = getOrder(sort);

      return await this.subscriptionRepository.findAndCount({
        where,
        order,
        take,
        skip,
      });
    }
  }

  async getSubscription(currentRole: UserRole, id: string): Promise<Subscription> {
    if (
      currentRole === UserRole.ADMIN ||
      currentRole === UserRole.SUPER_ADMIN ||
      currentRole === UserRole.STAFF
    ) {
      const subscription = await this.subscriptionRepository.findOne({
        where: { id },
        withDeleted: true,
      });
      if (!subscription) throw new NotFoundException(`Subscription with id ${id} not found`);
      return subscription;
    } else {
      const subscription = await this.subscriptionRepository.findOne({
        where: { id },
      });
      if (!subscription) throw new NotFoundException(`Subscription with id ${id} not found`);
      return subscription;
    }
  }

  async getAllForSeeding(): Promise<Subscription[]> {
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
