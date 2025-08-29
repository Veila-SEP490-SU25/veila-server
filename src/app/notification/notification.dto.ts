import {
  IsArray,
  IsDefined,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export enum Platform {
  WEB = 'web',
  IOS = 'ios',
  ALL = 'all',
}

export class NotificationDto {
  // Gửi theo tokens hoặc topic (ít nhất 1 trong 2)
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tokens?: string[];

  @IsOptional()
  @IsString()
  topic?: string;

  @IsString()
  title!: string;

  @IsString()
  body!: string;

  @IsOptional()
  @IsObject()
  data?: Record<string, string>; // key-value string

  @IsOptional()
  @IsEnum(Platform)
  platform?: Platform; // web | ios | all (mặc định all)

  // Tuỳ chọn chung
  @IsOptional()
  @IsString()
  imageUrl?: string; // ảnh hiển thị (tuỳ nền tảng hỗ trợ)

  // Tuỳ chọn cho Web
  @IsOptional()
  @IsString()
  link?: string; // click action (HTTPS) - webpush

  // Tuỳ chọn cho iOS
  @IsOptional()
  @IsString()
  sound?: string; // ví dụ 'default'

  @IsOptional()
  @IsNumber()
  badge?: number;

  // Ràng buộc: tokens hoặc topic phải có
  @ValidateIf((o) => !o.tokens && !o.topic)
  @IsDefined({ message: 'Either tokens or topic must be provided.' })
  invalid?: unknown;
}
