import { Base } from '@/common/models/base.model';
import { OrderServiceDetail } from '@/common/models/order/orderServiceDetail.model';
import { UpdateRequest } from '@/common/models/order/updateRequest.model';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

@Entity('update_order_service_details')
export class UpdateOrderServiceDetail extends Base {
  @ManyToOne(
    () => OrderServiceDetail,
    (orderServiceDetail) => orderServiceDetail.updateOrderServiceDetails,
    {
      nullable: false,
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({
    name: 'order_service_detail_id',
    foreignKeyConstraintName: 'fk_order_service_detail_update_order_service_detail',
  })
  @ApiProperty({
    description: 'Chi tiết dịch vụ đơn hàng liên quan',
    type: OrderServiceDetail,
  })
  orderServiceDetail: OrderServiceDetail;

  @OneToOne(() => UpdateRequest, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'update_request_id',
    foreignKeyConstraintName: 'fk_update_request_update_order_service_detail',
  })
  @ApiProperty({
    description: 'Yêu cầu cập nhật liên quan',
    type: UpdateRequest,
  })
  updateRequest: UpdateRequest;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    unsigned: true,
    nullable: false,
    default: 0,
    comment: 'Phí phụ thu cho yêu cầu cập nhật',
  })
  @ApiProperty({
    type: 'number',
    format: 'decimal',
    minimum: 0,
    nullable: false,
    description: 'Phí phụ thu cho yêu cầu cập nhật (VNĐ)',
    example: 1500000,
  })
  price: number;
}
