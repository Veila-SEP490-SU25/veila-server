import { Base } from '@/common/models/base.model';
import { Conversation } from '@/common/models/chat/conversation.model';
import { User } from '@/common/models/user';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('messages')
export class Message extends Base {
  @ManyToOne(() => Conversation, (conversation) => conversation.messages, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'conversation_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'fk_message_conversation',
  })
  conversation: Conversation;

  @ManyToOne(() => User, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'sender_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'fk_message_sender',
  })
  sender: User;

  @Column({
    type: 'text',
    nullable: false,
    name: 'content',
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
  })
  @ApiProperty({ example: 'Hello, how are you?' })
  content: string;

  @Column({ type: 'text', nullable: true, name: 'images' })
  @ApiProperty({ example: 'https://example.com/image.png' })
  images: string | null;

  @Column({ type: 'boolean', name: 'is_readed', default: false })
  @ApiProperty({ example: false })
  isReaded: boolean;
}
