import { Conversation, Message, UserRole } from '@/common/models';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateConversationDto,
  CreateMessageDto,
  GetConversationDto,
  GetMessageDto,
  GetMessageRequest,
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
    let conversation = await this.conversationRepository.findOne({
      where: {
        user1: { id: userIds[0] },
        user2: { id: userIds[1] },
      },
    });
    if (!conversation) {
      conversation = await this.conversationRepository.save({
        user1: { id: userIds[0] },
        user2: { id: userIds[1] },
      } as Conversation);
    }
    return conversation;
  }

  async createMessage(senderId: string, messageDto: CreateMessageDto): Promise<GetMessageDto> {
    const conversation = await this.conversationRepository.findOne({
      where: [
        { id: messageDto.chatRoomId, user1: { id: senderId } },
        { id: messageDto.chatRoomId, user2: { id: senderId } },
      ],
      relations: {
        user1: { shop: true },
        user2: { shop: true },
        messages: { sender: { shop: true } },
      },
    });
    if (!conversation)
      throw new WsException({
        statusCode: 404,
        message: 'Không tìm thấy cuộc trò chuyện.',
      });

    const user = conversation.user1.id === senderId ? conversation.user1 : conversation.user2;
    const newMessage = {
      conversation: { id: messageDto.chatRoomId } as Conversation,
      sender: user,
      content: messageDto.content,
      images: messageDto.imageUrl,
      isReaded: false,
    } as Message;

    const messages = conversation.messages;
    messages.forEach((msg) => {
      if (msg.sender.id !== senderId) msg.isReaded = true;
    });
    messages.push(newMessage);
    await this.messageRepository.save(messages);

    return await this.mapToGetMessageDto(conversation.id, newMessage);
  }

  async getUserConversations(userId: string): Promise<GetConversationDto[]> {
    const conversations = await this.conversationRepository.find({
      where: [{ user1: { id: userId } }, { user2: { id: userId } }],
      order: {
        createdAt: 'DESC',
      },
      relations: {
        messages: { sender: { shop: true } },
        user1: { shop: true },
        user2: { shop: true },
      },
    });
    return this.mapToGetConversationsDto(conversations, userId);
  }

  async getUserConversation(
    conversationId: string,
    currentId: string,
  ): Promise<GetConversationDto> {
    const conversation = await this.conversationRepository.findOne({
      where: { id: conversationId },
      order: {
        createdAt: 'DESC',
      },
      relations: {
        messages: { sender: { shop: true } },
        user1: { shop: true },
        user2: { shop: true },
      },
    });
    if (!conversation)
      throw new WsException({ statusCode: 404, message: 'Không tìm thấy cuộc trò chuyện.' });
    return this.mapToGetConversationDto(conversation, currentId);
  }

  async getConversations(
    userId: string,
    take: number,
    skip: number,
    sort?: Sorting[],
    filter?: Filtering[],
  ): Promise<[GetConversationDto[], number]> {
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
    const dtos: GetConversationDto[] = await this.mapToGetConversationsDto(conversations, userId);
    return [dtos, total];
  }

  async getMessages({ userId, conversationId }: GetMessageRequest): Promise<GetMessageDto[]> {
    const conversation = await this.conversationRepository.findOne({
      where: { id: conversationId },
      relations: {
        user1: { shop: true },
        user2: { shop: true },
        messages: { sender: { shop: true } },
      },
    });
    if (!conversation)
      throw new WsException({ statusCode: 404, message: 'Không tìm thấy cuộc trò chuyện.' });
    const messages = conversation.messages.sort(
      (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
    );
    messages.forEach((msg) => {
      if (msg.sender.id !== userId) msg.isReaded = true;
    });
    await this.messageRepository.save(messages);
    return Promise.all(
      messages.map(async (msg) => await this.mapToGetMessageDto(conversation.id, msg)),
    );
  }

  async mapToGetConversationsDto(
    conversations: Conversation[],
    userId: string,
  ): Promise<GetConversationDto[]> {
    return Promise.all(
      conversations.map(async (conversation) => {
        return await this.mapToGetConversationDto(conversation, userId);
      }),
    );
  }

  async mapToGetConversationDto(
    conversation: Conversation,
    userId: string,
  ): Promise<GetConversationDto> {
    const otherUser = conversation.user1.id === userId ? conversation.user2 : conversation.user1;
    const lastMessageEntity =
      conversation.messages.length > 0
        ? conversation.messages.reduce((prev, current) =>
            prev.createdAt > current.createdAt ? prev : current,
          )
        : null;
    const lastMessage: GetMessageDto | null = lastMessageEntity
      ? await this.mapToGetMessageDto(conversation.id, lastMessageEntity)
      : null;
    const unReadCount = conversation.messages.filter((msg) => !msg.isReaded).length;
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
      unReadCount,
    } as GetConversationDto;
  }

  async mapToGetMessageDto(conversationId: string, message: Message): Promise<GetMessageDto> {
    return {
      chatRoomId: conversationId,
      senderId: message.sender.id,
      senderName:
        message.sender.role === UserRole.CUSTOMER
          ? message.sender.username
          : message.sender.shop?.name || message.sender.username,
      senderAvatar:
        message.sender.role === UserRole.CUSTOMER
          ? message.sender.avatarUrl
          : message.sender.shop?.logoUrl || null,
      content: message.content,
      imageUrl: message.images || undefined,
      createdAt: message.createdAt,
    };
  }
}
