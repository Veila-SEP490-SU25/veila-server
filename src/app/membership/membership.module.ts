import { MembershipService } from '@/app/membership/membership.service';
import { Membership, Subscription } from '@/common/models';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Membership,Subscription])],
  controllers: [],
  providers: [MembershipService],
  exports: [MembershipService],
})
export class MembershipModule {}
