import { ContractService } from '@/app/contract/contract.service';
import { Contract, ContractAcceptance } from '@/common/models';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Contract, ContractAcceptance])],
  controllers: [],
  providers: [ContractService],
  exports: [ContractService],
})
export class ContractModule {}
