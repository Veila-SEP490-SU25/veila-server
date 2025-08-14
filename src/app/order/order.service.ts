import { ShopService } from './../shop/shop.service';
import { Filtering, getOrder, getWhere, Sorting } from '@/common/decorators';
import {
  Complaint,
  Milestone,
  Order,
  OrderServiceDetail,
  OrderStatus,
  OrderType,
  RequestStatus,
} from '@/common/models';
import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  MethodNotAllowedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import {
  CreateOrderForCustom,
  CreateOrderRequestDto,
  OrderDto,
  ShopUpdateOrderForCustom,
  UOrderDto,
} from './order.dto';
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
import { RequestService } from '@/app/request';
import { ServiceService } from '@/app/service';
import { MilestoneService } from '@/app/milestone';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderServiceDetail)
    private readonly orderServiceDetailRepository: Repository<OrderServiceDetail>,
    private readonly userService: UserService,
    private readonly shopService: ShopService,
    private readonly orderDressDetailsService: OrderDressDetailsService,
    private readonly orderAccessoriesDetailsService: OrderAccessoriesDetailsService,
    @Inject(ComplaintService)
    private readonly complaintService: ComplaintService,
    private readonly dressService: DressService,
    private readonly walletService: WalletService,
    @Inject(RequestService)
    private readonly requestService: RequestService,
    @Inject(ServiceService)
    private readonly serviceService: ServiceService,
    @Inject(MilestoneService)
    private readonly milestoneService: MilestoneService,
  ) {}

  async getOrderMilestones(
    orderId: string,
    take: number,
    skip: number,
    sort?: Sorting,
    filter?: Filtering,
  ): Promise<[Milestone[], number]> {
    return await this.milestoneService.getOrderMilestones(orderId, take, skip, sort, filter);
  }

  async shopUpdateOrderForCustom(
    id: string,
    userId: string,
    body: ShopUpdateOrderForCustom,
  ): Promise<Order> {
    const order = await this.getCustomOrderForShop(id, userId);
    await this.orderRepository.update(order.id, {
      dueDate: body.dueDate,
      amount: body.price,
    });
    if (!order.orderServiceDetail)
      throw new InternalServerErrorException('Order service detail not found');
    await this.orderServiceDetailRepository.update(order.orderServiceDetail.id, {
      price: body.price,
    });
    for (let index = 0; index < body.milestones.length; index++) {
      await this.milestoneService.createMilestoneForOrderCustom(
        order.id,
        body.milestones[index],
        index + 1,
      );
    }
    return await this.getCustomOrderForShop(id, userId);
  }

  async getCustomOrderForShop(id: string, userId: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: {
        id,
        shop: { user: { id: userId } },
      },
      relations: {
        customer: true,
        shop: true,
        orderServiceDetail: {
          request: true,
          service: true,
          updateOrderServiceDetails: true,
        },
        milestones: { tasks: true },
      },
    });
    if (!order) throw new NotFoundException('Không tìm thấy đơn hàng này');
    return order;
  }

  async getOrderServiceDetail(orderId: string): Promise<OrderServiceDetail> {
    const orderServiceDetail = await this.orderServiceDetailRepository.findOne({
      where: {
        order: { id: orderId },
      },
      relations: {
        request: true,
        service: true,
        updateOrderServiceDetails: true,
      },
    });
    if (!orderServiceDetail) throw new NotFoundException('Không tìm thấy chi tiết đơn hàng');
    return orderServiceDetail;
  }

  async createOrderForCustom(
    userId: string,
    { requestId, shopId, ...body }: CreateOrderForCustom,
  ): Promise<Order> {
    const user = await this.userService.getSelf(userId);
    const request = await this.requestService.getRequestForOrderCustom(requestId);
    const shop = await this.shopService.getShopForOrderCustom(shopId);
    const service = await this.serviceService.getServiceForOrderCustom(shop.user.id);

    await this.requestService.updateStatusRequestForOrderCustom(request.id, RequestStatus.ACCEPTED);

    const newOrder = {
      customer: user,
      shop,
      ...body,
      dueDate: new Date(),
      type: OrderType.CUSTOM,
      status: OrderStatus.PENDING,
      orderServiceDetail: {
        request,
        service,
      },
    } as Order;

    return await this.orderRepository.save(newOrder);
  }

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
      shop: { user: { id: userId } },
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
      relations: {
        orderAccessoriesDetail: { accessory: true },
        orderDressDetail: { dress: true },
        orderServiceDetail: { service: true },
      },
    });
  }

  async updateOrderDressDetailForSeedingFeedback(orderDressDetailId: string): Promise<void> {
    await this.orderDressDetailsService.updateOrderDressDetailForSeedingFeedback(
      orderDressDetailId,
    );
  }

  async updateOrderServiceDetailForSeedingFeedback(orderServiceDetailId: string): Promise<void> {
    await this.orderServiceDetailRepository.update(orderServiceDetailId, { isRated: true });
  }

  async updateOrderAccessoryDetailForSeedingFeedback(
    orderAccessoryDetailId: string,
  ): Promise<void> {
    await this.orderAccessoriesDetailsService.updateOrderAccessoryDetailForSeedingFeedback(
      orderAccessoryDetailId,
    );
  }

  async createOrderForSeeding(order: Order): Promise<Order> {
    return await this.orderRepository.save(order);
  }

  async createOrderServiceDetailForSeeding(
    orderServiceDetail: OrderServiceDetail,
  ): Promise<OrderServiceDetail> {
    return await this.orderServiceDetailRepository.save(orderServiceDetail);
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
    const order = await this.orderRepository.findOne({
      where: { id: orderId, customer: { id: userId } },
      relations: {
        customer: true,
        shop: { user: true },
      },
    });
    if (!order) throw new NotFoundException('Không tìm thấy đơn hàng này');
    if (order.type === OrderType.SELL) {
      if (order.status !== OrderStatus.PENDING)
        throw new MethodNotAllowedException('Đơn hàng đã hết hạn');
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
    } else if (order.type === OrderType.RENT) {
      if (order.status !== OrderStatus.PENDING)
        throw new MethodNotAllowedException('Đơn hàng đã hết hạn');
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
    } else {
      if (order.status !== OrderStatus.PENDING)
        throw new MethodNotAllowedException('Đơn hàng đã đang và đã thực hiện hoặc đã bị hủy');
      //Luồng custom có thể thanh toán nhiều lần, lock lại ở ví của shop
      const transactions = await this.walletService.getTransferTransactionsForCustomOrder(
        userId,
        order.id,
      );
      const customerWallet = await this.walletService.getWalletForUser(userId);
      const amountPaid = transactions.reduce((total, transaction) => total + transaction.amount, 0);
      if (amountPaid === order.amount)
        throw new MethodNotAllowedException('Đơn hàng đã được thanh toán đủ');
      const remainingAmount = Number(order.amount) - Number(amountPaid);
      if (customerWallet.availableBalance < remainingAmount)
        throw new BadRequestException('Không đủ số dư trong ví, vui lòng nạp tiền');
      await this.walletService.transferFromWalletToWalletForCustom(userId, order, remainingAmount);

      if (order.status === OrderStatus.PENDING)
        await this.updateOrderCustomStatusAfterCheckout(order.id);
      const updatedOrder = await this.orderRepository.findOne({
        where: {
          id: order.id,
        },
        relations: {
          customer: true,
          shop: true,
          transaction: true,
        },
      });
      if (!updatedOrder) throw new NotFoundException('Không tìm thấy đơn hàng nào phù hợp');
      return updatedOrder;
    }
  }

  private async updateOrderCustomStatusAfterCheckout(orderId: string): Promise<void> {
    await this.orderRepository.update(orderId, { status: OrderStatus.IN_PROCESS });
    await this.milestoneService.updateMilestoneStatusForOrderCustomAfterCheckout(orderId);
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

  async createMilestoneForSeeding(data: Milestone): Promise<Milestone> {
    return await this.milestoneService.createMilestoneForSeeding(data);
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

  async cancelOrder(
    userId: string, 
    id: string,
  ):Promise<Order> {
    const existingOrder = await this.getOrderById(id);

    if (!existingOrder || existingOrder.status === OrderStatus.CANCELLED)
      throw new NotFoundException('Không tìm thấy đơn hàng này');

    if( existingOrder.status !== OrderStatus.PENDING)
      throw new MethodNotAllowedException('Đơn hàng không thể hủy ở trạng thái này')

    const user = await this.userService.getUserById(userId);
    if (!user) throw new NotFoundException('Người dùng này không tồn tại');

    existingOrder.status = OrderStatus.CANCELLED;

    return await this.orderRepository.save(plainToInstance(Order, existingOrder));
  }
}
