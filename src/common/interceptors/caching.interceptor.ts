import { RedisService } from '@/app/redis';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { classToPlain } from 'class-transformer';
import { map, Observable } from 'rxjs';

@Injectable()
export class CachingInterceptor implements NestInterceptor {
  constructor(private readonly redisService: RedisService) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    //Only cache GET requests
    if (request.method !== 'GET') {
      return next.handle();
    } else {
      const authorization = request.headers['authorization'] || 'unauthorized';
      const url = request.originalUrl || request.url;
      const queryParams = request.query ? JSON.stringify(request.query) : '';
      const cacheKey = `${authorization}:${url}:${queryParams}`;
      const cachedResponse = await this.redisService.get(cacheKey);
      if (cachedResponse) {
        response.setHeader('X-Cache', 'HIT');
        return new Observable((subscriber) => {
          subscriber.next(JSON.parse(cachedResponse));
          subscriber.complete();
        });
      } else {
        response.setHeader('X-Cache', 'MISS');
        return next.handle().pipe(
          map((data) => {
            this.redisService.set(cacheKey, JSON.stringify(classToPlain(data)), 60000);
            return data;
          }),
        );
      }
    }
  }
}
