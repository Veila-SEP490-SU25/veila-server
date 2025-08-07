import { UpdateRequestController } from '@/app/update-request/update-request.controller';
import { UpdateRequestService } from '@/app/update-request/update-request.service';
import { Request, UpdateRequest } from '@/common/models';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([UpdateRequest, Request])],
  controllers: [UpdateRequestController],
  providers: [UpdateRequestService],
  exports: [UpdateRequestService],
})
export class UpdateRequestModule {}
