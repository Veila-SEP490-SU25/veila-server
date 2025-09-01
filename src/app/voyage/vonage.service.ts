import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Vonage } from '@vonage/server-sdk';
import { PasswordService } from '../password';
import { RedisService } from '../redis';

@Injectable()
export class VonageService {
  private readonly vonage: Vonage;
  constructor(
    private readonly configService: ConfigService,
    private readonly passwordService: PasswordService,
    private readonly redisService: RedisService,
  ) {
    this.vonage = new Vonage({
      apiKey: this.configService.get<string>('VONAGE_API_KEY'),
      apiSecret: this.configService.get<string>('VONAGE_API_SECRET'),
    });
  }

  async sendSMS(userId: string, to: string): Promise<boolean> {
    const otp = this.passwordService.generateOTP(6);
    const hashedOtp = await this.passwordService.hashPassword(otp);
    await this.redisService.set(`${userId}:phone-otp`, hashedOtp, 5 * 60 * 1000);

    try {
      const response = await this.vonage.sms.send({
        to,
        from: '84966316803', // must be a real number, not a made-up string
        text: otp,
      });

      const message = response.messages?.[0];

      if (message.status !== '0') {
        return false;
      }

      return true;
    } catch (error) {
      console.error('SMS sending failed:', error);
      if (error?.response?.messages?.[0]) {
        const failMessage = error.response.messages[0];
        console.error(
          `Vonage Failure Details — Status: ${failMessage.status}, Error: ${failMessage['error-text']}`,
        );
      }
      return false;
    }
  }
}
