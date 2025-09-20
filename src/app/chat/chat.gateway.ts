import { CreateMessageDto } from '@/app/chat/chat.dto';
import { ChatService } from '@/app/chat/chat.service';
import { RedisService } from '@/app/redis';
import { TokenPayload, TokenService } from '@/app/token';
import { UserWsId } from '@/common/decorators';
import { WsJwtGuard } from '@/common/guards';
import { UserRole } from '@/common/models';
import { UseGuards } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(Number(process.env.WS_PORT) || 3001, {
  cors: {
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
  },
})
@UseGuards(WsJwtGuard)
export class ChatGateway implements OnGatewayConnection {
  constructor(
    private readonly chatService: ChatService,
    private readonly tokenService: TokenService,
    private readonly redisService: RedisService,
  ) {}

  @WebSocketServer()
  private server: Server;

  async handleConnection(client: Socket & { tokenPayload?: TokenPayload }) {
    try {
      const authorization = client.handshake.headers.authorization as string | undefined;
      if (!authorization) {
        client.emit('exception', {
          statusCode: 401,
          message: 'Không tìm thấy token hợp lệ.',
        });
        client.disconnect();
        return;
      }

      const token = authorization.startsWith('Bearer ')
        ? authorization.split(' ')[1]
        : authorization;

      const isBlacklist: boolean = JSON.parse(
        (await this.redisService.get(`token:blacklist:${token}`)) || 'false',
      );
      if (isBlacklist) {
        client.emit('exception', {
          statusCode: 401,
          message: 'Token đã bị vô hiệu hoá.',
        });
        client.disconnect();
        return;
      }

      const tokenPayload = await this.tokenService.validateTokenForWs(token);
      if (!tokenPayload) {
        client.emit('exception', {
          statusCode: 401,
          message: 'Token không hợp lệ hoặc đã hết hạn.',
        });
        client.disconnect();
        return;
      }

      client.tokenPayload = tokenPayload;
      const userId = tokenPayload.id;
      const conversations = await this.chatService.getUserConversations(userId);
      conversations.forEach((conversation) => {
        client.join(conversation.id);
        conversation.messages.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
        conversation.messages.forEach((message) => {
          if (message.sender.role === UserRole.CUSTOMER)
            client.emit('message', {
              chatRoomId: conversation.id,
              senderId: message.sender.id,
              senderName: message.sender.username,
              senderAvatar: message.sender.avatarUrl,
              content: message.content,
              imageUrl: message.images,
            } as CreateMessageDto);
          else
            client.emit('message', {
              chatRoomId: conversation.id,
              senderId: message.sender.id,
              senderName: message.sender.shop?.name || message.sender.username,
              senderAvatar: message.sender.shop?.logoUrl || null,
              content: message.content,
              imageUrl: message.images,
            });
        });
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Internal server error';
      client.emit('exception', { statusCode: 500, message });
      client.disconnect();
    }
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(@UserWsId() senderId: string, @MessageBody() body: CreateMessageDto) {
    const message = await this.chatService.createMessage(senderId, body);
    this.server.to(body.chatRoomId).emit('message', message);
  }
}
