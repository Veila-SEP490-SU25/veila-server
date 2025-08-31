import { Base } from '@/common/models/base.model';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';

@Entity('app_settings')
export class AppSetting extends Base {
  @Column({
    name: 'cancel_penalty',
    type: 'int',
    nullable: false,
    default: 5,
  })
  @ApiProperty({ example: 5 })
  cancelPenalty: number;
}
