import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction, Wallet } from '@/common/models';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { WalletModule } from '../wallet';
import { MailModule } from '../mail';
import { UserModule } from '../user';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, Wallet]),
    forwardRef(() => WalletModule),
    forwardRef(() => MailModule),
    forwardRef(() => UserModule),
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
  exports: [TransactionService],
})
export class TransactionModule {}
