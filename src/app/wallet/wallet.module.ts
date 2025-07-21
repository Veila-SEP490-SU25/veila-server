import { WalletService } from '@/app/wallet/wallet.service';
import { Wallet } from '@/common/models';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet])],
  controllers: [],
  providers: [WalletService],
  exports: [WalletService],
})
export class WalletModule {}
