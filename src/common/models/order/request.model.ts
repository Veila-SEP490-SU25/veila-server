import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Base, UpdateRequest, User } from '@/common/models';
import { ApiProperty } from '@nestjs/swagger';

export enum RequestStatus {
  DRAFT = 'DRAFT',
  SUBMIT = 'SUBMIT',
  ACCEPTED = 'ACCEPTED',
  CANCELLED = 'CANCELLED',
}

@Entity('requests')
export class Request extends Base {
  @ManyToOne(() => User, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'user_id',
    foreignKeyConstraintName: 'fk_user_request',
  })
  user: User;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: false,
    comment: 'Tiêu đề yêu cầu',
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
  })
  @ApiProperty({
    type: 'string',
    maxLength: 200,
    nullable: false,
    description: 'Tiêu đề yêu cầu',
    example: 'Yêu cầu thiết kế váy cưới',
  })
  title: string;

  @Column({
    type: 'text',
    nullable: false,
    comment: 'Mô tả chi tiết yêu cầu',
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
  })
  @ApiProperty({
    type: 'string',
    nullable: false,
    description: 'Mô tả chi tiết yêu cầu',
    example: 'Tôi muốn thiết kế một chiếc váy cưới theo phong cách cổ điển.',
  })
  description: string;

  @Column({
    type: 'integer',
    unsigned: true,
    nullable: true,
    comment: 'Chiều cao của cô dâu',
  })
  @ApiProperty({
    type: 'number',
    nullable: true,
    description: 'Chiều cao của cô dâu (cm)',
    example: '170',
  })
  height: number | null;

  @Column({
    type: 'integer',
    unsigned: true,
    nullable: true,
    comment: 'Cân nặng',
  })
  @ApiProperty({
    type: 'number',
    nullable: true,
    description: 'Cân nặng (kg)',
    example: '45',
  })
  weight: number | null;

  @Column({
    type: 'integer',
    unsigned: true,
    nullable: true,
    comment: 'Vòng ngực',
  })
  @ApiProperty({
    type: 'number',
    nullable: true,
    description: 'Vòng ngực (cm)',
    example: '90',
  })
  bust: number | null;

  @Column({
    type: 'integer',
    unsigned: true,
    nullable: true,
    comment: 'Vòng eo',
  })
  @ApiProperty({
    type: 'number',
    nullable: true,
    description: 'Vòng eo (cm)',
    example: '60',
  })
  waist: number | null;

  @Column({
    type: 'integer',
    unsigned: true,
    nullable: true,
    comment: 'Vòng mông',
  })
  @ApiProperty({
    type: 'number',
    nullable: true,
    description: 'Vòng mông (cm)',
    example: '80',
  })
  hip: number | null;

  @Column({
    type: 'integer',
    unsigned: true,
    nullable: true,
    comment: 'Vòng nách',
  })
  @ApiProperty({
    type: 'number',
    nullable: true,
    description: 'Vòng nách (cm)',
    example: '10',
  })
  armpit: number | null;

  @Column({
    type: 'integer',
    unsigned: true,
    nullable: true,
    comment: 'Vòng bắp tay',
  })
  @ApiProperty({
    type: 'number',
    nullable: true,
    description: 'Vòng bắp tay (cm)',
    example: '10',
  })
  bicep: number | null;

  @Column({
    type: 'integer',
    unsigned: true,
    nullable: true,
    comment: 'Vòng cổ',
  })
  @ApiProperty({
    type: 'number',
    nullable: true,
    description: 'Vòng cổ (cm)',
    example: '20',
  })
  neck: number | null;

  @Column({
    type: 'integer',
    unsigned: true,
    nullable: true,
    comment: 'Chiều rộng vai',
  })
  @ApiProperty({
    type: 'number',
    nullable: true,
    description: 'Chiều rộng vai (cm)',
    example: '40',
  })
  shoulderWidth: number | null;

  @Column({
    type: 'integer',
    unsigned: true,
    nullable: true,
    comment: 'Chiều dài tay',
  })
  @ApiProperty({
    type: 'number',
    nullable: true,
    description: 'Chiều dài tay (cm)',
    example: '40',
  })
  sleeveLength: number | null;

  @Column({
    type: 'integer',
    unsigned: true,
    nullable: true,
    comment: 'Chiều dài lưng, từ chân cổ đến eo',
  })
  @ApiProperty({
    type: 'number',
    nullable: true,
    description: 'Chiều dài lưng, từ chân cổ đến eo (cm)',
    example: '60',
  })
  backLength: number | null;

  @Column({
    type: 'integer',
    unsigned: true,
    nullable: true,
    comment: 'Từ chân ngực đến eo',
  })
  @ApiProperty({
    type: 'number',
    nullable: true,
    description: 'Từ chân ngực đến eo (cm)',
    example: '50',
  })
  lowerWaist: number | null;

  @Column({
    type: 'integer',
    unsigned: true,
    nullable: true,
    comment: 'Độ dài tùng váy',
  })
  @ApiProperty({
    type: 'number',
    nullable: true,
    description: 'Độ dài tùng váy (cm)',
    example: '60',
  })
  waistToFloor: number | null;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    comment: 'Chất liệu',
  })
  @ApiProperty({
    type: 'string',
    description: 'Chất liệu (tối đa 50 ký tự)',
    example: 'Cotton',
    maxLength: 50,
    nullable: true,
  })
  material: string | null;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    comment: 'Màu sắc',
  })
  @ApiProperty({
    type: 'string',
    description: 'Màu sắc (tối đa 50 ký tự)',
    example: 'Đỏ',
    maxLength: 50,
    nullable: true,
  })
  color: string | null;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    comment: 'Độ dài',
  })
  @ApiProperty({
    type: 'string',
    description: 'Độ dài (tối đa 50 ký tự)',
    example: 'Dài',
    maxLength: 50,
    nullable: true,
  })
  length: string | null;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    comment: 'Cổ',
  })
  @ApiProperty({
    type: 'string',
    description: 'Cổ (tối đa 50 ký tự)',
    example: 'Cổ tròn',
    maxLength: 50,
    nullable: true,
  })
  neckline: string | null;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    comment: 'Tay',
  })
  @ApiProperty({
    type: 'string',
    description: 'Tay (tối đa 50 ký tự)',
    example: 'Tay ngắn',
    maxLength: 50,
    nullable: true,
  })
  sleeve: string | null;

  @Column({
    name: 'images',
    type: 'text',
    nullable: true,
  })
  @ApiProperty({
    type: 'string',
    format: 'text',
    nullable: true,
    description: "Chuỗi hình ảnh, cách nhau bằng dấu ','",
    example: 'https://veila.images/1,https://veila.images/2',
  })
  images: string | null;

  @Column({
    type: 'enum',
    enum: RequestStatus,
    default: RequestStatus.DRAFT,
    nullable: false,
    comment: 'Trạng thái yêu cầu',
  })
  @ApiProperty({
    enum: RequestStatus,
    default: RequestStatus.DRAFT,
    nullable: false,
    description: 'Trạng thái yêu cầu',
    example: RequestStatus.DRAFT,
  })
  status: RequestStatus;

  @Column({
    type: 'boolean',
    nullable: false,
    default: false,
    comment: 'Yêu cầu này có riêng tư không',
  })
  @ApiProperty({
    type: 'boolean',
    default: false,
    nullable: false,
    description: 'Yêu cầu này có riêng tư không',
    example: false,
  })
  isPrivate: boolean;

  @OneToMany(() => UpdateRequest, (updateRequest) => updateRequest.request, {
    nullable: true,
  })
  updateRequests: UpdateRequest[] | null;
}
