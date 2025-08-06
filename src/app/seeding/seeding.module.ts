import { AccessoryModule } from '@/app/accessory';
import { BlogModule } from '@/app/blog';
import { CategoryModule } from '@/app/category';
import { ContractModule } from '@/app/contract';
import { DressModule } from '@/app/dress';
import { FeedbackModule } from '@/app/feedback';
import { MembershipModule } from '@/app/membership';
import { MilestoneModule } from '@/app/milestone';
import { OrderModule } from '@/app/order';
import { OrderAccessoriesDetailsModule } from '@/app/order-accessories-details';
import { OrderDressDetailsModule } from '@/app/order-dress-details';
import { PasswordModule } from '@/app/password';
import { SeedingService } from '@/app/seeding/seeding.service';
import { ServiceModule } from '@/app/service';
import { ShopModule } from '@/app/shop';
import { SubscriptionModule } from '@/app/subscription';
import { TaskModule } from '@/app/task';
import { TransactionModule } from '@/app/transaction';
import { UserModule } from '@/app/user';
import { WalletModule } from '@/app/wallet';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    UserModule,
    PasswordModule,
    AccessoryModule,
    BlogModule,
    CategoryModule,
    DressModule,
    ServiceModule,
    ShopModule,
    ContractModule,
    SubscriptionModule,
    WalletModule,
    MembershipModule,
    OrderModule,
    OrderAccessoriesDetailsModule,
    OrderDressDetailsModule,
    MilestoneModule,
    TaskModule,
    TransactionModule,
    FeedbackModule,
  ],
  providers: [SeedingService],
})
export class SeedingModule {}
