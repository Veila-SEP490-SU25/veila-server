import { Filtering, getOrder, getWhere, Sorting } from '@/common/decorators';
import { Order, Transaction, TransactionType, Wallet } from '@/common/models';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  DepositViaPayOSDto,
  DepositViaPayOSResponse,
  PINWalletDto,
  UpdateBankDto,
  WalletDto,
} from './wallet.dto';
import { plainToInstance } from 'class-transformer';
import { UserService } from '../user';
import { WithdrawTransactionDto, TransactionService } from '../transaction';
import { PayosService } from '../payos/payos.service';
import { ShopService } from '../shop';
import { OrderService } from '../order';
import { PasswordService } from '../password';
import { RedisService } from '../redis';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
    private readonly userService: UserService,
    @Inject(forwardRef(() => TransactionService))
    private readonly transactionService: TransactionService,
    private readonly payosService: PayosService,
    private readonly shopService: ShopService,
    @Inject(forwardRef(() => OrderService))
    private readonly orderService: OrderService,
    @Inject(forwardRef(() => PasswordService))
    private readonly passwordService: PasswordService,
    @Inject(forwardRef(() => RedisService))
    private readonly redisService: RedisService,
  ) {}

  async getWalletsForAdmin(
    take: number,
    skip: number,
    sort?: Sorting,
    filter?: Filtering,
  ): Promise<[WalletDto[], number]> {
    const dynamicFilter = getWhere(filter);
    const where = {
      ...dynamicFilter,
    };
    const order = getOrder(sort);

    const [wallets, count] = await this.walletRepository.findAndCount({
      where,
      order,
      take,
      skip,
      relations: ['user'],
    });
    //ép kiểu số
    for (const wallet of wallets) {
      wallet.availableBalance = Number(wallet.availableBalance);
      wallet.lockedBalance = Number(wallet.lockedBalance);
    }
    return [plainToInstance(WalletDto, wallets), count];
  }

  async getWalletByUserId(userId: string): Promise<WalletDto> {
    const wallet = await this.walletRepository.findOne({
      where: {
        user: { id: userId },
      },
      relations: ['user'],
    });
    if (!wallet) throw new NotFoundException('Không tìm thấy ví điện tử của người dùng này');

    //ép kiểu số
    wallet.availableBalance = Number(wallet.availableBalance);
    wallet.lockedBalance = Number(wallet.lockedBalance);
    return plainToInstance(WalletDto, wallet);
  }

  async getWalletByUserIdV2(userId: string): Promise<Wallet> {
    const wallet = await this.walletRepository.findOne({
      where: {
        user: { id: userId },
      },
      relations: ['user'],
    });
    if (!wallet) throw new NotFoundException('Không tìm thấy ví điện tử của người dùng này');

    //ép kiểu số
    wallet.availableBalance = Number(wallet.availableBalance);
    wallet.lockedBalance = Number(wallet.lockedBalance);
    return wallet;
  }

  async depositWallet(
    userId: string,
    depositWallet: DepositViaPayOSDto,
  ): Promise<DepositViaPayOSResponse> {
    const user = await this.userService.getUserById(userId);
    if (!user) throw new NotFoundException('Người dùng không tồn tại');

    if (!user.isIdentified) throw new ForbiddenException('Người dùng chưa định danh');

    const wallet = await this.findOneByUserId(userId);
    if (!wallet) throw new NotFoundException('Người dùng này chưa sở hữu ví điện tử');

    //Tạo orderCode (payOS yêu cầu số và unique)
    const now = Date.now().toString();
    const tail10 = Number(now.slice(-10));
    const random2 = Math.floor(Math.random() * 90) + 10;
    const orderCode = Number(`${tail10}${random2}`);

    depositWallet.note = orderCode.toString();

    //Lưu giao dịch ở trạng thái Pending, chưa cộng tiền
    const pendingTransactionId = await this.transactionService.saveDepositTransaction(
      user,
      wallet.id,
      depositWallet,
    );

    //Tạo request Payos
    const request = this.payosService.buildCheckoutRequest({
      orderCode,
      amount: depositWallet.amount,
      description: 'Nạp tiền',
      buyerName: user.firstName + ' ' + user.middleName + ' ' + user.lastName,
      expiredAt: Math.floor(Date.now() / 1000) + 15 * 60,
    });

    //Tạo link thanh toán
    const paymentLink = await this.payosService.createPaymentLink(request);

    const response = new DepositViaPayOSResponse();
    response.transactionId = pendingTransactionId;
    response.orderCode = orderCode;
    response.checkoutUrl = paymentLink.checkoutUrl;
    response.qrCode = paymentLink.qrCode;
    response.expiredAt = paymentLink.expiredAt ?? 0;

    return response;
  }

  async withdrawWalletRequest(
    userId: string,
    withdrawWallet: WithdrawTransactionDto,
  ): Promise<string> {
    const user = await this.userService.getUserById(userId);
    if (!user) throw new NotFoundException('Người dùng không tồn tại');

    if (!user.isIdentified) throw new ForbiddenException('Người dùng chưa định danh');

    const wallet = await this.findOneByUserId(userId);
    if (!wallet) throw new NotFoundException('Người dùng này chưa sở hữu ví điện tử');

    if (wallet.bin === null || wallet.bankNumber === null)
      throw new BadRequestException('Vui lòng cập nhật số tài khoản ngân hàng thụ hưởng');

    if (Number(wallet.availableBalance) < Number(withdrawWallet.amount))
      throw new BadRequestException(
        'Số dư khả dụng trong tài khoản không đủ để thực hiện rút tiền',
      );
    else {
      //Kiểm tra mã OTP
      const storedOtp = await this.redisService.get(`user:otp:${userId}`);
      if (!storedOtp) throw new ForbiddenException('Mã xác thực không hợp lệ hoặc đã hết hạn.');
      const isValidOtp = await this.passwordService.comparePassword(withdrawWallet.otp, storedOtp);
      if (!isValidOtp) {
        await this.redisService.del(`user:otp:${userId}`);
        throw new ForbiddenException('Mã xác thực không chính xác.');
      } else {
        await this.redisService.del(`user:otp:${userId}`);
      }

      wallet.availableBalance = Number(wallet.availableBalance) - withdrawWallet.amount;
      wallet.lockedBalance = Number(wallet.lockedBalance) + withdrawWallet.amount;
      await this.transactionService.saveWithdrawTransaction(user, wallet.id, withdrawWallet);
    }

    await this.walletRepository.save(wallet);
    return 'Yêu cầu rút tiền của bạn đã được tạo, xin vui lòng chờ hệ thống của chúng tôi xác nhận';
  }

  async transferFromWalletToWalletForSell(
    userId: string,
    order: Order,
    amount: number,
  ): Promise<void> {
    if (amount <= 0) {
      throw new BadRequestException('Số tiền phải lớn hơn 0');
    }
    const fromWallet = await this.getWalletByUserId(userId);
    if (!fromWallet) throw new NotFoundException('Không tìm thấy ví hợp lệ');
    const toWallet = await this.getWalletByUserId(order.shop.user.id);
    if (!toWallet) throw new NotFoundException('Không tìm thấy ví hợp lệ');

    const fromUser = await this.userService.getUserById(userId);
    if (!fromUser) throw new NotFoundException('Không tìm thấy người dùng');
    const toUser = await this.userService.getUserById(order.shop.user.id);
    if (!toUser) throw new NotFoundException('Không tìm thấy người dùng');

    fromWallet.availableBalance = Number(fromWallet.availableBalance) - amount;
    toWallet.lockedBalance = Number(toWallet.lockedBalance) + amount;

    await this.walletRepository.save(fromWallet);
    await this.walletRepository.save(toWallet);

    await this.transactionService.saveTransferTransaction(
      fromUser,
      toUser,
      fromWallet.id,
      order.id,
      amount,
      TransactionType.TRANSFER,
    );
    await this.transactionService.saveTransferTransaction(
      fromUser,
      toUser,
      toWallet.id,
      order.id,
      amount,
      TransactionType.RECEIVE,
    );
  }

  async transferFromWalletToWalletForRent(
    userId: string,
    order: Order,
    amount: number,
    deposit: number,
  ): Promise<void> {
    if (amount <= 0) {
      throw new BadRequestException('Số tiền phải lớn hơn 0');
    }
    const fromWallet = await this.getWalletByUserId(userId);
    if (!fromWallet) throw new NotFoundException('Không tìm thấy ví hợp lệ');
    const toWallet = await this.getWalletByUserId(order.shop.user.id);
    if (!toWallet) throw new NotFoundException('Không tìm thấy ví hợp lệ');

    const fromUser = await this.userService.getUserById(userId);
    if (!fromUser) throw new NotFoundException('Không tìm thấy người dùng');
    const toUser = await this.userService.getUserById(order.shop.user.id);
    if (!toUser) throw new NotFoundException('Không tìm thấy người dùng');

    fromWallet.availableBalance = Number(fromWallet.availableBalance) - deposit;
    fromWallet.lockedBalance = Number(fromWallet.lockedBalance) + (deposit - amount);
    toWallet.lockedBalance = Number(toWallet.lockedBalance) + amount;

    await this.walletRepository.save(fromWallet);
    await this.walletRepository.save(toWallet);

    await this.transactionService.saveTransferTransaction(
      fromUser,
      toUser,
      fromWallet.id,
      order.id,
      amount,
      TransactionType.TRANSFER,
    );

    await this.transactionService.saveTransferTransaction(
      fromUser,
      toUser,
      toWallet.id,
      order.id,
      amount,
      TransactionType.RECEIVE,
    );

    await this.transactionService.saveTransferTransaction(
      fromUser,
      fromUser,
      toWallet.id,
      order.id,
      deposit - amount,
      TransactionType.TRANSFER,
    );
  }

  //Function for seeding data
  async getAllForSeeding(): Promise<Wallet[]> {
    return this.walletRepository.find({ withDeleted: true });
  }

  async findOneByUserId(userId: string): Promise<Wallet | null> {
    return this.walletRepository.findOne({
      where: { user: { id: userId } },
      withDeleted: true,
    });
  }

  async create(wallet: Wallet): Promise<void> {
    await this.walletRepository.save(wallet);
  }

  async createWalletForUser(userId: string): Promise<Wallet> {
    const wallet = {
      user: { id: userId },
      availableBalance: 0,
      lockedBalance: 0,
    };
    return await this.walletRepository.save(wallet);
  }

  async getTransferTransactionsForCustomOrder(
    userId: string,
    orderId: string,
  ): Promise<Transaction[]> {
    return await this.transactionService.getTransferTransactionsForCustomOrder(userId, orderId);
  }

  async transferFromWalletToWalletForCustom(
    userId: string,
    order: Order,
    amount: number,
  ): Promise<void> {
    const fromWallet = await this.getWalletForUser(userId);
    const toWallet = await this.getWalletForUser(order.shop.user.id);

    const fromUser = order.customer;
    const toUser = order.shop.user;
    await this.transactionService.saveTransferOrderTransaction(
      fromUser,
      toUser,
      fromWallet.id,
      order.id,
      amount,
      TransactionType.TRANSFER,
    );

    await this.transactionService.saveTransferOrderTransaction(
      fromUser,
      toUser,
      toWallet.id,
      order.id,
      amount,
      TransactionType.RECEIVE,
    );

    fromWallet.availableBalance = Number(fromWallet.availableBalance) - Number(amount);
    toWallet.lockedBalance = Number(toWallet.lockedBalance) + Number(amount);
    await this.walletRepository.save(fromWallet);
    await this.walletRepository.save(toWallet);
  }

  async getWalletForUser(userId: string): Promise<Wallet> {
    const wallet = await this.walletRepository.findOne({
      where: { user: { id: userId } },
    });
    if (!wallet) throw new NotFoundException('Không tìm thấy ví');
    return wallet;
  }

  async getWalletById(id: string): Promise<Wallet> {
    const wallet = await this.walletRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!wallet) throw new NotFoundException('Không tìm thấy ví điện tử');
    return wallet;
  }

  async saveWalletBalance(wallet: Wallet, amount: number): Promise<void> {
    await this.walletRepository
      .createQueryBuilder()
      .update(Wallet)
      .set({ availableBalance: () => `available_balance + ${amount}` })
      .where('id = :id', { id: wallet.id })
      .execute();
  }

  async saveWalletBalanceV2(wallet: Wallet, amount: number): Promise<void> {
    await this.walletRepository
      .createQueryBuilder()
      .update(Wallet)
      .set({ lockedBalance: () => `locked_balance - ${amount}` })
      .where('id = :id', { id: wallet.id })
      .execute();
  }

  async saveWalletBalanceV3(wallet: Wallet, amount: number): Promise<void> {
    await this.walletRepository
      .createQueryBuilder()
      .update(Wallet)
      .set({
        lockedBalance: () => `locked_balance - ${amount}`,
        availableBalance: () => `available_balance + ${amount}`,
      })
      .where('id = :id', { id: wallet.id })
      .execute();
  }

  async saveWalletBalanceV4(wallet: Wallet, amount: number): Promise<void> {
    await this.walletRepository
      .createQueryBuilder()
      .update(Wallet)
      .set({ availableBalance: () => `available_balance - ${amount}` })
      .where('id = :id', { id: wallet.id })
      .execute();
  }

  async updateBankInformation(userId: string, body: UpdateBankDto): Promise<Wallet> {
    const existingWallet = await this.walletRepository.findOne({
      where: {
        user: { id: userId },
      },
      relations: ['user'],
    });

    if (!existingWallet) throw new NotFoundException('Không tìm thấy ví điện tử');

    existingWallet.bin = body.bin;
    existingWallet.bankNumber = body.bankNumber;

    return await this.walletRepository.save(existingWallet);
  }

  async unlockBalanceForSell(order: Order): Promise<void> {
    const transaction = await this.transactionService.getTransactionByOrderId(order.id);
    const toShop = await this.shopService.getShopById(order.shop.id);
    const shopWallet = await this.getWalletByUserIdV2(toShop.user.id);

    if (!shopWallet) throw new NotFoundException('Không tìm thấy ví điện tử của người nhận');

    shopWallet.lockedBalance = Number(shopWallet.lockedBalance) - Number(transaction.amount);
    shopWallet.availableBalance = Number(shopWallet.availableBalance) + Number(transaction.amount);

    await this.walletRepository.save(shopWallet);
  }

  async unlockBalanceForRent(order: Order): Promise<void> {
    const transaction = await this.transactionService.getTransactionByOrderId(order.id);
    const cusWallet = await this.getWalletById(transaction.wallet.id);
    const toShop = await this.shopService.getShopById(order.shop.id);
    const shopWallet = await this.getWalletByUserIdV2(toShop.user.id);
    const deposit = await this.orderService.calculateSellPriceForOrder(order.id);

    if (!shopWallet) throw new NotFoundException('Không tìm thấy ví điện tử của người nhận');

    cusWallet.lockedBalance =
      Number(cusWallet.lockedBalance) + (deposit - Number(transaction.amount));
    cusWallet.availableBalance =
      Number(cusWallet.availableBalance) + (deposit - Number(transaction.amount));

    shopWallet.lockedBalance = Number(shopWallet.lockedBalance) - Number(transaction.amount);
    shopWallet.availableBalance = Number(shopWallet.availableBalance) + Number(transaction.amount);

    await this.walletRepository.save(cusWallet);
    await this.walletRepository.save(shopWallet);
  }

  // async unlockBalanceForCustom(order: Order):Promise<void> {

  // }

  async refundForSellAndRent(order: Order): Promise<void> {
    const transaction = await this.transactionService.getTransactionByOrderId(order.id);
    const cusWallet = await this.getWalletById(transaction.wallet.id);
    const toShop = await this.shopService.getShopById(order.shop.id);
    const shopWallet = await this.getWalletByUserIdV2(toShop.user.id);

    if (!shopWallet) throw new NotFoundException('Không tìm thấy ví điện tử của người nhận');

    shopWallet.lockedBalance = Number(shopWallet.lockedBalance) - Number(transaction.amount);
    shopWallet.availableBalance =
      Number(shopWallet.availableBalance) + (Number(transaction.amount) * 5) / 100;

    cusWallet.availableBalance =
      Number(cusWallet.availableBalance) + (Number(transaction.amount) * 95) / 100;

    await this.walletRepository.save(cusWallet);
    await this.walletRepository.save(shopWallet);

    await this.transactionService.saveRefundTransaction(
      shopWallet.user,
      cusWallet.user,
      shopWallet.id,
      order.id,
      Number(transaction.amount),
    );
  }

  // async refundForCustom(
  //   order: Order,
  //   number: Number,
  // ):Promise<void> {

  // }

  async updatePIN(userId: string, body: PINWalletDto): Promise<Wallet> {
    const user = await this.userService.getUserById(userId);
    if (!user) throw new NotFoundException('Không tìm thấy người dùng');

    const wallet = await this.getWalletByUserIdV2(userId);
    const hashedPin = await this.passwordService.hashPassword(body.pin);
    wallet.pin = hashedPin;

    return await this.walletRepository.save(wallet);
  }

  async requestOtpPayment(userId: string, body: PINWalletDto): Promise<string> {
    const user = await this.userService.getUserById(userId);
    if (!user) throw new NotFoundException('Không tìm thấy người dùng');

    const wallet = await this.getWalletByUserIdV2(userId);
    if (!wallet.pin)
      throw new NotFoundException('Ví điện tử này chưa có mã PIN, vui lòng cập nhật');

    const isPinValid = await this.passwordService.comparePassword(body.pin, wallet.pin);
    if (!isPinValid)
      throw new ConflictException('Mã Pin ví điện tử không chính xác, vui lòng thử lại');

    const otp = this.passwordService.generateOTP(6);
    const hashedOtp = await this.passwordService.hashPassword(otp);
    await this.redisService.set(`user:otp:${user.id}`, hashedOtp, 5 * 60 * 1000);

    return otp;
  }
}
