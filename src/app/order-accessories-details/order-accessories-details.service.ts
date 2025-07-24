import { OrderAccessoryDetail } from '@/common/models';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';
import {
  CUOrderAccessoriesDetailDto,
  OrderAccessoriesDetailDto,
} from './order-accessories-details.dto';
import { plainToInstance } from 'class-transformer';
import { AccessoryService } from '../accessory';

@Injectable()
export class OrderAccessoriesDetailsService {
  constructor(
    @InjectRepository(OrderAccessoryDetail)
    private readonly orderAccessoryDetailRepository: Repository<OrderAccessoryDetail>,
    private readonly accessoryService: AccessoryService,
  ) {}

  async saveOrderAccessoryDetails(
    orderId: string,
    accessoriesDetails: CUOrderAccessoriesDetailDto[],
  ): Promise<void> {
    const orderAccessoryDetails = accessoriesDetails.map((accessoriesDetail) => ({
      orderId,
      accessoryId: accessoriesDetail.accessoryId,
      quantity: accessoriesDetail.quantity,
      description: accessoriesDetail.description,
      price: accessoriesDetail.price,
      isRated: accessoriesDetail.is_rated,
    }));
    await this.orderAccessoryDetailRepository.save(
      plainToInstance(OrderAccessoryDetail, orderAccessoryDetails),
    );
  }

  async updateOrderAccessoryDetail(
    id: string,
    shopId: string,
    accessoriesDetail: CUOrderAccessoriesDetailDto,
  ): Promise<void> {
    const existingOrderAccessoryDetail = await this.orderAccessoryDetailRepository.findOneBy({
      id,
    });
    if (!existingOrderAccessoryDetail)
      throw new NotFoundException('Không tìm thấy chi tiết phụ kiện trong đơn hàng');

    const boolean = await this.accessoryService.isCategoryExistForOwner(
      accessoriesDetail.accessoryId,
      shopId,
    );
    if (!boolean) throw new NotFoundException('Không tìm thấy phụ kiện này trong shop');

    existingOrderAccessoryDetail.accessory.id = accessoriesDetail.accessoryId;
    existingOrderAccessoryDetail.quantity = accessoriesDetail.quantity;
    existingOrderAccessoryDetail.description = accessoriesDetail.description;
    existingOrderAccessoryDetail.price = accessoriesDetail.price;

    await this.orderAccessoryDetailRepository.save(existingOrderAccessoryDetail);
  }

  async getOrderAccessoryDetails(orderId: string): Promise<OrderAccessoriesDetailDto[]> {
    const orderAccessoriesDetails = await this.orderAccessoryDetailRepository.find({
      where: { order: { id: orderId } },
      relations: ['accessory', 'order'],
    });
    return plainToInstance(OrderAccessoriesDetailDto, orderAccessoriesDetails);
  }

  async getOrderAccessoryDetailById(id: string): Promise<OrderAccessoriesDetailDto | null> {
    const orderAccessoriesDetail = await this.orderAccessoryDetailRepository.findOne({
      where: { id },
      relations: ['accessory', 'order'],
    });
    return plainToInstance(OrderAccessoriesDetailDto, orderAccessoriesDetail);
  }

  async deleteOrderAccessoryDetail(id: string): Promise<void> {
    await this.orderAccessoryDetailRepository.delete(id);
  }
}
