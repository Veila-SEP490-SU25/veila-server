import { RedisService, TokenService } from '@/app';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

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
      throw new WsException('Không tìm thấy token hợp lệ.');
    }
    const isBlacklist: boolean = JSON.parse(
      (await this.redisService.get(`token:blacklist:${token}`)) || 'false',
    );
    if (isBlacklist) {
      throw new WsException('Token đã bị vô hiệu hoá.');
    }
    const tokenPayload = await this.tokenService.validateTokenForWs(token);
    if (!tokenPayload) {
      throw new WsException('Token không hợp lệ hoặc đã hết hạn.');
    }
    request.token = token;
    request.tokenPayload = tokenPayload;
    return true;
  }
}
