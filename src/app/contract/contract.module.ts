import { ContractService } from '@/app/contract/contract.service';
import { Contract } from '@/common/models';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Contract])],
  controllers: [],
  providers: [ContractService],
  exports: [ContractService],
})
export class ContractModule {}
