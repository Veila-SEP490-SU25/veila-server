import { MailService } from '@/app/mail/mail.service';
import { ItemResponse } from '@/common/base';
import { Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post()
  @ApiExcludeEndpoint()
  async sendWelcome(): Promise<ItemResponse<boolean>> {
    return {
      statusCode: HttpStatus.OK,
      message: 'Gửi email thành công',
      item: await this.mailService.sendOtpEmail('Hi','ngocngocthuc@gmail.com', 'thucnee', '123456'),
    };
  }
}
