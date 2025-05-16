import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendWelcomEmail(
    email: string,
    username: string,
    activationCode: string,
  ): Promise<boolean> {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Chào mừng đến với Veila',
        template: 'welcome',
        context: {
          username,
          activationCode,
        },
      });
      return true;
    } catch (error) {
      console.log(error);
      throw new UnprocessableEntityException(
        `Gặp lỗi khi gửi email chào mừng đến ${email}`,
      );
    }
  }
}
