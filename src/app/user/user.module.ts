import { UserService } from '@/app/user/user.service';
import { User } from '@/common/models';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from '@/app/user/user.controller';
import { PasswordModule } from '@/app/password';

@Module({
  imports: [TypeOrmModule.forFeature([User]), PasswordModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
