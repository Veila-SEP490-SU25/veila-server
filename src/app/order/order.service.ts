import { ShopService } from './../shop/shop.service';
import { Filtering, getOrder, getWhere, Sorting } from '@/common/decorators';
import { Complaint, Order, OrderStatus, OrderType } from '@/common/models';
import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { createOrderRequestDto, CUOrderDto, OrderDto } from './order.dto';
import { plainToInstance } from 'class-transformer';
import { UserService } from '../user';
import { OrderDressDetailsService } from '../order-dress-details';
import { OrderAccessoriesDetailsService } from '../order-accessories-details';
import { ComplaintService, CUComplaintDto } from '@/app/complaint';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly userService: UserService,
    private readonly shopService: ShopService,
    private readonly orderDressDetailsService: OrderDressDetailsService,
    private readonly orderAccessoriesDetailsService: OrderAccessoriesDetailsService,
    @Inject(ComplaintService)
    private readonly complaintService: ComplaintService,
  ) {}

  async getOrdersForAdmin(
    take: number,
    skip: number,
    sort?: Sorting,
    filter?: Filtering,
  ): Promise<[OrderDto[], number]> {
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

    return [plainToInstance(OrderDto, orders), orders.length];
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
  ): Promise<[OrderDto[], number]> {
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

    return [plainToInstance(OrderDto, orders), orders.length];

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
  ): Promise<[OrderDto[], number]> {
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

    return [plainToInstance(OrderDto, orders), orders.length];
    // return await this.orderRepository.findAndCount({
    //   where,
    //   order,
    //   take,
    //   skip,
    // });
  }

  async getOrderById(id: string): Promise<OrderDto> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['customer', 'shop'],
    });
    if (!order) throw new NotFoundException('Không tìm thấy đơn hàng nào phù hợp');
    return plainToInstance(OrderDto, order);
  }

  async createOrderForSell(userId: string, body: createOrderRequestDto): Promise<Order> {
    //Kiểm tra logic, đảm bảo đầy đủ ràng buộc
    const user = await this.userService.getUserById(userId);
    if (!user) throw new NotFoundException('Người dùng này không tồn tại');

    if (!user.isIdentified) throw new ForbiddenException('Người dùng chưa định danh');

    const shop = await this.shopService.getShopForCustomer(body.newOrder.shopId);
    if (!shop) throw new NotFoundException('Không tìm thấy cửa hàng');

    //tính tiền váy
    let dressPrice = 0;
    await Promise.all(
      body.dressDetails.map((dress) => {
        dressPrice += dress.price;
      }),
    );

    //tính tiền phụ kiện
    let accessoriesPrice = 0;
    await Promise.all(
      body.accessoriesDetails.map(async (accessory) => {
        const item = await this.orderAccessoriesDetailsService.getAccessoryById(
          accessory.accessoryId,
        );
        accessoriesPrice += item.sellPrice * accessory.quantity;
      }),
    );

    //tạo đơn hàng
    const order = {
      customer: { id: userId },
      shop: { id: body.newOrder.shopId },
      phone: body.newOrder.phone,
      email: body.newOrder.email,
      address: body.newOrder.address,
      dueDate: body.newOrder.dueDate,
      returnDate: body.newOrder.returnDate,
      amount: dressPrice + accessoriesPrice,
      type: OrderType.SELL,
      status: OrderStatus.PENDING,
    } as Order;
    const orderId = (await this.orderRepository.save(order)).id;

    await this.orderDressDetailsService.saveOrderDressDetails(orderId, body.dressDetails);
    await this.orderAccessoriesDetailsService.saveOrderAccessoryDetails(
      orderId,
      body.accessoriesDetails,
    );
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

  async getOrderByShopId(shopId: string): Promise<Order[] | null> {
    return await this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.shop', 'shop')
      .where('shop.id = :shopId', { shopId })
      .andWhere('order.status IN (:...statuses)', {
        statuses: [OrderStatus.PENDING, OrderStatus.IN_PROCESS],
      })
      .getMany();
  }

  async getAllTypeOrders(type: OrderType): Promise<Order[]> {
    return await this.orderRepository.find({
      where: { type },
      withDeleted: true,
    });
  }

  async getAllOrdersForSeeding(type: OrderType, status: OrderStatus): Promise<Order[]> {
    return await this.orderRepository.find({
      where: { type, status },
      withDeleted: true,
    });
  }

  async createOrderForSeeding(order: Order): Promise<Order> {
    return await this.orderRepository.save(order);
  }

  async getCompletedOrderForSeeding(
    customerId: string,
    shopId: string,
    type: OrderType,
  ): Promise<Order | null> {
    return await this.orderRepository.findOne({
      where: {
        customer: { id: customerId },
        shop: { id: shopId },
        type,
        status: OrderStatus.COMPLETED,
      },
      order: { createdAt: 'ASC' },
      relations: {
        orderAccessoriesDetail: { accessory: true },
        orderDressDetail: { dress: true },
      },
    });
  }

  async getOwnerComplaints(
    userId: string,
    orderId: string,
    take: number,
    skip: number,
    sort?: Sorting,
    filter?: Filtering,
  ): Promise<[Complaint[], number]> {
    return await this.complaintService.getOwnerComplaints(
      userId,
      orderId,
      take,
      skip,
      sort,
      filter,
    );
  }

  async createComplaint(userId: string, orderId: string, body: CUComplaintDto): Promise<Complaint> {
    return await this.complaintService.createComplaint(userId, orderId, body);
  }

  async getOwnerOrderById(userId: string, orderId: string): Promise<Order | null> {
    const customerOrder = await this.orderRepository.findOne({
      where: {
        id: orderId,
        customer: { id: userId },
      },
    });
    const shopOrder = await this.orderRepository.findOne({
      where: {
        id: orderId,
        shop: { user: { id: userId } },
      },
    });
    return customerOrder || shopOrder;
  }

  async getAllComplaintsForSeeding(): Promise<Complaint[]> {
    return await this.complaintService.getAllForSeeding();
  }

  async getOrderForSeedingComplaint(
    customerId: string,
    shopId: string,
    type: OrderType,
  ): Promise<Order | null> {
    return await this.orderRepository.findOne({
      where: {
        customer: { id: customerId },
        shop: { user: { id: shopId } },
        status: OrderStatus.COMPLETED,
        type,
      },
    });
  }

  async createComplaintForSeeding(complaint: Complaint): Promise<Complaint> {
    return await this.complaintService.createComplaintForSeeding(complaint);
  }
}
