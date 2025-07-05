import { AccessoryModule } from '@/app/accessory';
import { BlogModule } from '@/app/blog';
import { CategoryModule } from '@/app/category';
import { DressModule } from '@/app/dress';
import { PasswordModule } from '@/app/password';
import { SeedingService } from '@/app/seeding/seeding.service';
import { ServiceModule } from '@/app/service';
import { ShopModule } from '@/app/shop';
import { UserModule } from '@/app/user';
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
  ],
  providers: [SeedingService],
})
export class SeedingModule {}
