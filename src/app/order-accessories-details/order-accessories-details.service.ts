import { Accessory, OrderAccessoryDetail } from '@/common/models';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';
import {
  CUOrderAccessoriesDetailDto,
  OrderAccessoriesDetailDto,
} from './order-accessories-details.dto';
import { plainToInstance } from 'class-transformer';
import { AccessoryService } from '../accessory';
import { Filtering, getOrder, getWhere, Sorting } from '@/common/decorators';

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
    // Resolve async computations within map; otherwise you'll pass an array of Promises to save()
    const orderAccessoryDetails = await Promise.all(
      accessoriesDetails.map(async (detail) => {
        const accessory = await this.getAccessoryById(detail.accessoryId);
        return this.orderAccessoryDetailRepository.create({
          order: { id: orderId },
          accessory: { id: detail.accessoryId },
          quantity: Number(detail.quantity),
          price: Number(accessory.sellPrice ?? 0) * Number(detail.quantity ?? 0),
        } as OrderAccessoryDetail);
      }),
    );

    await this.orderAccessoryDetailRepository.save(orderAccessoryDetails);
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

    const boolean = await this.accessoryService.isAccessoryExistForOwner(
      accessoriesDetail.accessoryId,
      shopId,
    );
    if (!boolean) throw new NotFoundException('Không tìm thấy phụ kiện này trong shop');

    existingOrderAccessoryDetail.accessory.id = accessoriesDetail.accessoryId;
    existingOrderAccessoryDetail.quantity = accessoriesDetail.quantity;
    existingOrderAccessoryDetail.price =
      (await this.getAccessoryById(accessoriesDetail.accessoryId)).sellPrice *
      accessoriesDetail.quantity;

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

  async createOrderAccessoryDetailForSeeding(
    orderAccessoryDetail: OrderAccessoryDetail,
  ): Promise<OrderAccessoryDetail> {
    return await this.orderAccessoryDetailRepository.save(orderAccessoryDetail);
  }

  async getAccessoryById(id: string): Promise<Accessory> {
    return await this.accessoryService.getAccessoryById(id);
  }
  
  async getOrderAccessoriesDetailsByOrderId(
    orderId: string,
    take: number,
    skip: number,
    sort?: Sorting,
    filter?: Filtering,
  ): Promise<OrderAccessoryDetail[]> {
    const dynamicFilter = getWhere(filter);
    const where = {
      ...dynamicFilter,
      order: { id: orderId },
    };
    const order = getOrder(sort);

    const orderAccessoriesDetails = await this.orderAccessoryDetailRepository.find({
      where,
      relations: ['accessory', 'order'],
      take,
      skip,
      order,
    });
    return orderAccessoriesDetails;
  }

  async getOrderAccessoryDetailsByOrderId(orderId: string): Promise<OrderAccessoryDetail[]> {
    return await this.orderAccessoryDetailRepository.find({
      where: { order: { id: orderId } },
      relations: ['order', 'accessory'],
    });
  }

  async updateOrderAccessoryDetailForSeedingFeedback(id: string): Promise<void> {
    await this.orderAccessoryDetailRepository.update(id, { isRated: true });
  }
}
