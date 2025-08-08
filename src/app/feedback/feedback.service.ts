import { CUFeedbackDto } from '@/app/feedback/feedback.dto';
import {
  Feedback,
  Order,
  OrderAccessoryDetail,
  OrderDressDetail,
  OrderServiceDetail,
  OrderStatus,
  OrderType,
} from '@/common/models';
import { Injectable, MethodNotAllowedException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(Feedback)
    private readonly feedbackRepository: Repository<Feedback>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderAccessoryDetail)
    private readonly orderAccessoryDetailRepository: Repository<OrderAccessoryDetail>,
    @InjectRepository(OrderDressDetail)
    private readonly orderDressDetailRepository: Repository<OrderDressDetail>,
    @InjectRepository(OrderServiceDetail)
    private readonly orderServiceDetailRepository: Repository<OrderServiceDetail>,
  ) {}

  async createFeedbackForCustomer(
    userId: string,
    { orderId, productId, ...body }: CUFeedbackDto,
  ): Promise<Feedback> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId, customer: { id: userId }, status: OrderStatus.COMPLETED },
      relations: { orderDressDetail: true, orderAccessoriesDetail: true, orderServiceDetail: true },
    });
    if (!order) throw new NotFoundException('Không tìm thấy đơn hàng để đánh giá');
    // Check if the order is of type CUSTOM
    if (order.type === OrderType.CUSTOM) {
      // Check if the service has already been rated
      if (order.orderServiceDetail?.isRated)
        throw new MethodNotAllowedException('Đơn hàng đã được đánh giá dịch vụ');
      // Check if the service exists in the order
      if (order.orderServiceDetail?.service.id !== productId)
        throw new NotFoundException('Không tìm thấy dịch vụ để đánh giá');
      await this.orderServiceDetailRepository.update(productId, { isRated: true });
      const feedback = {
        ...body,
        customer: { id: userId },
        order: { id: orderId },
        service: { id: productId },
      } as Feedback;
      return await this.feedbackRepository.save(feedback);
    } else {
      // Check if the one being rated is a dress
      const isDress = order.orderDressDetail?.dress.id === productId;
      if (isDress) {
        // Check if the dress has already been rated
        if (order.orderDressDetail?.isRated)
          throw new MethodNotAllowedException('Đơn hàng đã được đánh giá sản phẩm');
        await this.orderDressDetailRepository.update(productId, { isRated: true });
        const feedback = {
          ...body,
          customer: { id: userId },
          order: { id: orderId },
          dress: { id: productId },
        } as Feedback;
        return await this.feedbackRepository.save(feedback);
      } else {
        // Check if the accessory exists in the order
        const accessory = order.orderAccessoriesDetail?.find(
          (detail) => detail.accessory.id === productId,
        );
        if (!accessory)
          throw new NotFoundException('Không tìm thấy phụ kiện hay váy cưới để đánh giá');
        // Check if the accessory is being rated
        if (accessory.isRated)
          throw new MethodNotAllowedException('Đơn hàng đã được đánh giá phụ kiện');
        await this.orderAccessoryDetailRepository.update(productId, { isRated: true });
        const feedback = {
          ...body,
          customer: { id: userId },
          order: { id: orderId },
          accessory: { id: productId },
        } as Feedback;
        return await this.feedbackRepository.save(feedback);
      }
    }
  }

  async getFeedbackById(id: string): Promise<Feedback> {
    const feedback = await this.feedbackRepository.findOne({
      where: { id },
      relations: {
        customer: true,
        order: { shop: true },
        dress: true,
        accessory: true,
        service: true,
      },
    });
    if (!feedback) throw new NotFoundException('Không tìm thấy phản hồi');
    return feedback;
  }

  async getAllFeedbacks(): Promise<Feedback[]> {
    return await this.feedbackRepository.find({
      withDeleted: true,
    });
  }

  async createFeedbackForSeeding(feedback: Feedback): Promise<Feedback> {
    return await this.feedbackRepository.save(feedback);
  }
}
