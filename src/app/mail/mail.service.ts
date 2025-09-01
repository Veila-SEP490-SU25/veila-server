import { TransactionStatus } from '@/common/models';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendCancelOrder(
    email: string,
    username: string,
    orderId: string,
    date: string,
  ): Promise<boolean> {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Đơn hàng của bạn tại Veila đã bị hủy',
        template: 'cancel-order',
        context: {
          orderId,
          username,
          date,
        },
      });
      return true;
    } catch (error) {
      console.error(error);
      throw new UnprocessableEntityException(`Gửi email tạo mã PIN tới ${email} thất bại.`);
    }
  }

  async sendCheckoutOrder(
    email: string,
    username: string,
    orderId: string,
    total: number,
    date: string,
  ): Promise<boolean> {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Đơn hàng của bạn tại Veila đã được thanh toán',
        template: 'checkout-order',
        context: {
          orderId,
          username,
          total,
          date,
        },
      });
      return true;
    } catch (error) {
      console.error(error);
      throw new UnprocessableEntityException(`Gửi email tạo mã PIN tới ${email} thất bại.`);
    }
  }

  async sendCreateOrder(
    email: string,
    username: string,
    orderId: string,
    productName: string,
    total: number,
    date: string,
  ): Promise<boolean> {
    const quantity = 1;
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Đơn hàng của bạn tại Veila đã được tạo',
        template: 'create-order',
        context: {
          orderId,
          username,
          productName,
          quantity,
          total,
          date,
        },
      });
      return true;
    } catch (error) {
      console.error(error);
      throw new UnprocessableEntityException(`Gửi email tạo mã PIN tới ${email} thất bại.`);
    }
  }

  async sendUnlockBalance(
    email: string,
    username: string,
    orderId: string,
    amount: number,
    date: string,
  ): Promise<boolean> {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Đơn hàng được giải ngân',
        template: 'unlock-balance',
        context: {
          username,
          orderId,
          amount,
          date,
        },
      });
      return true;
    } catch (error) {
      console.error(error);
      throw new UnprocessableEntityException(`Gửi email tạo mã PIN tới ${email} thất bại.`);
    }
  }

  async sendVerifyOrder(
    email: string,
    username: string,
    orderId: string,
    productName: string,
    total: number,
    date: string,
  ): Promise<boolean> {
    const quantity = 1;
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Đơn hàng của bạn tại Veila đã được cửa hàng xác nhận',
        template: 'verify-order',
        context: {
          orderId,
          username,
          productName,
          quantity,
          total,
          date,
        },
      });
      return true;
    } catch (error) {
      console.error(error);
      throw new UnprocessableEntityException(`Gửi email tạo mã PIN tới ${email} thất bại.`);
    }
  }

  async sendWithdrawAnswer(
    email: string,
    username: string,
    transactionStatus: TransactionStatus,
    amount: number,
    date: string,
  ): Promise<boolean> {
    const status = transactionStatus === TransactionStatus.COMPLETED ? 'ĐƯỢC CHẤP NHẬN' : 'TỪ CHỐI';
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Kết quả yêu cầu rút tiền từ ví Veila của bạn',
        template: 'withdraw-answer',
        context: {
          username,
          status,
          amount,
          date,
        },
      });
      return true;
    } catch (error) {
      console.error(error);
      throw new UnprocessableEntityException(`Gửi email tạo mã PIN tới ${email} thất bại.`);
    }
  }

  async sendOtpEmail(
    subject: string,
    email: string,
    username: string,
    activationCode: string,
  ): Promise<boolean> {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: subject,
        template: 'welcome',
        context: {
          username,
          activationCode,
        },
      });
      return true;
    } catch (error) {
      console.log(error);
      throw new UnprocessableEntityException(`Gặp lỗi khi gửi email chào mừng đến ${email}`);
    }
  }

  async sendWelcomeWithPasswordEmail(
    email: string,
    username: string,
    password: string,
  ): Promise<boolean> {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Tài khoản Veila của bạn đã được tạo',
        template: 'welcome-password',
        context: {
          username,
          email,
          password,
        },
      });
      return true;
    } catch (error) {
      console.error(error);
      throw new UnprocessableEntityException(`Gửi email tạo tài khoản tới ${email} thất bại.`);
    }
  }

  async sendCreatePinEmail(email: string, username: string): Promise<boolean> {
    try {
      const pin = '******';
      await this.mailerService.sendMail({
        to: email,
        subject: 'Bạn đã tạo mã PIN cho ví Veila',
        template: 'create-pin',
        context: {
          username,
          pin,
        },
      });
      return true;
    } catch (error) {
      console.error(error);
      throw new UnprocessableEntityException(`Gửi email tạo mã PIN tới ${email} thất bại.`);
    }
  }
}
