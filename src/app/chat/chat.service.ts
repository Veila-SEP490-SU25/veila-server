import { Conversation, Message, User, UserRole } from '@/common/models';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateConversationDto,
  CreateMessageDto,
  GetConversationsDto,
  GetMessagesDto,
} from '@/app/chat/chat.dto';
import { Filtering, getOrder, getWhere, Sorting } from '@/common/decorators';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async createConversationIfNotExists(body: CreateConversationDto): Promise<Conversation> {
    const userIds = [body.user1Id, body.user2Id].sort((a, b) => a.localeCompare(b));
    const conversation = await this.conversationRepository.findOne({
      where: {
        user1: { id: userIds[0] },
        user2: { id: userIds[1] },
      },
    });
    if (!conversation) {
      return await this.conversationRepository.save({
        user1: { id: userIds[0] } as User,
        user2: { id: userIds[1] } as User,
      } as Conversation);
    }
    return conversation;
  }

  async createMessage(senderId: string, messageDto: CreateMessageDto): Promise<GetMessagesDto> {
    const conversation = await this.conversationRepository.findOne({
      where: [
        { id: messageDto.chatRoomId, user1: { id: senderId } },
        { id: messageDto.chatRoomId, user2: { id: senderId } },
      ],
      relations: {
        user1: { shop: true },
        user2: { shop: true },
      },
    });
    if (!conversation)
      throw new WsException({
        statusCode: 404,
        message: 'Không tìm thấy cuộc trò chuyện.',
      });

    await this.messageRepository.save({
      conversation: { id: messageDto.chatRoomId } as Conversation,
      sender: { id: senderId } as User,
      content: messageDto.content,
      images: messageDto.imageUrl,
    } as Message);

    const user = conversation.user1.id === senderId ? conversation.user1 : conversation.user2;
    if (user.role === UserRole.CUSTOMER)
      return {
        chatRoomId: conversation.id,
        senderId,
        senderName: user.username,
        senderAvatar: user.avatarUrl,
        content: messageDto.content,
        imageUrl: messageDto.imageUrl,
      };
    else
      return {
        chatRoomId: conversation.id,
        senderId,
        senderName: user.shop?.name || user.username,
        senderAvatar: user.shop?.logoUrl || null,
        content: messageDto.content,
        imageUrl: messageDto.imageUrl,
      };
  }

  async getUserConversations(userId: string): Promise<Conversation[]> {
    return await this.conversationRepository.find({
      where: [{ user1: { id: userId } }, { user2: { id: userId } }],
      order: {
        createdAt: 'DESC',
      },
      relations: {
        messages: { sender: { shop: true } },
      },
    });
  }

  async getConversations(
    userId: string,
    take: number,
    skip: number,
    sort?: Sorting[],
    filter?: Filtering[],
  ): Promise<[GetConversationsDto[], number]> {
    const whereRaw = getWhere(filter);
    const order = getOrder(sort);
    const where = whereRaw ?? {};
    const [conversations, total] = await this.conversationRepository.findAndCount({
      where: [
        { ...where, user1: { id: userId } },
        { ...where, user2: { id: userId } },
      ],
      order,
      take,
      skip,
      relations: {
        user1: { shop: true },
        user2: { shop: true },
        messages: { sender: { shop: true } },
      },
    });
    const dtos: GetConversationsDto[] = await this.mapToGetConversationsDtoForCustomer(
      conversations,
      userId,
    );
    return [dtos, total];
  }

  async mapToGetConversationsDtoForCustomer(
    conversations: Conversation[],
    userId: string,
  ): Promise<GetConversationsDto[]> {
    return conversations.map((conversation) => {
      const otherUser = conversation.user1.id === userId ? conversation.user2 : conversation.user1;
      const lastMessageEntity =
        conversation.messages.length > 0
          ? conversation.messages.reduce((prev, current) =>
              prev.createdAt > current.createdAt ? prev : current,
            )
          : null;
      const lastMessage: GetMessagesDto | null = lastMessageEntity
        ? {
            chatRoomId: conversation.id,
            senderId: lastMessageEntity.sender.id,
            senderName:
              lastMessageEntity.sender.role === UserRole.CUSTOMER
                ? lastMessageEntity.sender.username
                : lastMessageEntity.sender.shop?.name || lastMessageEntity.sender.username,
            senderAvatar:
              lastMessageEntity.sender.role === UserRole.CUSTOMER
                ? lastMessageEntity.sender.avatarUrl
                : lastMessageEntity.sender.shop?.logoUrl || null,
            content: lastMessageEntity.content,
            imageUrl: lastMessageEntity.images || undefined,
          }
        : null;
      return {
        conversationId: conversation.id,
        receiverId: otherUser.id,
        receiverName:
          otherUser.role === UserRole.CUSTOMER
            ? otherUser.username
            : otherUser.shop?.name || otherUser.username,
        receiverAvatar:
          otherUser.role === UserRole.CUSTOMER
            ? otherUser.avatarUrl
            : otherUser.shop?.logoUrl || null,
        lastMessage,
      } as GetConversationsDto;
    });
  }
}
