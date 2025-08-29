import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationDto } from '@/app/notification/notification.dto';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly service: NotificationService) {}

  @Post('send')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
  async send(@Body() dto: NotificationDto) {
    return this.service.send(dto);
  }
}
