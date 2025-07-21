import { OrderDressDetail } from '@/common/models';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderDressDetailDto } from './order-dress-details.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class OrderDressDetailsService {
  constructor(
    @InjectRepository(OrderDressDetail)
    private readonly orderDressDetailRepository: Repository<OrderDressDetail>,
  ) {}

  async saveOrderDressDetails(orderId: string, dressDetails: OrderDressDetail[]): Promise<void> {
    const orderDressDetails = dressDetails.map((dressDetail) => ({
      orderId,
      dressId: dressDetail.dress.id,
      high: dressDetail.high,
      weight: dressDetail.weight,
      bust: dressDetail.bust,
      waist: dressDetail.waist,
      hip: dressDetail.hip,
      armpit: dressDetail.armpit,
      bicep: dressDetail.bicep,
      neck: dressDetail.neck,
      shoulderWidth: dressDetail.shoulderWidth,
      sleeveLength: dressDetail.sleeveLength,
      backLength: dressDetail.backLength,
      lowerWaist: dressDetail.lowerWaist,
      waistToFloor: dressDetail.waistToFloor,
      description: dressDetail.description,
      price: dressDetail.price,
      isRated: dressDetail.isRated,
    }));
    await this.orderDressDetailRepository.save(orderDressDetails);
  }

  async getOrderDressDetails(orderId: string): Promise<OrderDressDetailDto[]> {
    const orderDressDetails = await this.orderDressDetailRepository.find({
      where: { order: { id: orderId } },
      relations: ['order', 'dress'],
    });
    return plainToInstance(OrderDressDetailDto, orderDressDetails);
  }

  async getOrderDressDetailsById(id: string): Promise<OrderDressDetailDto | null> {
    const orderDressDetails = await this.orderDressDetailRepository.findOne({
      where: { id },
      relations: ['order', 'dress'],
    });
    return plainToInstance(OrderDressDetailDto, orderDressDetails);
  }
}
