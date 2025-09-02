import { Base } from '@/common/models/base.model';
import { Column } from 'typeorm';

export class ConfirmNoComplaint extends Base {
  @Column({
    type: 'varchar',
    length: 255,
  })
  orderId: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  isCusConfirm: boolean;

  @Column({
    type: 'boolean',
    default: false,
  })
  isShopConfirm: boolean;
}
