import { Contract, ContractType } from '@/common/models';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ContractService {
  constructor(
    @InjectRepository(Contract) private readonly contractRepository: Repository<Contract>,
  ) {}

  async findAll(): Promise<Contract[]> {
    return this.contractRepository.find({ withDeleted: true });
  }

  async findOne(type: ContractType): Promise<Contract | null> {
    return this.contractRepository.findOne({
      where: { contractType: type },
      withDeleted: true,
    });
  }

  async create(contract: Contract): Promise<void> {
    await this.contractRepository.save(contract);
  }
}
