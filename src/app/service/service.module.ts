import { Category, Service } from '@/common/models';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceController } from '@/app/service/service.controller';
import { ServiceService } from '@/app/service/service.service';

@Module({
  imports: [TypeOrmModule.forFeature([Service, Category])],
  controllers: [ServiceController],
  providers: [ServiceService],
  exports: [ServiceService],
})
export class ServiceModule {}
