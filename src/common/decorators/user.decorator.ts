import { TokenPayload } from '@/app/token';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserId = createParamDecorator((_, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const tokenPayload: TokenPayload = request.tokenPayload;
  return tokenPayload.id;
});
