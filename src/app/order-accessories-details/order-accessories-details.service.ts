import { OrderAccessoryDetail } from '@/common/models';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { OrderAccessoriesDetailDto } from './order-accessories-details.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class OrderAccessoriesDetailsService {
  constructor(
    @InjectRepository(OrderAccessoryDetail)
    private readonly orderAccessoryDetailRepository: Repository<OrderAccessoryDetail>,
  ) {}

  async saveOrderAccessoryDetails(
    orderId: string,
    accessoriesDetails: OrderAccessoryDetail[],
  ): Promise<void> {
    const orderAccessoryDetails = accessoriesDetails.map((accessoriesDetail) => ({
      orderId,
      accessoryId: accessoriesDetail.accessory.id,
      quantity: accessoriesDetail.quantity,
      description: accessoriesDetail.description,
      price: accessoriesDetail.price,
      isRated: accessoriesDetail.isRated,
    }));
    await this.orderAccessoryDetailRepository.save(orderAccessoryDetails);
  }

  async getOrderAccessoryDetails(orderId: string): Promise<OrderAccessoriesDetailDto[]> {
    const orderAccessoriesDetails = await this.orderAccessoryDetailRepository.find({
      where: { order: { id: orderId } },
      relations: ['accessory', 'order'],
    });
    return plainToInstance(OrderAccessoriesDetailDto, orderAccessoriesDetails);
  }

  async getOrderAccessoryDetailsById(id: string): Promise<OrderAccessoriesDetailDto | null> {
    const orderAccessoriesDetail = await this.orderAccessoryDetailRepository.findOne({
      where: { id },
      relations: ['accessory', 'order'],
    });
    return plainToInstance(OrderAccessoriesDetailDto, orderAccessoriesDetail);
  }
}
