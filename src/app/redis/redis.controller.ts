import { RedisService } from "@/app/redis/redis.service";
import { Controller, Get, Post } from "@nestjs/common";

@Controller('redis-test')
export class RedisController {
  constructor(private readonly redisService: RedisService){}

  @Post()
  async setKey() {
    const key = 'redis_test';
    const value = "hello_redis";
    await this.redisService.set(key, value, 600);
    return {
      message: 'Key set successfully',
      key,
      value,
    }
  }

  @Get()
  async getKey() {
    const key = 'redis_test';
    const value = await this.redisService.get(key);
    return {
      message: 'Key retrieved successfully',
      key,
      value,
    };
  }
}