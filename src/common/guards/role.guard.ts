import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserRole } from "@/common/models";
import { ROLES_KEY } from "@/common/decorators";
import { TokenService } from "@/app/token";
import { RedisService } from "@/app/redis";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector,
        private readonly tokenService: TokenService,
        private readonly redisService: RedisService,) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles) {
            return true;
        }
        
        const request = context.switchToHttp().getRequest();
        if (!request.headers.authorization) {
            throw new UnauthorizedException('Không tìm thấy token hợp lệ.');
        }
        const token = request.headers.authorization.split(' ')[1];
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
        return requiredRoles.some((role) => tokenPayload.role.includes(role));
    }
}