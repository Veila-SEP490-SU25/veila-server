import { DressService } from './../dress/dress.service';
import { OrderDressDetail } from '@/common/models';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { CUOrderDressDetailDto, OrderDressDetailDto } from './order-dress-details.dto';

@Injectable()
export class OrderDressDetailsService {
  constructor(
    @InjectRepository(OrderDressDetail)
    private readonly orderDressDetailRepository: Repository<OrderDressDetail>,
    private readonly dressService: DressService,
  ) {}

  async saveOrderDressDetails(
    orderId: string,
    dressDetails: CUOrderDressDetailDto[],
  ): Promise<void> {
    const orderDressDetails = dressDetails.map((dressDetail) => ({
      orderId,
      dressId: dressDetail.dressId,
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
      isRated: dressDetail.is_rated,
    }));
    await this.orderDressDetailRepository.save(
      plainToInstance(OrderDressDetail, orderDressDetails),
    );
  }

  async updateOrderDressDetail(
    id: string,
    shopId: string,
    dressDetail: CUOrderDressDetailDto,
  ): Promise<void> {
    const existingOrderDressDetail = await this.orderDressDetailRepository.findOneBy({ id });
    if (!existingOrderDressDetail)
      throw new NotFoundException('Không tìm thấy chi tiết váy trong đơn hàng');

    const boolean = await this.dressService.isDressExistForOwner(dressDetail.dressId, shopId);
    if (!boolean) throw new NotFoundException('Không tìm thấy váy này trong shop');

    existingOrderDressDetail.dress.id = dressDetail.dressId;
    existingOrderDressDetail.high = dressDetail.high;
    existingOrderDressDetail.weight = dressDetail.weight;
    existingOrderDressDetail.bust = dressDetail.bust;
    existingOrderDressDetail.waist = dressDetail.waist;
    existingOrderDressDetail.hip = dressDetail.hip;
    existingOrderDressDetail.armpit = dressDetail.armpit;
    existingOrderDressDetail.bicep = dressDetail.bicep;
    existingOrderDressDetail.neck = dressDetail.neck;
    existingOrderDressDetail.shoulderWidth = dressDetail.shoulderWidth;
    existingOrderDressDetail.sleeveLength = dressDetail.sleeveLength;
    existingOrderDressDetail.backLength = dressDetail.backLength;
    existingOrderDressDetail.lowerWaist = dressDetail.lowerWaist;
    existingOrderDressDetail.waistToFloor = dressDetail.waistToFloor;
    existingOrderDressDetail.description = dressDetail.description;
    existingOrderDressDetail.price = dressDetail.price;

    await this.orderDressDetailRepository.save(existingOrderDressDetail);
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

  async deleteOrderDressDetail(id: string): Promise<void> {
    await this.orderDressDetailRepository.delete(id);
  }
}
