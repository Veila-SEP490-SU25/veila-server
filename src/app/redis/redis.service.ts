import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private readonly redis: Redis;
  constructor(config: ConfigService) {
    this.redis = new Redis(config.get<string>('REDIS_URL') as string);
  }

  async set(key: string, value: string, ttl?: number) {
    return await this.redis.set(key, value, 'PX', ttl || 60000);
  }

  async get(key: string) {
    return await this.redis.get(key);
  }

  async del(key: string) {
    return await this.redis.del(key);
  }
}
