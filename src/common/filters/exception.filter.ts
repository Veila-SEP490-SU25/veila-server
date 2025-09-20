import { ErrorResponse } from '@/common/base';
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
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

@Catch(WsException)
export class WsExceptionFilter implements ExceptionFilter {
  catch(exception: WsException, host: ArgumentsHost) {
    const ctx = host.switchToWs();
    const client = ctx.getClient();
    const error = exception.getError();
    let message = 'Internal server error';
    let statusCode = 500;
    if (typeof error === 'string') {
      message = error;
    } else if (typeof error === 'object' && error !== null) {
      const maybeMsg = (error as Record<string, unknown>).message;
      const maybeCode = (error as Record<string, unknown>).statusCode;
      if (typeof maybeMsg === 'string') message = maybeMsg;
      if (typeof maybeCode === 'number') statusCode = maybeCode;
    }
    const errorResponse: ErrorResponse = {
      statusCode,
      message,
    };
    client.emit('exception', errorResponse);
  }
}
