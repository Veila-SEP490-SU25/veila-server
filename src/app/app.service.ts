import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getHandledError(): string {
    throw new BadRequestException('This is a handled error');
  }

  getServerError(): string {
    throw new InternalServerErrorException('This is a server error');
  }
}
