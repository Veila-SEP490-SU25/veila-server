import { RedisService } from '@/app/redis';
import { TokenPayload, TokenService } from '@/app/token';
import { UserRole } from '@/common/models';
import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class RoleMiddleware implements NestMiddleware {
  constructor(
    private readonly tokenService: TokenService,
    private readonly redisService: RedisService,
  ) {}

  async use(
    req: Request & { tokenPayload?: TokenPayload; currentRole?: UserRole },
    res: Response,
    next: NextFunction,
  ) {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(' ')[1];
      if (!token) throw new UnauthorizedException('Không tìm thấy token hợp lệ.');
      const isBlacklist: boolean = JSON.parse(
        (await this.redisService.get(`token:blacklist:${token}`)) || 'false',
      );
      if (isBlacklist) {
        throw new UnauthorizedException('Token đã bị vô hiệu hoá.');
      }
      const tokenPayload = await this.tokenService.validateToken(token);
      if (!tokenPayload) {
        throw new UnauthorizedException('Token không hợp lệ hoặc đã hết hạn.');
      }
      if (tokenPayload) req.currentRole = await this.tokenService.getCurrentRole(tokenPayload.id);
    }
    next();
  }
}
