import { Contract, ContractAcceptance, ContractStatus } from '@/common/models';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ContractService {
  constructor(
    @InjectRepository(Contract) private readonly contractRepository: Repository<Contract>,
    @InjectRepository(ContractAcceptance)
    private readonly contractAcceptanceRepository: Repository<ContractAcceptance>,
  ) {}

  async acceptContract(userId: string, contractId: string): Promise<void> {
    const contract = await this.contractRepository.exists({
      where: { id: contractId, status: ContractStatus.ACTIVE },
    });
    if (!contract) throw new NotFoundException('Không tìm thấy hợp đồng phù hợp');

    const acceptContract = { user: { id: userId }, contract: { id: contractId } };

    const existingAcceptance = await this.contractAcceptanceRepository.existsBy({
      ...acceptContract,
    });
    if (existingAcceptance) throw new ConflictException('Bạn đã đồng ý với hợp đồng này rồi');

    await this.contractAcceptanceRepository.save({ ...acceptContract });
  }
}
