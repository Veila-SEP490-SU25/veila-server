import { AuthController } from '@/app/auth/auth.controller';
import { AuthService } from '@/app/auth/auth.service';
import { ContractModule } from '@/app/contract';
import { MailModule } from '@/app/mail';
import { UserModule } from '@/app/user';
import { Module } from '@nestjs/common';

@Module({
  imports: [MailModule, UserModule, ContractModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
