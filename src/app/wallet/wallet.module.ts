import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from '@/common/models';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { UserModule } from '../user';
import { TransactionModule } from '../transaction';
import { PayosModule } from '../payos/payos.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wallet]),
    UserModule,
    forwardRef(() => TransactionModule),
    PayosModule,
  ],
  controllers: [WalletController],
  providers: [WalletService],
  exports: [WalletService],
})
export class WalletModule {}
