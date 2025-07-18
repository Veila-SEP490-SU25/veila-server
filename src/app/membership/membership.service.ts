import { Membership } from '@/common/models';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class MembershipService {
  constructor(
    @InjectRepository(Membership)
    private readonly membershipRepository: Repository<Membership>,
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

  async create(membership: Membership): Promise<void> {
    await this.membershipRepository.save(membership);
  }
}
