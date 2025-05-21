import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { HttpStatusCodeInterceptor } from '@/common/interceptors';
import { HttpExceptionFilter } from '@/common/filters';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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
    ],
    exposedHeaders: ['Content-Length', 'Content-Range', 'Content-Type'],
    maxAge: 86400,
  });

  // Global Interceptors, Filters, Pipes, and Prefix
  app.useGlobalInterceptors(new HttpStatusCodeInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true
  }));
  app.setGlobalPrefix('api');

  // Swagger API Documentation
  const documentConfig = new DocumentBuilder()
    .setTitle('Veila API Documentation')
    .setDescription('API for Veila - Wedding Dress Services Platform')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, documentConfig);
  SwaggerModule.setup('/swagger', app, document, {
    swaggerOptions: { defaultModelsExpandDepth: -1 },
  });

  // Server
  const host = process.env.LISTEN_HOST || '0.0.0.0';
  const port = process.env.LISTEN_PORT || 3000;

  await app.listen(port, host);
  Logger.log(`Server running on http://${host}:${port}`, 'Bootstrap');
  Logger.log(`Swagger running on http://${host}:${port}/swagger`, 'Bootstrap');
}
bootstrap();
