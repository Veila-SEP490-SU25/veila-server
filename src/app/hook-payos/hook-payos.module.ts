// import { OrderModule } from "@/modules/order/order.module"
// import { Payment } from "@/modules/payment/entities/payment.entity"
// import { PaymentModule } from "@/modules/payment/payment.module"
import { PayosModule } from '@/app/payos/payos.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HookPayosController } from '@/app/hook-payos/hook-payos.controller';
import { HookPayosService } from './hook-payos.service';

@Module({
  imports: [TypeOrmModule.forFeature([PayosModule])],
  controllers: [HookPayosController],
  providers: [HookPayosService],
})
export class HookPayosModule {}
