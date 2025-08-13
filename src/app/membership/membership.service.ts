import { Membership, MembershipStatus, Subscription } from '@/common/models';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class MembershipService {
  constructor(
    @InjectRepository(Membership)
    private readonly membershipRepository: Repository<Membership>,
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
  ) {}

  async findAll(): Promise<Membership[]> {
    return this.membershipRepository.find({ withDeleted: true });
  }

  async findOne(shopId: string): Promise<Membership | null> {
    return this.membershipRepository.findOne({
      where: { shop: { id: shopId } },
      withDeleted: true,
    });
  }

  async createForSeeding(membership: Membership): Promise<Membership> {
    return await this.membershipRepository.save(membership);
  }

  async registerMembership(shopId: string, subscriptionId: string): Promise<void> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { id: subscriptionId },
    });
    if (!subscription) throw new NotFoundException('Không tìm thấy gói đăng ký phù hợp');

    const membership = await this.membershipRepository.findOne({
      where: {
        shop: { id: shopId },
        status: MembershipStatus.ACTIVE,
      },
    });
    if (membership) {
      await this.membershipRepository.update(membership.id, {
        status: MembershipStatus.INACTIVE,
      });
    }

    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + subscription.duration);
    const newMembership = this.membershipRepository.create({
      shop: { id: shopId },
      subscription,
      startDate,
      endDate,
      status: MembershipStatus.ACTIVE,
    } as Membership);
    await this.membershipRepository.save(newMembership);
  }
}
