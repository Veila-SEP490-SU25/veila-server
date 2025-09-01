import { SendMessageDto } from "@/app/voyage/vonage.dto";
import { VonageService } from "@/app/voyage/vonage.service";
import { Body, Controller, Post } from "@nestjs/common";

@Controller('vonage')
export class VonageController {
  constructor(private readonly vonageService: VonageService) {}

  @Post('send-sms')
  async sendSMS(@Body() body: SendMessageDto) {
    const res = this.vonageService.sendSMS(body.to, '567898');
    return res;
  }
}