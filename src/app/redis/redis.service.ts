import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService implements OnModuleInit{
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async onModuleInit() {
    const logger = new Logger(RedisService.name);
    try {
      const value = await this.cacheManager.get('test_key');
      logger.log(`Redis connected: test_key = ${value}`);
    } catch (err) {
      logger.error('Redis connection failed', err);
    }
  }

  async storeItem<T>(key: string, value: T, ttl?: number): Promise<void> {
    await this.cacheManager.set(key, value, ttl);
  }

  async getItem<T>(key: string): Promise<T | null> {
    return await this.cacheManager.get<T>(key);
  }

  async verifyToken(key: string, token: string): Promise<boolean> {
    const storedToken = await this.cacheManager.get<string>(key);
    return storedToken === token;
  }

  async revokeItem(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }
}
