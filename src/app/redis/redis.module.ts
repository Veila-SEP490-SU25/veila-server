import { Global, Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '@/app/redis/redis.service';
import KeyvRedis from '@keyv/redis';
import { RedisController } from '@/app/redis/redis.controller';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        stores: [new KeyvRedis(config.get<string>('REDIS_URL'), {})],
      }),
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
  controllers: [RedisController],
})
export class RedisModule {}
