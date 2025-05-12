import { AppService } from '@/app/app.service';
import { Controller, Get } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';

@Controller()
@ApiExcludeController()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("hello")
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('handled-error')
  getHandledError(): string {
    return this.appService.getHandledError();
  }

  @Get('server-error')
  getServerError(): string {
    return this.appService.getServerError();
  }
}