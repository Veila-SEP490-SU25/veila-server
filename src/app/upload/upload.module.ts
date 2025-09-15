import { UploadController } from '@/app/upload/upload.controller';
import { UploadService } from '@/app/upload/upload.service';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import * as fs from 'fs';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const uploadPath =
          configService.get<string>('UPLOAD_PATH') ??
          (() => {
            throw new Error('Missing required environment variable: UPLOAD_PATH');
          })();
        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath, { recursive: true });
        }
        return {
          storage: diskStorage({
            destination: uploadPath,
            filename: (_req, file, cb) => {
              const env = configService.get<string>('NODE_ENV') === 'production' ? 'prod' : 'dev';
              const timestamp = Date.now();
              const randomNum = Math.floor(100000 + Math.random() * 900000); // 6 digits
              const filename = `${env}-${timestamp}-${randomNum}${extname(file.originalname)}`;
              cb(null, filename);
            },
          }),
          limits: {
            fileSize: 5 * 1024 * 1024, // 5 MB max
          },
        };
      },
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}
