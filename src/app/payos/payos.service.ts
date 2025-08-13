import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import PayOS from '@payos/node';
import {
  CheckoutRequestType,
  CheckoutResponseDataType,
  PaymentLinkDataType,
  WebhookType,
} from '@payos/node/lib/type';

@Injectable()
export class PayosService {
  private payOS: PayOS;

  constructor(private readonly configService: ConfigService) {
    this.payOS = new PayOS(
      this.configService.get<string>('PAYOS_CLIENT_ID') as string,
      this.configService.get<string>('PAYOS_API_KEY') as string,
      this.configService.get<string>('PAYOS_CHECKSUM_KEY') as string,
    );
  }

  async createPaymentLink(orderData: CheckoutRequestType): Promise<CheckoutResponseDataType> {
    return await this.payOS.createPaymentLink(orderData);
  }

  async confirmWebhook(webhookUrl: string) {
    return await this.payOS.confirmWebhook(webhookUrl);
  }

  async getPaymentLinkInformation(orderId: string | number): Promise<PaymentLinkDataType> {
    return await this.payOS.getPaymentLinkInformation(orderId);
  }

  verifyWebhook(rawBody: WebhookType) {
    return this.payOS.verifyPaymentWebhookData(rawBody);
  }

  buildCheckoutRequest(input: {
    orderCode: number;
    amount: number;
    description: string;
    returnUrl?: string;
    cancelUrl?: string;
    buyerName?: string;
    expiredAt?: number;
  }): CheckoutRequestType {
    return {
      orderCode: input.orderCode,
      amount: input.amount,
      description: input.description,
      returnUrl: input.returnUrl ?? (this.configService.get<string>('PAYOS_RETURN_URL') as string),
      cancelUrl: input.cancelUrl ?? (this.configService.get<string>('PAYOS_CANCEL_URL') as string),
      buyerName: input.buyerName,
      expiredAt: input.expiredAt,
    } as CheckoutRequestType;
  }
}
