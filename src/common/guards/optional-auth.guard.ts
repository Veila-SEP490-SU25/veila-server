import { AuthGuard } from '@/common/guards/auth.guard';
import { ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class OptionalAuthGuard extends AuthGuard {
  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers.authorization;
    // Không có header Authorization => cho qua như user chưa đăng nhập
    if (!authHeader) return true;
    // Có header => chạy cơ chế xác thực bình thường
    return (await super.canActivate(context)) as boolean;
  }
}
