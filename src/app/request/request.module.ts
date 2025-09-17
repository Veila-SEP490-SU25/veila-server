import { AppSettingModule } from '@/app/appsetting';
import { OrderModule } from '@/app/order';
import { RequestController } from '@/app/request/request.controller';
import { RequestService } from '@/app/request/request.service';
import { Request, UpdateRequest } from '@/common/models';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Request, UpdateRequest]),
    forwardRef(() => OrderModule),
    AppSettingModule,
  ],
  controllers: [RequestController],
  providers: [RequestService],
  exports: [RequestService],
})
export class RequestModule {}
