import { TokenService } from '@/app/token';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (!request.headers.authorization) {
      throw new UnauthorizedException('Không tìm thấy token hợp lệ.');
    }
    const token = request.headers.authorization.split(' ')[1];
    if (!token) throw new UnauthorizedException('Không tìm thấy token hợp lệ.');
    const tokenPayload = await this.tokenService.validateToken(token);
    if (!tokenPayload) {
      throw new UnauthorizedException('Token không hợp lệ hoặc đã hết hạn.');
    }
    request.tokenPayload = tokenPayload;
    return true;
  }
}
