import { AccessoryModule } from '@/app/accessory';
import { BlogModule } from '@/app/blog';
import { CategoryModule } from '@/app/category';
import { ContractModule } from '@/app/contract';
import { DressModule } from '@/app/dress';
import { MembershipModule } from '@/app/membership';
import { PasswordModule } from '@/app/password';
import { RequestModule } from '@/app/request';
import { SeedingService } from '@/app/seeding/seeding.service';
import { ServiceModule } from '@/app/service';
import { ShopModule } from '@/app/shop';
import { SubscriptionModule } from '@/app/subscription';
import { UpdateRequestModule } from '@/app/update-request';
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
    RequestModule,
    UpdateRequestModule,
  ],
  providers: [SeedingService],
})
export class SeedingModule {}
