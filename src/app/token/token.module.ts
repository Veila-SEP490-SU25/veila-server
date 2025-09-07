import { TokenService } from '@/app/token/token.service';
import { UserModule } from '@/app/user';
import { forwardRef, Global, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Global()
@Module({
  imports: [forwardRef(() => UserModule)],
  providers: [JwtService, TokenService],
  exports: [JwtService, TokenService],
})
export class TokenModule {}
