import { Base } from '@/common/models/base.model';
import { Message } from '@/common/models/chat/message.model';
import { User } from '@/common/models/user';
import { Entity, JoinColumn, ManyToOne, OneToMany, Unique } from 'typeorm';

@Entity('conversations')
@Unique(['user1', 'user2'])
export class Conversation extends Base {
  @ManyToOne(() => User, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'user1_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'fk_conversation_user1',
  })
  user1: User;

  @ManyToOne(() => User, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'user2_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'fk_conversation_user2',
  })
  user2: User;

  @OneToMany(() => Message, (message) => message.conversation, { cascade: true })
  messages: Message[];
}
