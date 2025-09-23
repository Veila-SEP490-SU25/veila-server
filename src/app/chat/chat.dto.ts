import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class GetMessageDto {
  @ApiProperty({ example: 'chat-room-id' })
  @IsString()
  chatRoomId: string;

  @ApiProperty({ example: 10 })
  @IsString()
  senderId: string;

  @ApiProperty({ example: 'user-name' })
  @IsString()
  senderName: string;

  @ApiProperty({ example: 'http://example.com/avatar.png' })
  @IsOptional()
  @IsString()
  senderAvatar: string | null;

  @ApiProperty({ example: 'Hello, world!' })
  @IsString()
  content: string;

  @ApiProperty({ example: 'http://example.com/image.png' })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({ example: '2024-01-01T00:00:00Z' })
  @IsDate()
  createdAt: Date;
}

export class GetConversationDto {
  @ApiProperty({ example: 'conversation-id' })
  @IsString()
  conversationId: string;

  @ApiProperty({ example: 'user-id' })
  @IsString()
  receiverId: string;

  @ApiProperty({ example: 'User Name' })
  @IsString()
  receiverName: string;

  @ApiProperty({ example: 'http://example.com/avatar.png' })
  @IsString()
  @IsOptional()
  receiverAvatar: string | null;

  @ApiProperty({ type: () => GetMessageDto })
  lastMessage: GetMessageDto;

  @ApiProperty({ example: 5 })
  @IsNumber()
  unReadCount: number;
}

export class CreateMessageDto {
  @ApiProperty({ example: 'chat-room-id' })
  @IsString()
  @IsUUID('4', { message: 'chatRoomId must be a valid UUID v4' })
  chatRoomId: string;

  @ApiProperty({ example: 'Hello, world!' })
  @IsString()
  content: string;

  @ApiProperty({ example: 'http://example.com/image.png' })
  @IsString()
  @IsOptional()
  imageUrl?: string;
}

export class CreateConversationDto {
  @ApiProperty({ example: 'user1-id' })
  @IsString()
  @IsUUID('4', { message: 'user1Id must be a valid UUID v4' })
  user1Id: string;

  @ApiProperty({ example: 'user2-id' })
  @IsString()
  @IsUUID('4', { message: 'user2Id must be a valid UUID v4' })
  user2Id: string;
}

export class GetMessageRequest {
  @ApiProperty({ example: 'user-id' })
  @IsString()
  @IsUUID('4', { message: 'userId must be a valid UUID v4' })
  userId: string;

  @ApiProperty({ example: 'conversation-id' })
  @IsString()
  @IsUUID('4', { message: 'conversationId must be a valid UUID v4' })
  conversationId: string;
}
