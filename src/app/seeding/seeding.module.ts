import { SeedingService } from '@/app/seeding/seeding.service';
import { UserModule } from '@/app/user';
import { Module } from '@nestjs/common';

@Module({
  imports: [UserModule],
  providers: [SeedingService],
})
export class SeedingModule {}
