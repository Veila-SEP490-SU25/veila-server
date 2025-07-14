import { Base } from '@/common/models/base.model';
import { Contract } from '@/common/models/user/contract.model';
import { User } from '@/common/models/user/user.model';
import { ApiProperty } from '@nestjs/swagger';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('contract_acceptances')
export class ContractAcceptance extends Base {
  @ManyToOne(() => User, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'user_id',
    foreignKeyConstraintName: 'fk_contract_acceptance_user',
  })
  @ApiProperty({
    description: 'Thông tin user đã đồng ý điều khoản',
    type: () => User,
  })
  user: User;

  @ManyToOne(() => Contract, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'contract_id',
    foreignKeyConstraintName: 'fk_contract_acceptance_contract',
  })
  @ApiProperty({
    description: 'Thông tin điều khoản đã được chấp nhận',
    type: () => Contract,
  })
  contract: Contract;
}
