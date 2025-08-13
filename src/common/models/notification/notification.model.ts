import { Base } from '@/common/models/base.model';
import { Entity } from 'typeorm';

@Entity('notifications')
export class Notification extends Base {}
