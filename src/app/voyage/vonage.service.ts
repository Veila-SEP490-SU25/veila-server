import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Vonage } from '@vonage/server-sdk';

@Injectable()
export class VonageService {
  private readonly vonage: Vonage;
  constructor(private readonly configService: ConfigService) {
    this.vonage = new Vonage({
      apiKey: this.configService.get<string>('VONAGE_API_KEY'),
      apiSecret: this.configService.get<string>('VONAGE_API_SECRET'),
    });
  }

  async sendSMS(to: string, text: string): Promise<any> {
    console.log(`Sending SMS to ${to}: ${text}`);
    try {
      const response = await this.vonage.sms.send({
        to,
        from: '84966316803', // must be a real number, not a made-up string
        text,
      });

      const message = response.messages?.[0];

      if (message.status !== '0') {
        // Log the actual error message from Vonage
        console.error(
          `Vonage SMS failed - Status: ${message.status}, Error: ${message['error-text']}`,
        );
        throw new Error(message['error-text']);
      }

      console.log(`SMS sent successfully: ${JSON.stringify(response)}`);
      return response;
    } catch (error) {
      console.error('SMS sending failed:', error);
      if (error?.response?.messages?.[0]) {
        const failMessage = error.response.messages[0];
        console.error(
          `Vonage Failure Details — Status: ${failMessage.status}, Error: ${failMessage['error-text']}`,
        );
      }
      throw error;
    }
  }
}
