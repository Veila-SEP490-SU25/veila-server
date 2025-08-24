import { TokenPayload } from '@/app/token';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserId = createParamDecorator((_, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const tokenPayload: TokenPayload = request.tokenPayload;
  return tokenPayload.id;
});

export const CurrentUser = createParamDecorator((_, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});

export const CurrentRole = createParamDecorator((_, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const tokenPayload: TokenPayload = request.tokenPayload;
  return tokenPayload.role;
  return tokenPayload ? tokenPayload.role : null;
});
