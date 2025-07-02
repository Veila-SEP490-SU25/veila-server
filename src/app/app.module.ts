import { AppController } from '@/app/app.controller';
import { AppService } from '@/app/app.service';
import {
  AccessoryModule,
  AuthModule,
  BlogModule,
  CategoryModule,
  DressModule,
  MailModule,
  PasswordModule,
  RedisModule,
  SeedingModule,
  ServiceModule,
  ShopModule,
  TokenModule,
  UserModule,
} from '@/app';
import { RolesGuard } from '@/common/guards';
import { LoggingMiddleware } from '@/common/middlewares';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [__dirname + '/../**/*.model.{js,ts}'],
        charset: 'utf8mb4_unicode_ci',
        synchronize: false,
        migrations: [__dirname + '/../migrations/*.{js,ts}'],
        migrationsTableName: 'veila_migration_db',
      }),
      inject: [ConfigService],
    }),
    MailModule,
    UserModule,
    TokenModule,
    PasswordModule,
    RedisModule,
    SeedingModule,
    AuthModule,
    CategoryModule,
    DressModule,
    ShopModule,
    ServiceModule,
    BlogModule,
    AccessoryModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
