import { Global, Module } from '@nestjs/common';
import { RedisService } from '@/app/redis/redis.service';
import { RedisController } from '@/app/redis/redis.controller';

@Global()
@Module({
  providers: [RedisService],
  exports: [RedisService],
  controllers: [RedisController],
})
export class RedisModule {}
