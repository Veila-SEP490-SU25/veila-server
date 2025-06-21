import { TokenOptions, TokenPayload } from '@/app/token/token.dto';
import { User } from '@/common/models';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async createToken(user: User, options?: TokenOptions): Promise<string> {
    const secret = options?.isRefresh
      ? this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET')
      : this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET');
    const expiresIn = options?.isRefresh
      ? this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRE')
      : this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRE');

    const payload: TokenPayload = {
      id: user.id,
      username: user.username,
      role: user.role,
    };

    return await this.jwtService.signAsync(payload, { secret, expiresIn });
  }

  async validateToken(token: string, options?: TokenOptions): Promise<TokenPayload> {
    try {
      const secret = options?.isRefresh
        ? this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET')
        : this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET');

      const payload = await this.jwtService.verifyAsync<TokenPayload>(token, {
        secret,
        ignoreExpiration: options?.ignoreExpiration,
      });
      if (!payload) {
        throw new UnauthorizedException('Token không hợp lệ hoặc đã hết hạn.');
      }
      return {
        id: payload.id,
        username: payload.username,
        role: payload.role,
      };
    } catch {
      throw new UnauthorizedException('Token không hợp lệ hoặc đã hết hạn.');
    }
  }
}
