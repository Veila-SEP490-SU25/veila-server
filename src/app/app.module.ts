import { AccessoryModule } from '@/app/accessory';
import { AppController } from '@/app/app.controller';
import { AppService } from '@/app/app.service';
import { AuthModule } from '@/app/auth';
import { BlogModule } from '@/app/blog';
import { CategoryModule } from '@/app/category';
import { DressModule } from '@/app/dress';
import { FeedbackModule } from '@/app/feedback';
import { MailModule } from '@/app/mail';
import { PasswordModule } from '@/app/password';
import { RedisModule } from '@/app/redis';
import { SeedingModule } from '@/app/seeding';
import { ServiceModule } from '@/app/service';
import { ShopModule } from '@/app/shop';
import { TokenModule } from '@/app/token';
import { UserModule } from '@/app/user';
import { PayosModule } from '@/app/payos/payos.module';
import { RolesGuard } from '@/common/guards';
import { LoggingMiddleware, RoleMiddleware } from '@/common/middlewares';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContractModule } from '@/app/contract';
import { SubscriptionModule } from '@/app/subscription';
import { WalletModule } from '@/app/wallet';
import { MembershipModule } from '@/app/membership';
import { OrderModule } from '@/app/order/order.module';
import { OrderAccessoriesDetailsModule } from './order-accessories-details/order-accessories-details.module';
import { OrderDressDetailsModule } from './order-dress-details';
import { ScheduleModule } from '@nestjs/schedule';
import { ComplaintModule } from '@/app/complaint';
import { TaskModule } from './task';
import { MilestoneModule } from './milestone';
import { SingleModule } from '@/app/single';
import { TransactionModule } from './transaction';
import { RequestModule } from '@/app/request';
import { AppSettingModule } from '@/app/appsetting';
import { VonageModule } from '@/app/voyage';

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
    FeedbackModule,
    PayosModule,
    ContractModule,
    SubscriptionModule,
    WalletModule,
    MembershipModule,
    OrderModule,
    OrderAccessoriesDetailsModule,
    OrderDressDetailsModule,
    ScheduleModule.forRoot({ cronJobs: true }),
    ComplaintModule,
    TaskModule,
    MilestoneModule,
    SingleModule,
    TransactionModule,
    RequestModule,
    MembershipModule,
    AppSettingModule,
    VonageModule,
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
    consumer.apply(LoggingMiddleware, RoleMiddleware).forRoutes('*');
  }
}
