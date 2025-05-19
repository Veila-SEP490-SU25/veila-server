import { PasswordService } from '@/app/password/password.service';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  providers: [PasswordService],
  exports: [PasswordService],
})
export class PasswordModule {}
