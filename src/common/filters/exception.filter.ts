import { ErrorResponse } from '@/common/base';
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      (exception.getResponse() as { message: string | string[] }).message ||
      'Internal server error';
    const errorResponse: ErrorResponse = {
      statusCode: status,
      message: Array.isArray(message) ? message.join(', ') : message,
    };
    response
      .status(
        status == HttpStatus.INTERNAL_SERVER_ERROR
          ? HttpStatus.INTERNAL_SERVER_ERROR
          : HttpStatus.OK,
      )
      .json(errorResponse);
  }
}
