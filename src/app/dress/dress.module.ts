import { Category, Dress } from '@/common/models';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DressController } from '@/app/dress/dress.controller';
import { DressService } from '@/app/dress/dress.service';
import { UserModule } from '@/app/user';

@Module({
  imports: [TypeOrmModule.forFeature([Dress, Category]), forwardRef(() => UserModule)],
  controllers: [DressController],
  providers: [DressService],
  exports: [DressService],
})
export class DressModule {}
