// import responses from "@/helpers/responses
// import { DeliveryService } from "@/modules/delivery/delivery.service"
// import { OrderService } from "@/modules/order/order.service"
// import { Payment } from "@/modules/payment/entities/payment.entity"
// import { PaymentService } from "@/modules/payment/payment.service"
// import { PayosService } from "@/app/payos/payos.service"
// import { Inject, Injectable } from "@nestjs/common"
// import { InjectRepository } from "@nestjs/typeorm"
// import { Repository } from "typeorm"
// import { HandlePayOSWebhook, PayOSReturnDTO } from "@/app/hook-payos/hook-payos.dto"

// @Injectable()
export class HookPayosService {
  //   constructor(
  //     @InjectRepository(Payment) private paymentRepository: Repository<Payment>,
  //     private readonly paymentService: PaymentService,
  //     private readonly payosService: PayosService,
  //     @Inject(OrderService) private readonly orderService: OrderService
  //   ) {}
  //   async handlePayOSWebhook(data: HandlePayOSWebhook): Promise<string> {
  //     if (data.content === "VQRIO123") return "Webhook processed successfully"
  //     return await this.paymentService.handlePayOSWebhook(data)
  //   }
  //   async confirmWebhook() {
  //     return await this.payosService.confirmWebhook("https://koinebackend.site/api/hook-payos/receive-hook")
  //   }
  //   async returnWebhook(data: PayOSReturnDTO): Promise<void> {
  //     if (data.code !== "00") {
  //       throw responses.response400BadRequest("Invalid transaction")
  //     }
  //     if (data.cancel && data.status === "CANCELLED") {
  //       const orderPayOsCode = data.orderCode
  //       const paymentInfo = await this.payosService.getPaymentLinkInformation(orderPayOsCode)
  //       const orderCode = paymentInfo.orderCode
  //       if (!orderCode) {
  //         throw responses.response404NotFound("Order Code is not found in webhook content")
  //       }
  //       const order = await this.orderService.getOrderByOrderCode(orderCode)
  //       if (!order) {
  //         throw responses.response404NotFound("Order is not found or has been deleted")
  //       }
  //       const payment = await this.paymentRepository.findOne({
  //         where: {
  //           orderId: order.id,
  //           payAmount: order.totalAmount,
  //           isDeleted: false
  //         }
  //       })
  //       // 3. Kiểm tra trùng lặp, trạng thái, số tiền
  //       if (!payment) {
  //         throw responses.response404NotFound("Payment is not found or amount mismatch")
  //       }
  //       if (payment.payStatus === "SUCCESS") {
  //         throw responses.response409Conflict("Webhook is already processed")
  //       }
  //       // 4. Cập nhật trạng thái Payment
  //       payment.payStatus = "FAILED"
  //       payment.payDate = new Date()
  //       await this.paymentRepository.save(payment)
  //       // 5. Cập nhật trạng thái Order
  //       await this.orderService.updateStatus(order.id, { status: "FAILED_PAYMENT" })
  //     }
  //   }
}
