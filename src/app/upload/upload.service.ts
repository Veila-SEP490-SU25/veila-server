import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadService {
  private readonly uploadPath: string;
  private readonly baseUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.uploadPath =
      this.configService.get<string>('UPLOAD_PATH') ??
      (() => {
        throw new Error('Missing required environment variable: UPLOAD_PATH');
      })();
    this.baseUrl =
      this.configService.get<string>('BASE_URL') ??
      (() => {
        throw new Error('Missing required environment variable: BASE_URL');
      })();
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  getFileUrl(filename: string): string {
    return `${this.baseUrl}files/${filename}`;
  }
}
