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

  async saveOrderDressDetails(orderId: string, dressDetails: CUOrderDressDetailDto): Promise<void> {
    const dress = await this.dressService.getOne(dressDetails.dressId);

    const orderDressDetail = {
      order: { id: orderId },
      dress: { id: dressDetails.dressId },
      height: dressDetails.height,
      weight: dressDetails.weight,
      bust: dressDetails.bust,
      waist: dressDetails.waist,
      hip: dressDetails.hip,
      armpit: dressDetails.armpit,
      bicep: dressDetails.bicep,
      neck: dressDetails.neck,
      shoulderWidth: dressDetails.shoulderWidth,
      sleeveLength: dressDetails.sleeveLength,
      backLength: dressDetails.backLength,
      lowerWaist: dressDetails.lowerWaist,
      waistToFloor: dressDetails.waistToFloor,
      description: '',
      price: Number(dress.sellPrice),
    } as OrderDressDetail;

    await this.orderDressDetailRepository.save(plainToInstance(OrderDressDetail, orderDressDetail));
  }

  async saveRentalOrderDressDetails(
    orderId: string,
    dressDetails: CUOrderDressDetailDto,
  ): Promise<void> {
    const dress = await this.dressService.getOne(dressDetails.dressId);

    const orderDressDetail = {
      order: { id: orderId },
      dress: { id: dressDetails.dressId },
      height: dressDetails.height,
      weight: dressDetails.weight,
      bust: dressDetails.bust,
      waist: dressDetails.waist,
      hip: dressDetails.hip,
      armpit: dressDetails.armpit,
      bicep: dressDetails.bicep,
      neck: dressDetails.neck,
      shoulderWidth: dressDetails.shoulderWidth,
      sleeveLength: dressDetails.sleeveLength,
      backLength: dressDetails.backLength,
      lowerWaist: dressDetails.lowerWaist,
      waistToFloor: dressDetails.waistToFloor,
      description: '',
      price: Number(dress.rentalPrice),
    } as OrderDressDetail;

    await this.orderDressDetailRepository.save(plainToInstance(OrderDressDetail, orderDressDetail));
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
    existingOrderDressDetail.height = dressDetail.height;
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

  async createOrderDressDetailForSeeding(
    orderDressDetail: OrderDressDetail,
  ): Promise<OrderDressDetail> {
    return await this.orderDressDetailRepository.save(orderDressDetail);
  }

  async getOrderDressDetailByOrderId(orderId: string): Promise<OrderDressDetail | null> {
    return await this.orderDressDetailRepository.findOne({
      where: { order: { id: orderId } },
      relations: ['order', 'dress'],
    });
  }

  async updateOrderDressDetailForSeedingFeedback(id: string): Promise<void> {
    await this.orderDressDetailRepository.update(id, { isRated: true });
  }
}
