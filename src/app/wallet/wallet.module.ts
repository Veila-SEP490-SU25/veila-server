import { WalletService } from '@/app/wallet/wallet.service';
import { Wallet } from '@/common/models';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletController } from './wallet.controller';
import { UserModule } from '../user';
import { TransactionModule } from '../transaction';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet]), UserModule, TransactionModule, WalletModule],
  controllers: [WalletController],
  providers: [WalletService],
  exports: [WalletService],
})
export class WalletModule {}
