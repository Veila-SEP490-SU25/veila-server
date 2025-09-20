import { AccessoryService } from '@/app/accessory';
import { DressService } from '@/app/dress';
import { CUFeedbackDto } from '@/app/feedback/feedback.dto';
import { ServiceService } from '@/app/service';
import {
  Feedback,
  Order,
  OrderAccessoryDetail,
  OrderDressDetail,
  OrderServiceDetail,
  OrderStatus,
  OrderType,
} from '@/common/models';
import {
  forwardRef,
  Inject,
  Injectable,
  MethodNotAllowedException,
  NotFoundException,
} from '@nestjs/common';
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
    @Inject(DressService)
    private readonly dressService: DressService,
    @Inject(forwardRef(() => AccessoryService))
    private readonly accessoryService: AccessoryService,
    @Inject(ServiceService)
    private readonly serviceService: ServiceService,
  ) {}

  async createFeedbackForCustomer(
    userId: string,
    { orderId, productId, ...body }: CUFeedbackDto,
  ): Promise<Feedback> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId, customer: { id: userId }, status: OrderStatus.COMPLETED },
      relations: {
        orderDressDetail: { dress: true },
        orderAccessoriesDetail: { accessory: true },
        orderServiceDetail: { service: true },
      },
    });
    if (!order) throw new NotFoundException('Không tìm thấy đơn hàng để đánh giá');
    // Check if the order is of type CUSTOM
    if (order.type === OrderType.CUSTOM) {
      // Check if the service has already been rated
      if (!order.orderServiceDetail)
        throw new NotFoundException('Không tìm thấy chi tiết dịch vụ trong đơn hàng');
      if (order.orderServiceDetail.isRated)
        throw new MethodNotAllowedException('Đơn hàng đã được đánh giá dịch vụ');
      // Check if the service exists in the order
      if (order.orderServiceDetail.service.id !== productId)
        throw new NotFoundException('Không tìm thấy dịch vụ để đánh giá');
      const service = order.orderServiceDetail.service;
      // Mark the correct order service detail as rated (use detail id, not service id)
      await this.orderServiceDetailRepository.update(order.orderServiceDetail.id, {
        isRated: true,
      });
      const feedback = {
        ...body,
        customer: { id: userId },
        order: { id: orderId },
        service: { id: productId },
      } as Feedback;
      await this.serviceService.updateRating(
        productId,
        body.rating,
        service.ratingCount,
        service.ratingAverage,
      );
      return await this.feedbackRepository.save(feedback);
    } else {
      // Check if the one being rated is a dress
      const isDress = order.orderDressDetail?.dress.id === productId;
      if (isDress) {
        // Check if the dress has already been rated
        if (!order.orderDressDetail)
          throw new NotFoundException('Không tìm thấy chi tiết váy trong đơn hàng');
        if (order.orderDressDetail.isRated)
          throw new MethodNotAllowedException('Đơn hàng đã được đánh giá sản phẩm');
        const dress = order.orderDressDetail.dress;
        // Mark the correct order dress detail as rated (use detail id, not dress id)
        await this.orderDressDetailRepository.update(order.orderDressDetail.id, { isRated: true });
        const feedback = {
          ...body,
          customer: { id: userId },
          order: { id: orderId },
          dress: { id: productId },
        } as Feedback;
        await this.dressService.updateRating(
          productId,
          body.rating,
          dress.ratingCount,
          dress.ratingAverage,
        );
        return await this.feedbackRepository.save(feedback);
      } else {
        // Check if the accessory exists in the order
        const orderAccessoryDetail = order.orderAccessoriesDetail?.find(
          (detail) => detail.accessory.id === productId,
        );
        if (!orderAccessoryDetail)
          throw new NotFoundException('Không tìm thấy phụ kiện hay váy cưới để đánh giá');
        // Check if the accessory is being rated
        if (orderAccessoryDetail.isRated)
          throw new MethodNotAllowedException('Đơn hàng đã được đánh giá phụ kiện');
        const accessory = orderAccessoryDetail.accessory;
        // Mark the correct order accessory detail as rated (use detail id, not accessory id)
        await this.orderAccessoryDetailRepository.update(orderAccessoryDetail.id, {
          isRated: true,
        });
        const feedback = {
          ...body,
          customer: { id: userId },
          order: { id: orderId },
          accessory: { id: productId },
        } as Feedback;
        await this.accessoryService.updateRating(
          productId,
          body.rating,
          accessory.ratingCount,
          accessory.ratingAverage,
        );
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

  async getAllFeedbacksForSeeding(): Promise<Feedback[]> {
    return await this.feedbackRepository.find({
      withDeleted: true,
    });
  }

  async createFeedbackForSeeding(feedback: Feedback): Promise<Feedback> {
    return await this.feedbackRepository.save(feedback);
  }
}
