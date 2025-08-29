import { Inject, Injectable, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { NotificationDto, Platform } from '@/app/notification/notification.dto';

export const FIREBASE_APP = 'FIREBASE_APP';
export const FIREBASE_MESSAGING = 'FIREBASE_MESSAGING';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  constructor(@Inject(FIREBASE_MESSAGING) private readonly messaging: admin.messaging.Messaging) {}

  async send(dto: NotificationDto) {
    if (!dto.tokens && !dto.topic) {
      throw new Error('Missing target: provide either tokens[] or topic.');
    }

    const baseMsg = this.buildBaseMessage(dto);

    if (dto.tokens?.length) {
      // Gửi nhiều device tokens + nhận chi tiết từng kết quả
      const res = await this.messaging.sendEachForMulticast({
        tokens: dto.tokens,
        ...baseMsg,
      });
      // Log lỗi chi tiết (nếu có)
      res.responses.forEach((r, idx) => {
        if (!r.success) {
          this.logger.warn(`Token[${idx}] error: ${r.error?.code} - ${r.error?.message}`);
        }
      });
      return {
        successCount: res.successCount,
        failureCount: res.failureCount,
      };
    }

    // Gửi theo topic
    const message: admin.messaging.Message = {
      topic: dto.topic!,
      ...baseMsg,
    };
    const id = await this.messaging.send(message);
    return { messageId: id };
  }

  private buildBaseMessage(dto: NotificationDto) {
    // notification chung (title/body)
    const notification: admin.messaging.Notification = {
      title: dto.title,
      body: dto.body,
      // Node Admin SDK dùng imageUrl (khác với 'image' ở HTTP v1)
      imageUrl: dto.imageUrl,
    };

    // webpush payload
    const webpush: admin.messaging.WebpushConfig | undefined =
      dto.platform === Platform.IOS
        ? undefined
        : {
            notification: {
              title: dto.title,
              body: dto.body,
              icon: undefined, // có thể đặt icon nếu muốn
              image: dto.imageUrl, // nhiều browser hỗ trợ 'image'
            },
            fcmOptions: dto.link ? { link: dto.link } : undefined, // HTTPS only
          };

    // apns payload (iOS)
    const apns: admin.messaging.ApnsConfig | undefined =
      dto.platform === Platform.WEB
        ? undefined
        : {
            headers: {
              'apns-priority': '10', // gửi ngay (foreground)
            },
            payload: {
              aps: {
                alert: { title: dto.title, body: dto.body },
                sound: dto.sound ?? 'default',
                badge: dto.badge,
              },
            },
          };

    // Có thể thêm android config nếu cần sau này
    return {
      notification,
      data: dto.data,
      webpush,
      apns,
    } as Pick<admin.messaging.Message, 'notification' | 'data' | 'webpush' | 'apns'>;
  }
}
