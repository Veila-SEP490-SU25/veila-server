import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Base, Order, Request, Service } from '@/common/models';
import { ApiProperty } from '@nestjs/swagger';

@Entity('order_service_details')
export class OrderServiceDetail extends Base {
  @ManyToOne(() => Order, (order) => order.orderServiceDetail, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'order_id',
    foreignKeyConstraintName: 'fk_order_order_service_detail',
  })
  @ApiProperty({
    description: 'Đơn hàng liên quan',
    type: Order,
  })
  order: Order;

  @OneToOne(() => Request)
  @JoinColumn({
    name: 'request_id',
    foreignKeyConstraintName: 'fk_request_order_service_detail',
  })
  @ApiProperty({
    description: 'Yêu cầu dịch vụ liên quan',
    type: Request,
  })
  request: Request;

  @ManyToOne(() => Service, {
    nullable: false,
  })
  @JoinColumn({
    name: 'service_id',
    foreignKeyConstraintName: 'fk_service_order_service_detail',
  })
  @ApiProperty({
    description: 'Dịch vụ được đặt',
    type: Service,
  })
  service: Service;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    unsigned: true,
    nullable: false,
    default: 0,
    comment: 'Giá dịch vụ tại thời điểm đặt',
  })
  @ApiProperty({
    type: 'number',
    format: 'decimal',
    minimum: 0,
    nullable: false,
    description: 'Giá dịch vụ tại thời điểm đặt (VNĐ)',
    example: 1500000,
  })
  price: number;

  @Column({
    type: 'int',
    unsigned: true,
    nullable: false,
    default: 1,
    comment: 'Phiên bản dịch vụ',
  })
  @ApiProperty({
    type: 'integer',
    minimum: 1,
    nullable: false,
    description: 'Phiên bản dịch vụ',
    example: 1,
  })
  version: number;
}
