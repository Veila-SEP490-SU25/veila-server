import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Token = createParamDecorator((_, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.token;
});
