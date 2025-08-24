import { MembershipService } from '@/app/membership/membership.service';
import { Membership } from '@/common/models';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MembershipController } from './membership.controller';
import { SubscriptionModule } from '../subscription';
import { ShopModule } from '../shop';
import { WalletModule } from '@/app/wallet/wallet.module';
import { TransactionModule } from '@/app/transaction/transaction.module';
import { UserModule } from '@/app/user/user.module';
import { RedisModule } from '../redis';
import { PasswordModule } from '../password';

@Module({
  imports: [
    TypeOrmModule.forFeature([Membership]),
    SubscriptionModule,
    forwardRef(() => ShopModule),
    forwardRef(() => WalletModule),
    forwardRef(() => TransactionModule),
    forwardRef(() => UserModule),
    forwardRef(() => RedisModule),
    forwardRef(() => PasswordModule),
  ],
  controllers: [MembershipController],
  providers: [MembershipService],
  exports: [MembershipService],
})
export class MembershipModule {}
