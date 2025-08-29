import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { NotificationController } from './notification.controller';
import { NotificationService, FIREBASE_APP, FIREBASE_MESSAGING } from './notification.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [NotificationController],
  providers: [
    {
      provide: FIREBASE_APP,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const projectId = config.get<string>('FIREBASE_PROJECT_ID');
        const clientEmail = config.get<string>('FIREBASE_CLIENT_EMAIL');
        // thay \\n -> \n khi đọc từ ENV
        const privateKey = config.get<string>('FIREBASE_PRIVATE_KEY')?.replace(/\\n/g, '\n');

        // Tránh init trùng
        const existing = admin.apps.find((a) => a?.name === '[DEFAULT]');
        if (existing) return existing;

        return admin.initializeApp({
          credential: admin.credential.cert({
            projectId,
            clientEmail,
            privateKey,
          }),
        });
      },
    },
    {
      provide: FIREBASE_MESSAGING,
      inject: [FIREBASE_APP],
      useFactory: (app: admin.app.App) => admin.messaging(app),
    },
    NotificationService,
  ],
  exports: [NotificationService],
})
export class NotificationModule {}
