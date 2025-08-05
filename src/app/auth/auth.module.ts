import { AuthController } from '@/app/auth/auth.controller';
import { AuthService } from '@/app/auth/auth.service';
import { ContractModule } from '@/app/contract';
import { MailModule } from '@/app/mail';
import { UserModule } from '@/app/user';
import { WalletModule } from '@/app/wallet';
import { Module } from '@nestjs/common';

@Module({
  imports: [MailModule, UserModule, ContractModule, WalletModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
