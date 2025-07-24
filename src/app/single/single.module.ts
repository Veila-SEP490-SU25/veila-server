import { SingleController, SingleService } from '@/app/single';
import { Slide } from '@/common/models/single/slide.model';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Slide])],
  controllers: [SingleController],
  providers: [SingleService],
  exports: [SingleService],
})
export class SingleModule {}
