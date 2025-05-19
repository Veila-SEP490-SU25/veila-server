import { AuthController } from '@/app/auth/auth.controller';
import { AuthService } from '@/app/auth/auth.service';
import { MailModule } from '@/app/mail';
import { UserModule } from '@/app/user';
import { Module } from '@nestjs/common';

@Module({
  imports: [MailModule, UserModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
