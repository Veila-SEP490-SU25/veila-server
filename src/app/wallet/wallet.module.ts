import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from '@/common/models';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { UserModule } from '../user';
import { TransactionModule } from '../transaction';
import { PayosModule } from '../payos/payos.module';
import { ShopModule } from '../shop';
import { OrderModule } from '../order';
import { PasswordModule } from '../password';
import { RedisModule } from '../redis';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wallet]),
    UserModule,
    forwardRef(() => TransactionModule),
    PayosModule,
    ShopModule,
    forwardRef(() => OrderModule),
    forwardRef(() => PasswordModule),
    forwardRef(() => RedisModule),
  ],
  controllers: [WalletController],
  providers: [WalletService],
  exports: [WalletService],
})
export class WalletModule {}
