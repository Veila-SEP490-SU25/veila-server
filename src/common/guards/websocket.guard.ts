import { RedisService, TokenService } from '@/app';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
    private readonly redisService: RedisService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToWs().getClient();
    const token = request.handshake.headers.authorization;
    if (!token) {
        request.emit('exception', {
          statusCode: 401,
          message: 'Không tìm thấy token hợp lệ.',
        });
        request.disconnect();
        return false;
    }
    const isBlacklist: boolean = JSON.parse(
      (await this.redisService.get(`token:blacklist:${token}`)) || 'false',
    );
    if (isBlacklist) {
      request.emit('exception', {
        statusCode: 401,
        message: 'Token đã bị vô hiệu hoá.',
      });
      request.disconnect();
      return false;
    }
    const tokenPayload = await this.tokenService.validateTokenForWs(token);
    if (!tokenPayload) {
      request.emit('exception', {
        statusCode: 401,
        message: 'Token không hợp lệ hoặc đã hết hạn.',
      });
      request.disconnect();
      return false;
    }
    request.token = token;
    request.tokenPayload = tokenPayload;
    return true;
  }
}
