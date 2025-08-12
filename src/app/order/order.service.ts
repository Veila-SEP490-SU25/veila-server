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
import { CreateOrderRequestDto, OrderDto, UOrderDto } from './order.dto';
import { plainToInstance } from 'class-transformer';
import { UserService } from '../user';
import { OrderDressDetailDto, OrderDressDetailsService } from '../order-dress-details';
import {
  OrderAccessoriesDetailDto,
  OrderAccessoriesDetailsService,
} from '../order-accessories-details';
import { ComplaintService, CUComplaintDto } from '@/app/complaint';
import { DressService } from '../dress';
import { WalletService } from '../wallet';

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
    private readonly dressService: DressService,
    private readonly walletService: WalletService,
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

    const [orders, count] = await this.orderRepository.findAndCount({
      where,
      order,
      take,
      skip,
      relations: ['customer', 'shop'],
    });

    return [plainToInstance(OrderDto, orders), count];
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

    const [orders, count] = await this.orderRepository.findAndCount({
      where,
      order,
      take,
      skip,
      relations: ['customer', 'shop'],
    });

    return [plainToInstance(OrderDto, orders), count];
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

    const [orders, count] = await this.orderRepository.findAndCount({
      where,
      order,
      take,
      skip,
      relations: ['customer', 'shop'],
    });

    return [plainToInstance(OrderDto, orders), count];
  }

  async getOrderById(id: string): Promise<OrderDto> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['customer', 'shop'],
    });
    if (!order) throw new NotFoundException('Không tìm thấy đơn hàng nào phù hợp');
    return plainToInstance(OrderDto, order);
  }

  async createOrderForSellAndRent(userId: string, body: CreateOrderRequestDto): Promise<Order> {
    //Kiểm tra logic, đảm bảo đầy đủ ràng buộc
    const user = await this.userService.getUserById(userId);
    if (!user) throw new NotFoundException('Người dùng này không tồn tại');

    if (!user.isIdentified) throw new ForbiddenException('Người dùng chưa định danh');

    const dress = await this.dressService.getDressForCustomer(body.dressDetails.dressId);

    const shop = await this.shopService.getShopByUserId(dress.id);
    if (!shop) throw new NotFoundException('Không tìm thấy cửa hàng');

    //xác định là luồng mua hay thuê dựa trên type
    if (body.newOrder.type === OrderType.SELL) {
      //Đây là luồng mua váy

      //tính tiền váy
      const dressPrice = Number(dress.sellPrice);

      //tính tiền phụ kiện
      let accessoriesPrice = 0;
      await Promise.all(
        body.accessoriesDetails.map(async (accessory) => {
          const item = await this.orderAccessoriesDetailsService.getAccessoryById(
            accessory.accessoryId,
          );
          accessoriesPrice += Number(item.sellPrice) * Number(accessory.quantity);
        }),
      );

      //tạo đơn hàng
      const order = {
        customer: { id: userId },
        shop: { id: shop.id },
        phone: body.newOrder.phone,
        email: body.newOrder.email,
        address: body.newOrder.address,
        dueDate: body.newOrder.dueDate,
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
    } else {
      //Đây là luồng thuê váy

      //tính tiền váy
      const dressPrice = Number(dress.rentalPrice);

      //tính tiền phụ kiện
      let accessoriesPrice = 0;
      await Promise.all(
        body.accessoriesDetails.map(async (accessory) => {
          const item = await this.orderAccessoriesDetailsService.getAccessoryById(
            accessory.accessoryId,
          );
          accessoriesPrice += Number(item.rentalPrice) * Number(accessory.quantity);
        }),
      );

      //tạo đơn hàng
      const order = {
        customer: { id: userId },
        shop: { id: shop.id },
        phone: body.newOrder.phone,
        email: body.newOrder.email,
        address: body.newOrder.address,
        dueDate: body.newOrder.dueDate,
        returnDate: body.newOrder.returnDate,
        amount: dressPrice + accessoriesPrice,
        type: OrderType.RENT,
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
  }

  async updateOrder(userId: string, id: string, updatedOrder: UOrderDto): Promise<Order> {
    const existingOrder = await this.getOrderById(id);

    if (existingOrder.status !== OrderStatus.PENDING)
      throw new BadRequestException('Đơn hàng đang trong quá trình thực hiện');

    if (!existingOrder) throw new NotFoundException('Không tìm thấy đơn hàng này');

    const user = await this.userService.getUserById(userId);
    if (!user) throw new NotFoundException('Người dùng này không tồn tại');

    existingOrder.phone = updatedOrder.phone;
    existingOrder.email = updatedOrder.email;
    existingOrder.address = updatedOrder.address;
    existingOrder.dueDate = updatedOrder.dueDate;
    existingOrder.returnDate = updatedOrder.returnDate;
    existingOrder.isBuyBack = updatedOrder.isBuyBack;

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

  async getOrderAccessoriesDetails(orderId: string): Promise<OrderAccessoriesDetailDto[]> {
    const orderAccessoriesDetails =
      await this.orderAccessoriesDetailsService.getOrderAccessoryDetails(orderId);
    return plainToInstance(OrderAccessoriesDetailDto, orderAccessoriesDetails);
  }

  async getOrderDressDetails(orderId: string): Promise<OrderDressDetailDto[]> {
    const orderAccessoriesDetails =
      await this.orderDressDetailsService.getOrderDressDetails(orderId);
    return plainToInstance(OrderDressDetailDto, orderAccessoriesDetails);
  }

  async getOrderAccessoryDetailById(
    orderId: string,
    accessoryId: string,
  ): Promise<OrderAccessoriesDetailDto> {
    const orderAccessoryDetails =
      await this.orderAccessoriesDetailsService.getOrderAccessoryDetails(orderId);
    if (!orderAccessoryDetails || orderAccessoryDetails.length === 0)
      throw new NotFoundException('Không tìm thấy phụ kiện trong đơn hàng');

    const orderAccessoryDetail = orderAccessoryDetails.find(
      (detail) => detail.accessoryId === accessoryId,
    );

    if (!orderAccessoryDetail)
      throw new NotFoundException('Không tìm thấy phụ kiện trong đơn hàng');

    return orderAccessoryDetail;
  }

  async getOrderDressDetailById(orderId: string, dressId: string): Promise<OrderDressDetailDto> {
    const orderDressDetails = await this.orderDressDetailsService.getOrderDressDetails(orderId);
    if (!orderDressDetails || orderDressDetails.length === 0)
      throw new NotFoundException('Không tìm thấy váy trong đơn hàng');

    const orderDressDetail = orderDressDetails.find((detail) => detail.dressId === dressId);

    if (!orderDressDetail) throw new NotFoundException('Không tìm thấy váy trong đơn hàng');

    return orderDressDetail;
  }

  async updateOrderStatusV2(id: string, status: OrderStatus): Promise<Order> {
    const existingOrder = await this.getOrderById(id);

    if (!existingOrder || existingOrder.status === OrderStatus.CANCELLED)
      throw new NotFoundException('Không tìm thấy đơn hàng này');

    existingOrder.status = status;

    return await this.orderRepository.save(plainToInstance(Order, existingOrder));
  }

  async checkOutOrder(userId: string, orderId: string): Promise<Order> {
    if (!this.userOwnOrder(userId, orderId))
      throw new ForbiddenException('Người dùng này không sở hữu đơn hàng này');

    const order = await this.getOrderByIdV2(orderId);
    if (!order || order.status !== OrderStatus.PENDING)
      throw new NotFoundException('Đơn hàng đã hết hạn hoặc không tồn tại');
    if (order.type === OrderType.SELL) {
      //Luồng mua cần thanh toán 100%, sau đó lock lại ở ví của shop
      if (!this.checkWalletBalanceIsEnough(userId, Number(order.amount)))
        throw new BadRequestException('Không đủ số dư trong ví, vui lòng nạp tiền');
      await this.walletService.transferFromWalletToWalletForSell(
        userId,
        order,
        Number(order.amount),
      );

      order.status = OrderStatus.IN_PROCESS;
      return await this.orderRepository.save(order);
    } else {
      //Luồng thuê thanh toán như luồng mua, sau đó chuyển số tiền thuê qua cho shop dạng lock, số còn lại lock
      const deposit = await this.calculateSellPriceForOrder(orderId);
      if (!this.checkWalletBalanceIsEnough(userId, deposit))
        throw new BadRequestException('Không đủ số dư trong ví, vui lòng nạp tiền');
      await this.walletService.transferFromWalletToWalletForRent(
        userId,
        order,
        Number(order.amount),
        deposit,
      );

      order.status = OrderStatus.IN_PROCESS;
      return await this.orderRepository.save(order);
    }
  }

  private async userOwnOrder(userId: string, orderId: string): Promise<boolean> {
    const order = await this.orderRepository.findOne({
      where: {
        id: orderId,
        customer: { id: userId },
      },
    });
    return !!order;
  }

  private async checkWalletBalanceIsEnough(userId: string, amount: number): Promise<boolean> {
    const wallet = await this.walletService.getWalletByUserId(userId);
    return Number(wallet.availableBalance) >= amount;
  }

  async getOrderByIdV2(id: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['customer', 'shop'],
    });
    if (!order) throw new NotFoundException('Không tìm thấy đơn hàng nào phù hợp');
    return order;
  }

  private async calculateSellPriceForOrder(orderId: string): Promise<number> {
    const orderDressDetail =
      await this.orderDressDetailsService.getOrderDressDetailByOrderId(orderId);
    if (!orderDressDetail)
      throw new NotFoundException('Không tìm thấy chi tiết váy cưới trong đơn hàng');
    const orderAccessoryDetails =
      await this.orderAccessoriesDetailsService.getOrderAccessoryDetailsByOrderId(orderId);
    if (!orderAccessoryDetails)
      throw new NotFoundException('Không tìm thấy chi tiết phụ kiện trong đơn hàng');
    const dressPrice = Number(orderDressDetail.price);
    let accessoriesPrice = 0;
    await Promise.all(
      orderAccessoryDetails.map(async (accessoryDetail) => {
        accessoriesPrice += accessoryDetail.price;
      }),
    );

    return dressPrice + accessoriesPrice;
  }
}
