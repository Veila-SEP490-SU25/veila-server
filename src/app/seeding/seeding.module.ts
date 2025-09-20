import { AccessoryModule } from '@/app/accessory';
import { AppSettingModule } from '@/app/appsetting';
import { BlogModule } from '@/app/blog';
import { CategoryModule } from '@/app/category';
import { ContractModule } from '@/app/contract';
import { DressModule } from '@/app/dress';
import { FeedbackModule } from '@/app/feedback';
import { OrderModule } from '@/app/order';
import { PasswordModule } from '@/app/password';
import { RequestModule } from '@/app/request';
import { SeedingService } from '@/app/seeding/seeding.service';
import { ServiceModule } from '@/app/service';
import { ShopModule } from '@/app/shop';
import { SubscriptionModule } from '@/app/subscription';
import { TaskModule } from '@/app/task';
import { TransactionModule } from '@/app/transaction';
import { UserModule } from '@/app/user';
import { WalletModule } from '@/app/wallet';
import { forwardRef, Module } from '@nestjs/common';

@Module({
  imports: [
    forwardRef(() => UserModule),
    PasswordModule,
    forwardRef(() => AccessoryModule),
    BlogModule,
    CategoryModule,
    DressModule,
    ServiceModule,
    ShopModule,
    ContractModule,
    SubscriptionModule,
    WalletModule,
    OrderModule,
    TaskModule,
    TransactionModule,
    FeedbackModule,
    RequestModule,
    AppSettingModule,
  ],
  providers: [SeedingService],
})
export class SeedingModule {}
