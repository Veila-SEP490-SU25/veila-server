import { ShopService } from './../shop/shop.service';
import { Filtering, getOrder, getWhere, Sorting } from '@/common/decorators';
import {
  Complaint,
  Milestone,
  MilestoneStatus,
  Order,
  OrderAccessoryDetail,
  OrderDressDetail,
  OrderServiceDetail,
  OrderStatus,
  OrderType,
  RequestStatus,
  UpdateOrderServiceDetail,
  UserRole,
} from '@/common/models';
import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  MethodNotAllowedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Transaction } from '@/common/models/wallet/transaction.model';
import {
  CreateOrderForCustom,
  CreateOrderRequestDto,
  OrderDto,
  OtpPaymentDto,
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
import { Cron, CronExpression } from '@nestjs/schedule';
import { RedisService } from '../redis';
import { PasswordService } from '../password';
import { TransactionService } from '../transaction';
import { AccessoryService } from '../accessory';
import { AppSettingService } from '@/app/appsetting';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderServiceDetail)
    private readonly orderServiceDetailRepository: Repository<OrderServiceDetail>,
    @InjectRepository(UpdateOrderServiceDetail)
    private readonly updateOrderServiceDetailRepository: Repository<UpdateOrderServiceDetail>,
    private readonly userService: UserService,
    @Inject(ShopService)
    private readonly shopService: ShopService,
    private readonly orderDressDetailsService: OrderDressDetailsService,
    private readonly orderAccessoriesDetailsService: OrderAccessoriesDetailsService,
    @Inject(ComplaintService)
    private readonly complaintService: ComplaintService,
    private readonly dressService: DressService,
    @Inject(forwardRef(() => WalletService))
    private readonly walletService: WalletService,
    @Inject(RequestService)
    private readonly requestService: RequestService,
    @Inject(ServiceService)
    private readonly serviceService: ServiceService,
    @Inject(MilestoneService)
    private readonly milestoneService: MilestoneService,
    @Inject(RedisService)
    private readonly redisService: RedisService,
    @Inject(PasswordService)
    private readonly passwordService: PasswordService,
    @Inject(TransactionService)
    private readonly transactionService: TransactionService,
    @Inject(AccessoryService)
    private readonly accessoryService: AccessoryService,
    @Inject(AppSettingService)
    private readonly appSettingService: AppSettingService,
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

  async getOrderTransactions(
    orderId: string,
    take: number,
    skip: number,
    sort?: Sorting,
    filter?: Filtering,
  ): Promise<[Transaction[], number]> {
    return await this.transactionService.getTransactionsByOrderId(
      orderId,
      take,
      skip,
      sort,
      filter,
    );
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

    const createdOrder = await this.orderRepository.save(newOrder);

    await this.milestoneService.createMilestone(createdOrder.id, OrderType.CUSTOM);

    return createdOrder;
  }

  async getOrders(
    userId: string,
    currentRole: UserRole,
    take: number,
    skip: number,
    sort?: Sorting,
    filter?: Filtering,
  ): Promise<[OrderDto[], number]> {
    if (currentRole === UserRole.CUSTOMER) {
      const dynamicFilter = getWhere(filter);
      const where = {
        ...dynamicFilter,
        customer: { id: userId },
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
    } else if (currentRole === UserRole.SHOP) {
      const dynamicFilter = getWhere(filter);
      const where = {
        ...dynamicFilter,
        shop: { user: { id: userId } },
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
    } else {
      const dynamicFilter = getWhere(filter);
      const where = {
        ...dynamicFilter,
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

    const dress = await this.dressService.getOne(body.dressDetails.dressId);

    const shop = dress.user.shop;
    if (!shop) throw new NotFoundException('Không tìm thấy cửa hàng');

    //xác định là luồng mua hay thuê dựa trên type
    if (body.newOrder.type === OrderType.SELL) {
      //Đây là luồng mua váy

      //tính tiền váy
      const dressPrice = Number(dress.sellPrice);

      //tính tiền phụ kiện
      const accessoriesPriceArray = await Promise.all(
        body.accessoriesDetails.map(async (accessory) => {
          const item = await this.orderAccessoriesDetailsService.getAccessoryById(
            accessory.accessoryId,
          );
          return Number(item.sellPrice) * Number(accessory.quantity);
        }),
      );
      const accessoriesPrice = accessoriesPriceArray.reduce((a, b) => a + b, 0);

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
      const createdOrder = await this.orderRepository.save(order);

      await this.orderDressDetailsService.saveOrderDressDetails(createdOrder.id, body.dressDetails);
      await this.orderAccessoriesDetailsService.saveOrderAccessoryDetails(
        createdOrder.id,
        body.accessoriesDetails,
      );
      await this.milestoneService.createMilestone(createdOrder.id, body.newOrder.type);

      return createdOrder;
    } else {
      //Đây là luồng thuê váy

      //tính tiền váy
      const dressPrice = Number(dress.rentalPrice);

      //tính tiền phụ kiện
      const accessoriesPriceArray = await Promise.all(
        body.accessoriesDetails.map(async (accessory) => {
          const item = await this.orderAccessoriesDetailsService.getAccessoryById(
            accessory.accessoryId,
          );
          return Number(item.rentalPrice) * Number(accessory.quantity);
        }),
      );
      const accessoriesPrice = accessoriesPriceArray.reduce((a, b) => a + b, 0);

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
      const createdOrder = await this.orderRepository.save(order);

      await this.orderDressDetailsService.saveOrderDressDetails(createdOrder.id, body.dressDetails);
      await this.orderAccessoriesDetailsService.saveOrderAccessoryDetails(
        createdOrder.id,
        body.accessoriesDetails,
      );

      await this.milestoneService.createMilestone(createdOrder.id, body.newOrder.type);
      createdOrder.deposit = await this.calculateDepositForRentOrder(createdOrder.id);
      await this.orderRepository.save(createdOrder);
      return createdOrder;
    }
  }

  async updateOrder(userId: string, id: string, updatedOrder: UOrderDto): Promise<Order> {
    const existingOrder = await this.orderRepository.findOne({
      where: {
        id,
        shop: { user: { id: userId } },
      },
    });
    if (!existingOrder) throw new NotFoundException('Không tìm thấy đơn hàng này');

    if (existingOrder.status !== OrderStatus.PENDING)
      throw new BadRequestException('Đơn hàng đang trong quá trình thực hiện');

    if (!existingOrder) throw new NotFoundException('Không tìm thấy đơn hàng này');

    const user = await this.userService.getUserById(userId);
    if (!user) throw new NotFoundException('Người dùng này không tồn tại');

    if (!this.validateOwnerOfOrder(userId, id))
      throw new ForbiddenException('Người dùng không sở hữu đơn hàng này');

    existingOrder.phone = updatedOrder.phone;
    existingOrder.email = updatedOrder.email;
    existingOrder.address = updatedOrder.address;
    existingOrder.dueDate = updatedOrder.dueDate;

    if (existingOrder.type === OrderType.CUSTOM) {
      existingOrder.amount = updatedOrder.price ?? 0;
      if (!existingOrder.orderServiceDetail)
        throw new InternalServerErrorException('Order service detail not found');
      await this.orderServiceDetailRepository.update(existingOrder.orderServiceDetail.id, {
        price: updatedOrder.price ?? 0,
      });
    } else if (existingOrder.type === OrderType.RENT)
      existingOrder.returnDate = updatedOrder.returnDate;

    return await this.orderRepository.save(plainToInstance(Order, existingOrder));
  }

  async updateOrderStatus(userId: string, id: string, status: OrderStatus): Promise<Order> {
    const existingOrder = await this.getOrderById(id);

    if (!existingOrder || existingOrder.status === OrderStatus.CANCELLED)
      throw new NotFoundException('Không tìm thấy đơn hàng này');

    const user = await this.userService.getUserById(userId);
    if (!user) throw new NotFoundException('Người dùng này không tồn tại');

    if (!this.validateOwnerOfOrder(userId, id))
      throw new ForbiddenException('Người dùng không sở hữu đơn hàng này');

    existingOrder.status = status;

    return await this.orderRepository.save(plainToInstance(Order, existingOrder));
  }

  async getOrdersForShop(
    shopId: string,
    take: number,
    skip: number,
    sort?: Sorting,
    filter?: Filtering,
  ): Promise<[OrderDto[], number]> {
    const dynamicFilter = getWhere(filter);
    const where = {
      ...dynamicFilter,
      shop: { id: shopId },
    };
    const order = getOrder(sort);
    const [items, total] = await this.orderRepository.findAndCount({
      where,
      order,
      take,
      skip,
    });
    return [items.map((item) => plainToInstance(OrderDto, item)), total];
  }

  async getOrderByShopId(shopId: string): Promise<Order[] | null> {
    const orders = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.shop', 'shop')
      .where('shop.id = :shopId', { shopId })
      .andWhere('order.status IN (:...statuses)', {
        statuses: [OrderStatus.PENDING, OrderStatus.IN_PROCESS],
      })
      .getMany();
    return orders;
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

  async checkOutOrder(userId: string, orderId: string, body: OtpPaymentDto): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId, customer: { id: userId } },
      relations: {
        customer: true,
        shop: { user: true },
      },
    });
    if (!order) throw new NotFoundException('Không tìm thấy đơn hàng này');
    if (order.status !== OrderStatus.PAYING)
      throw new MethodNotAllowedException(
        'Đơn hàng, chưa được xử lý, đang và đã thực hiện, hoặc đã bị hủy',
      );
    if (order.type === OrderType.SELL) {
      //Luồng mua cần thanh toán 100%, sau đó lock lại ở ví của shop
      if (!this.checkWalletBalanceIsEnough(userId, Number(order.amount)))
        throw new BadRequestException('Không đủ số dư trong ví, vui lòng nạp tiền');

      //Kiểm tra mã OTP
      const storedOtp = await this.redisService.get(`user:otp:${userId}`);
      if (!storedOtp) throw new ForbiddenException('Mã xác thực không hợp lệ hoặc đã hết hạn.');
      const isValidOtp = await this.passwordService.comparePassword(body.otp, storedOtp);
      if (!isValidOtp) {
        await this.redisService.del(`user:otp:${userId}`);
        throw new ForbiddenException('Mã xác thực không chính xác.');
      } else {
        await this.redisService.del(`user:otp:${userId}`);
      }

      await this.walletService.transferFromWalletToWalletForSell(
        userId,
        order,
        Number(order.amount),
      );

      order.status = OrderStatus.IN_PROCESS;
      await this.milestoneService.startFirstMilestoneAndTask(orderId);
      return await this.orderRepository.save(order);
    } else if (order.type === OrderType.RENT) {
      //Luồng thuê thanh toán như luồng mua, sau đó chuyển số tiền thuê qua cho shop dạng lock, số còn lại lock
      if (!order.deposit)
        throw new NotFoundException('Không tìm thấy giá trị tiền đặt cọc của đơn thuê');
      const deposit = order.deposit;
      if (!this.checkWalletBalanceIsEnough(userId, deposit))
        throw new BadRequestException('Không đủ số dư trong ví, vui lòng nạp tiền');

      //Kiểm tra mã OTP
      const storedOtp = await this.redisService.get(`user:otp:${userId}`);
      if (!storedOtp) throw new ForbiddenException('Mã xác thực không hợp lệ hoặc đã hết hạn.');
      const isValidOtp = await this.passwordService.comparePassword(body.otp, storedOtp);
      if (!isValidOtp) {
        await this.redisService.del(`user:otp:${userId}`);
        throw new ForbiddenException('Mã xác thực không chính xác.');
      } else {
        await this.redisService.del(`user:otp:${userId}`);
      }

      await this.walletService.transferFromWalletToWalletForRent(
        userId,
        order,
        Number(order.amount),
        deposit,
      );

      order.status = OrderStatus.IN_PROCESS;
      await this.milestoneService.startFirstMilestoneAndTask(orderId);
      return await this.orderRepository.save(order);
    } else {
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

      //Kiểm tra mã OTP
      const storedOtp = await this.redisService.get(`user:otp:${userId}`);
      if (!storedOtp) throw new ForbiddenException('Mã xác thực không hợp lệ hoặc đã hết hạn.');
      const isValidOtp = await this.passwordService.comparePassword(body.otp, storedOtp);
      if (!isValidOtp) {
        await this.redisService.del(`user:otp:${userId}`);
        throw new ForbiddenException('Mã xác thực không chính xác.');
      } else {
        await this.redisService.del(`user:otp:${userId}`);
      }

      await this.walletService.transferFromWalletToWalletForCustom(userId, order, remainingAmount);

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

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, { timeZone: 'Asia/Ho_Chi_Minh' })
  private async unlockBalanceAfterOrderCompleted(): Promise<void> {
    //tìm tất cả các đơn hàng đã hoàn thành
    const orders = await this.orderRepository.find({
      where: {
        status: OrderStatus.COMPLETED,
        type: In([OrderType.SELL, OrderType.RENT, OrderType.CUSTOM]),
      },
      relations: {
        customer: true,
        shop: { user: true },
      },
    });
    //Mở tiền bị lock trong ví
    await Promise.all(
      orders.map(async (order) => {
        if (order.type === OrderType.SELL) {
          await this.walletService.unlockBalanceForSell(order);
        } else if (order.type === OrderType.RENT) {
          await this.walletService.unlockBalanceForRent(order);
        } else if (order.type === OrderType.CUSTOM) {
          await this.walletService.unlockBalanceForCustom(order);
        }
      }),
    );
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, { timeZone: 'Asia/Ho_Chi_Minh' })
  async completeComplaintMilestone(): Promise<void> {
    //tìm tất cả các đơn hàng đã hoàn thành được 3 ngày
    const orders = await this.orderRepository.find({
      where: {
        status: OrderStatus.IN_PROCESS,
      },
    });
    // Xử lý các đơn hàng trong mốc khiếu nại được 3 ngày
    await Promise.all(
      orders.map(async (order) => {
        await this.milestoneService.completeComplaintMilestone(order.id, order.type);
      }),
    );
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

  async calculateDepositForRentOrder(orderId: string): Promise<number> {
    const orderDressDetail =
      await this.orderDressDetailsService.getOrderDressDetailByOrderId(orderId);
    if (!orderDressDetail)
      throw new NotFoundException('Không tìm thấy chi tiết váy cưới trong đơn hàng');
    const orderAccessoryDetails =
      await this.orderAccessoriesDetailsService.getOrderAccessoryDetailsByOrderId(orderId);
    if (!orderAccessoryDetails)
      throw new NotFoundException('Không tìm thấy chi tiết phụ kiện trong đơn hàng');
    const dress = await this.dressService.getDressById(orderDressDetail.id);
    const dressPrice = Number(dress.sellPrice);
    const accessoriesPriceArray = await Promise.all(
      orderAccessoryDetails.map(async (accessoryDetail) => {
        const item = await this.orderAccessoriesDetailsService.getAccessoryById(
          accessoryDetail.accessory.id,
        );
        return Number(item.sellPrice) * Number(accessoryDetail.quantity);
      }),
    );
    const accessoriesPrice = accessoriesPriceArray.reduce((a, b) => a + b, 0);

    return dressPrice + accessoriesPrice;
  }

  async cancelOrder(userId: string, id: string): Promise<Order> {
    const existingOrder = await this.orderRepository.findOne({
      where: { id, customer: { id: userId } },
      relations: {
        customer: true,
        shop: { user: true },
      },
    });
    if (!existingOrder) throw new NotFoundException('Không tìm thấy đơn hàng nào phù hợp');

    if (
      existingOrder.status === OrderStatus.CANCELLED ||
      existingOrder.status === OrderStatus.COMPLETED
    )
      throw new BadRequestException('Đơn hàng này đã kết thúc');

    const completedMilestones = await this.milestoneService.getCompletedMilestonesByOrderId(
      existingOrder.id,
    );

    const delayedMilestones = await this.milestoneService.getDelayedMilestonesByOrderId(
      existingOrder.id,
    );

    //xử lý tiền đơn hàng khi hủy đơn hàng đang được thực hiện (trước khi giao với mua thuê, trước khi hoàn tất với custom)
    //trường hợp nếu hủy đơn hàng vì lí do nhà cung cấp trễ tiến độ thì không bị phạt
    if (delayedMilestones) {
      if (existingOrder.status === OrderStatus.IN_PROCESS) {
        await this.walletService.refundForDelayed(existingOrder);
        existingOrder.status = OrderStatus.CANCELLED;
        await this.milestoneService.cancelOrder(existingOrder.id);

        const shop = existingOrder.shop;
        const delaySetting = await this.appSettingService.getDelayPenalty();
        shop.reputation = Number(shop.reputation) - delaySetting;
        await this.shopService.save(shop);
      }
    } else {
      //trường hợp còn lại sẽ bị phạt
      if (existingOrder.status === OrderStatus.IN_PROCESS) {
        if (existingOrder.type === OrderType.SELL || existingOrder.type === OrderType.RENT) {
          //xử lý luồng sell, rent
          if (completedMilestones.length > 2)
            throw new BadRequestException('Không được hủy đơn hàng ở trạng thái đang giao');
          await this.walletService.refundForSellAndRent(existingOrder);
        } else if (existingOrder.type === OrderType.CUSTOM) {
          if (completedMilestones.length > 4)
            throw new BadRequestException('Không được hủy đơn hàng ở trạng thái đang giao');
          //xử lý luồng custom
          const customMilestone = await this.milestoneService.getMilestonesByOrderId(
            existingOrder.id,
          );
          await this.walletService.refundForCustom(existingOrder, customMilestone);
        }
      } else if (existingOrder.type === OrderType.CUSTOM) {
        const orderServiceDetail = await this.orderServiceDetailRepository.findOne({
          where: {
            order: existingOrder,
          },
          relations: {
            request: true,
          },
        });
        if (!orderServiceDetail)
          throw new NotFoundException('Không tìm thấy chi tiết dịch vụ đơn hàng');
        const updateRequest = await this.requestService.getUpdateRequestsByRequestId(
          orderServiceDetail.request.id,
        );
        if (updateRequest.length > 0) {
          const customMilestone = await this.milestoneService.getMilestonesByOrderId(
            existingOrder.id,
          );
          await this.walletService.refundForCustom(existingOrder, customMilestone);
        }
      }
      existingOrder.status = OrderStatus.CANCELLED;
      await this.milestoneService.cancelOrder(existingOrder.id);
    }
    return await this.orderRepository.save(plainToInstance(Order, existingOrder));
  }

  private async validateOwnerOfOrder(userId: string, orderId: string): Promise<void> {
    const shop = await this.shopService.getShopByUserId(userId);
    if (!shop) throw new NotFoundException('Người dùng này chưa có cửa hàng nào');

    const orders = await this.getOrderByShopId(shop.id);
    if (!orders || orders.length === 0) {
      throw new NotFoundException(
        'Không tìm thấy đơn hàng đang chờ hoặc đang thực hiện của người dùng này',
      );
    }

    const matchedOrder = orders.find((order) => order.id === orderId);
    if (!matchedOrder) throw new NotFoundException('Đơn hàng không tồn tại');
  }

  async getOrderByRequestId(requestId: string): Promise<Order> {
    const orderServiceDetail = await this.orderServiceDetailRepository.findOne({
      where: {
        request: { id: requestId },
      },
      relations: {
        order: { milestones: true },
      },
    });
    if (!orderServiceDetail) throw new NotFoundException('Không tìm thấy chi tiết đơn hàng');
    return orderServiceDetail.order;
  }

  async getOrderServiceDetailByRequestId(requestId: string): Promise<OrderServiceDetail> {
    const orderServiceDetail = await this.orderServiceDetailRepository.findOne({
      where: {
        request: { id: requestId },
      },
      relations: {
        order: { shop: { user: true } },
      },
    });
    if (!orderServiceDetail)
      throw new NotFoundException('Không tìm thấy chi tiết dịch vụ đơn hàng');
    return orderServiceDetail;
  }

  async updateOrderStatusForUpdateRequest(id: string, status: OrderStatus): Promise<void> {
    await this.orderRepository.update(id, { status });
    if (status === OrderStatus.PENDING)
      await this.milestoneService.updateMilestoneStatusForUpdateRequest(
        id,
        MilestoneStatus.PENDING,
      );
    else if (status === OrderStatus.IN_PROCESS)
      await this.milestoneService.updateMilestoneStatusForUpdateRequest(
        id,
        MilestoneStatus.IN_PROGRESS,
      );
  }

  async createUpdateOrderServiceDetail(body: UpdateOrderServiceDetail): Promise<void> {
    await this.updateOrderServiceDetailRepository.save(body);
  }

  async updateOrderAmount(id: string, amount: number): Promise<void> {
    await this.orderRepository.update(id, { amount });
  }

  async createOrderAccessoryDetailForSeeding(
    orderAccessoryDetail: OrderAccessoryDetail,
  ): Promise<OrderAccessoryDetail> {
    return await this.orderAccessoriesDetailsService.createOrderAccessoryDetailForSeeding(
      orderAccessoryDetail,
    );
  }

  async createOrderDressDetailForSeeding(
    orderDressDetail: OrderDressDetail,
  ): Promise<OrderDressDetail> {
    return await this.orderDressDetailsService.createOrderDressDetailForSeeding(orderDressDetail);
  }
}
