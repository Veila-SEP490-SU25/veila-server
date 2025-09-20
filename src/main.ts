process.env.TZ = 'Asia/Ho_Chi_Minh';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from '@/app/app.module';
import { CachingInterceptor, HttpStatusCodeInterceptor } from '@/common/interceptors';
import { HttpExceptionFilter, WsExceptionFilter } from '@/common/filters';
import { ClassSerializerInterceptor, Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// Swagger include helpers (for debugging problematic controllers)
// import { AuthModule } from '@/app/auth/auth.module';
// import { UserModule } from '@/app/user/user.module';
// import { WalletModule } from '@/app/wallet/wallet.module';
// import { OrderModule } from '@/app/order/order.module';
// import { CategoryModule } from '@/app/category/category.module';
// import { ServiceModule } from '@/app/service/service.module';
// import { ShopModule } from '@/app/shop/shop.module';
// import { BlogModule } from '@/app/blog/blog.module';
// import { AccessoryModule } from '@/app/accessory/accessory.module';
// import { FeedbackModule } from '@/app/feedback/feedback.module';
// import { SubscriptionModule } from '@/app/subscription/subscription.module';
// import { ComplaintModule } from '@/app/complaint/complaint.module';
// import { RequestModule } from '@/app/request/request.module';
// import { MilestoneModule } from '@/app/milestone/milestone.module';
// import { TaskModule } from '@/app/task/task.module';
// import { SingleModule } from '@/app/single/single.module';
// import { TransactionModule } from '@/app/transaction/transaction.module';
// import { AppSettingModule } from '@/app/appsetting/appsetting.module';
// import { ContractModule } from '@/app/contract/contract.module';
// import { UploadModule } from '@/app/upload/upload.module';
// import { PayosModule } from '@/app/payos/payos.module';
// import { ChatModule } from '@/app/chat/chat.module';
// import { DressModule } from '@/app/dress/dress.module';
// import { OrderAccessoriesDetailsModule } from '@/app/order-accessories-details/order-accessories-details.module';
// import { OrderDressDetailsModule } from '@/app/order-dress-details/order-dress-details.module';
// import { TokenModule } from '@/app/token/token.module';
// import { PasswordModule } from '@/app/password/password.module';
// import { RedisModule } from '@/app/redis/redis.module';
// import { SeedingModule } from '@/app/seeding/seeding.module';
// import { VonageModule } from '@/app/voyage/vonage.module';
import { RedisService } from '@/app/redis/redis.service';
// import { MailModule } from '@/app/mail/mail.module';
// import { MembershipModule } from '@/app/membership';
// import { NotificationModule } from '@/app/notification/notification.module';

async function bootstrap() {
  // Nest Factory
  const app = await NestFactory.create(AppModule, {
    cors: true,
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  // CORS
  app.enableCors({
    origin: (process.env.FE_URL as string) || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'DNT',
      'User-Agent',
      'X-Requested-With',
      'If-Modified-Since',
      'Cache-Control',
      'Content-Type',
      'Range',
      'Authorization',
      'ngrok-skip-browser-warning',
      '*',
    ],
    exposedHeaders: ['Content-Length', 'Content-Range', 'Content-Type'],
    maxAge: 86400,
  });

  // Global Interceptors, Filters, Pipes, and Prefix
  app.useGlobalInterceptors(new HttpStatusCodeInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter(), new WsExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalInterceptors(new CachingInterceptor(app.get(RedisService)));
  app.setGlobalPrefix('api');

  const node_env = process.env.NODE_ENV;

  // Swagger API Documentation
  if (node_env !== 'production') {
    const documentConfig = new DocumentBuilder()
      .setTitle('Veila API Documentation')
      .setDescription('API for Veila - Wedding Dress Services Platform')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    // Optional: limit scanned modules via SWAGGER_INCLUDE (comma-separated keys)
    // const includeEnv = process.env.SWAGGER_INCLUDE;
    // const modulesMap = {
    //   accessory: AccessoryModule,
    //   appsetting: AppSettingModule,
    //   auth: AuthModule,
    //   blog: BlogModule,
    //   category: CategoryModule,
    //   chat: ChatModule,
    //   complaint: ComplaintModule,
    //   contract: ContractModule,
    //   dress: DressModule,
    //   feedback: FeedbackModule,
    //   mail: MailModule,
    //   membership: MembershipModule,
    //   milestone: MilestoneModule,
    //   notification: NotificationModule,
    //   order: OrderModule,
    //   orderAccessoriesDetails: OrderAccessoriesDetailsModule,
    //   orderDressDetails: OrderDressDetailsModule,
    //   password: PasswordModule,
    //   payos: PayosModule,
    //   redis: RedisModule,
    //   request: RequestModule,
    //   seeding: SeedingModule,
    //   service: ServiceModule,
    //   shop: ShopModule,
    //   single: SingleModule,
    //   subscription: SubscriptionModule,
    //   task: TaskModule,
    //   token: TokenModule,
    //   transaction: TransactionModule,
    //   upload: UploadModule,
    //   user: UserModule,
    //   vonage: VonageModule,
    //   wallet: WalletModule,
    // } as const;

    // const include = includeEnv
    //   ? includeEnv
    //       .split(',')
    //       .map((k) => k.trim())
    //       .filter(Boolean)
    //       .map((k) => modulesMap[k as keyof typeof modulesMap])
    //       .filter(Boolean)
    //   : undefined;

    const document = SwaggerModule.createDocument(app, documentConfig, {
      // include,
    });
    SwaggerModule.setup('/swagger', app, document, {
      swaggerOptions: {
        defaultModelsExpandDepth: -1,
        docExpansion: 'none',
        filter: true,
        showExtensions: true,
        showCommonExtensions: true,
        tagsSorter: 'alpha',
        operationsSorter: 'alpha',
      },
    });
  }

  // Server
  const host = process.env.LISTEN_HOST || '0.0.0.0';
  const port = process.env.LISTEN_PORT || 3000;

  await app.listen(port, host).then(() => {
    Logger.log(`Server running on http://${host}:${port}`, 'Bootstrap');
    if (node_env !== 'production')
      Logger.log(`Swagger running on http://${host}:${port}/swagger`, 'Bootstrap');
  });
}

bootstrap();
