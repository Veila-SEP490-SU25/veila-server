import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PayosService } from './payos.service';

@Module({
  imports: [ConfigModule],
  providers: [PayosService],
  exports: [PayosService],
})
export class PayosModule {}
