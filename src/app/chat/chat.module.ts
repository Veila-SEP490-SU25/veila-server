import { ChatController } from '@/app/chat/chat.controller';
import { ChatGateway } from '@/app/chat/chat.gateway';
import { ChatService } from '@/app/chat/chat.service';
import { RedisModule } from '@/app/redis';
import { TokenModule } from '@/app/token';
import { Conversation, Message } from '@/common/models';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Conversation, Message]), TokenModule, RedisModule],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway],
})
export class ChatModule {}
