import { CreateConversationDto, CreateMessageDto, GetMessageRequest } from '@/app/chat/chat.dto';
import { ChatService } from '@/app/chat/chat.service';
import { RedisService } from '@/app/redis';
import { TokenService } from '@/app/token';
import { UserWsId } from '@/common/decorators';
import { WsJwtGuard } from '@/common/guards';
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
  ) { }

  @WebSocketServer()
  private server: Server;

  async handleConnection(client: Socket) {
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

      const userId = tokenPayload.id;
      client.join(`user:${userId}`);

      const conversations = await this.chatService.getUserConversations(userId);
      conversations.forEach((conversation) => {
        client.join(conversation.conversationId);
        client.emit('conversation', conversation);
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Internal server error';
      client.emit('exception', { statusCode: 401, message });
      client.disconnect();
    }
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(@UserWsId() senderId: string, @MessageBody() body: CreateMessageDto) {
    const message = await this.chatService.createMessage(senderId, body);
    this.server.to(body.chatRoomId).emit('message', message);

    const conversation = await this.chatService.getUserConversation(body.chatRoomId, senderId);
    this.server.to(body.chatRoomId).emit('conversation', conversation);
  }

  @SubscribeMessage('createConversation')
  async handleCreateConversation(
    @MessageBody() body: CreateConversationDto,
    @UserWsId() userId: string,
  ) {
    const newConversation = await this.chatService.createConversationIfNotExists(body);

    const user1Id = body.user1Id;
    const user2Id = body.user2Id;

    this.server.to(`user:${user1Id}`).socketsJoin(newConversation.id);
    this.server.to(`user:${user2Id}`).socketsJoin(newConversation.id);

    const conversation = await this.chatService.getUserConversation(newConversation.id, userId);

    this.server.to(newConversation.id).emit('conversation', conversation);
    this.server.to(newConversation.id).emit('conversation', conversation);
  }

  @SubscribeMessage('getMessage')
  async handleGetMessage(@UserWsId() userId: string, @MessageBody() body: GetMessageRequest) {
    const messages = await this.chatService.getMessages(userId, body);
    this.server.to(body.conversationId).emit('message', messages);
  }
}
