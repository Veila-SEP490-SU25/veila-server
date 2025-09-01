import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const Origin = createParamDecorator((_, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<Request>();
  return request.get('origin') || request.get('host');
});
