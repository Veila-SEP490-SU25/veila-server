import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction, Wallet } from '@/common/models';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { WalletModule } from '../wallet';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, Wallet]), forwardRef(() => WalletModule)],
  controllers: [TransactionController],
  providers: [TransactionService],
  exports: [TransactionService],
})
export class TransactionModule {}
