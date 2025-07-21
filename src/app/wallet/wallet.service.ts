import { Wallet } from '@/common/models';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class WalletService {
  constructor(@InjectRepository(Wallet) private readonly walletRepository: Repository<Wallet>) {}

  async findAll(): Promise<Wallet[]> {
    return this.walletRepository.find({ withDeleted: true });
  }

  async findOneByUserId(userId: string): Promise<Wallet | null> {
    return this.walletRepository.findOne({
      where: { user: { id: userId } },
      withDeleted: true,
    });
  }

  async create(wallet: Wallet): Promise<void> {
    await this.walletRepository.save(wallet);
  }
}
