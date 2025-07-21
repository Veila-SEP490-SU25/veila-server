import { ShopService } from './../shop/shop.service';
import { Filtering, getOrder, getWhere, Sorting } from '@/common/decorators';
import { Order, OrderStatus } from '@/common/models';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CUOrderDto, orderDto } from './order.dto';
import { plainToInstance } from 'class-transformer';
import { UserService } from '../user';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly userService: UserService,
    private readonly shopService: ShopService,
  ) {}

  async getOrdersForAdmin(
    take: number,
    skip: number,
    sort?: Sorting,
    filter?: Filtering,
  ): Promise<[orderDto[], number]> {
    const dynamicFilter = getWhere(filter);
    const where = {
      ...dynamicFilter,
      status: In([
        OrderStatus.PENDING,
        OrderStatus.IN_PROCESS,
        OrderStatus.COMPLETED,
        OrderStatus.CANCELLED,
      ]),
    };
    const order = getOrder(sort);

    const orders = await this.orderRepository.find({
      where,
      order,
      take,
      skip,
      relations: ['customer', 'shop'],
    });

    return [plainToInstance(orderDto, orders), orders.length];
    // return await this.orderRepository.findAndCount({
    //   where,
    //   order,
    //   take,
    //   skip,
    // });
  }

  async getOrdersForCustomer(
    userId: string,
    take: number,
    skip: number,
    sort?: Sorting,
    filter?: Filtering,
  ): Promise<[orderDto[], number]> {
    const dynamicFilter = getWhere(filter);
    const where = {
      ...dynamicFilter,
      customer: { id: userId },
      status: In([
        OrderStatus.PENDING,
        OrderStatus.IN_PROCESS,
        OrderStatus.COMPLETED,
        OrderStatus.CANCELLED,
      ]),
    };
    const order = getOrder(sort);
    const orders = await this.orderRepository.find({
      where,
      order,
      take,
      skip,
      relations: ['customer', 'shop'],
    });

    return [plainToInstance(orderDto, orders), orders.length];

    // return await this.orderRepository.findAndCount({
    //   where,
    //   order,
    //   take,
    //   skip,
    // });
  }

  async getOrdersForShop(
    userId: string,
    take: number,
    skip: number,
    sort?: Sorting,
    filter?: Filtering,
  ): Promise<[orderDto[], number]> {
    const dynamicFilter = getWhere(filter);
    const where = {
      ...dynamicFilter,
      shop: { id: userId },
      status: In([
        OrderStatus.PENDING,
        OrderStatus.IN_PROCESS,
        OrderStatus.COMPLETED,
        OrderStatus.CANCELLED,
      ]),
    };
    const order = getOrder(sort);

    const orders = await this.orderRepository.find({
      where,
      order,
      take,
      skip,
      relations: ['customer', 'shop'],
    });

    return [plainToInstance(orderDto, orders), orders.length];
    // return await this.orderRepository.findAndCount({
    //   where,
    //   order,
    //   take,
    //   skip,
    // });
  }

  async getOrderById(id: string): Promise<orderDto> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['customer', 'shop'],
    });
    if (!order) throw new NotFoundException('Không tìm thấy đơn hàng nào phù hợp');
    return plainToInstance(orderDto, order);
  }

  async createOrder(userId: string, newOrder: CUOrderDto): Promise<Order> {
    const user = await this.userService.getUserById(userId);
    if (!user) throw new NotFoundException('Người dùng này không tồn tại');

    if (!user.isIdentified) throw new ForbiddenException('Người dùng chưa định danh');

    const shop = await this.shopService.getShopForCustomer(newOrder.shopId);
    if (!shop) throw new NotFoundException('Không tìm thấy cửa hàng');

    const order = {
      customer: { id: userId },
      shop: { id: newOrder.shopId },
      phone: newOrder.phone,
      email: newOrder.email,
      address: newOrder.address,
      dueDate: newOrder.dueDate,
      returnDate: newOrder.returnDate,
      isBuyBack: newOrder.isBuyBack,
      amount: newOrder.amount,
      type: newOrder.type,
      status: OrderStatus.PENDING,
    } as Order;
    await this.orderRepository.save(order);
    return order;
  }

  async updateOrder(userId: string, id: string, updatedOrder: CUOrderDto): Promise<Order> {
    const existingOrder = await this.getOrderById(id);

    if (existingOrder.status !== OrderStatus.PENDING)
      throw new BadRequestException('Đơn hàng đang trong quá trình thực hiện');

    if (!existingOrder) throw new NotFoundException('Không tìm thấy đơn hàng này');

    const user = await this.userService.getUserById(userId);
    if (!user) throw new NotFoundException('Người dùng này không tồn tại');

    const shop = await this.shopService.getShopForCustomer(updatedOrder.shopId);
    if (!shop) throw new NotFoundException('Không tìm thấy cửa hàng');

    existingOrder.phone = updatedOrder.phone;
    existingOrder.email = updatedOrder.email;
    existingOrder.address = updatedOrder.address;
    existingOrder.dueDate = updatedOrder.dueDate;
    existingOrder.returnDate = updatedOrder.returnDate;
    existingOrder.isBuyBack = updatedOrder.isBuyBack;
    existingOrder.amount = updatedOrder.amount;

    return await this.orderRepository.save(plainToInstance(Order, existingOrder));
  }

  async updateOrderStatus(userId: string, id: string, status: OrderStatus): Promise<Order> {
    const existingOrder = await this.getOrderById(id);

    if (!existingOrder || existingOrder.status === OrderStatus.CANCELLED)
      throw new NotFoundException('Không tìm thấy đơn hàng này');

    const user = await this.userService.getUserById(userId);
    if (!user) throw new NotFoundException('Người dùng này không tồn tại');

    existingOrder.status = status;

    return await this.orderRepository.save(plainToInstance(Order, existingOrder));
  }
}
