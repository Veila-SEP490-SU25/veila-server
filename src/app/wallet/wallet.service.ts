import { Filtering, getOrder, getWhere, Sorting } from '@/common/decorators';
import { Order, Transaction, TransactionType, Wallet } from '@/common/models';
import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DepositViaPayOSDto, DepositViaPayOSResponse, WalletDto } from './wallet.dto';
import { plainToInstance } from 'class-transformer';
import { UserService } from '../user';
import { WithdrawTransactionDto, TransactionService } from '../transaction';
import { PayosService } from '../payos/payos.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
    private readonly userService: UserService,
    @Inject(forwardRef(() => TransactionService))
    private readonly transactionService: TransactionService,
    private readonly payosService: PayosService,
    private readonly configService: ConfigService,
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

    wallet.availableBalance = Number(wallet.availableBalance);
    wallet.lockedBalance = Number(wallet.lockedBalance);
    return plainToInstance(WalletDto, wallet);
  }

  async createWallet(userId: string): Promise<Wallet> {
    const user = await this.userService.getUserById(userId);
    if (!user) throw new NotFoundException('Người dùng này không tồn tại');

    if (!user.isIdentified) throw new NotFoundException('Người dùng chưa định danh');

    const wallet = await this.getWalletByUserId(userId);
    if (!wallet) throw new NotFoundException('Mỗi người dùng chỉ được phép mở một ví điện tử');
    else {
      const wallet = {
        user: { id: userId },
        availableBalance: 0,
        lockedBalance: 0,
      } as Wallet;

      await this.walletRepository.save(wallet);
      return wallet;
    }
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
      returnUrl: depositWallet.returnUrl ?? this.configService.get<string>('PAYOS_RETURN_URL'),
      cancelUrl: depositWallet.cancelUrl ?? this.configService.get<string>('PAYOS_CANCEL_URL'),
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

    wallet.bin = withdrawWallet.bin;
    wallet.bankNumber = withdrawWallet.bankNumber;

    if (Number(wallet.availableBalance) < Number(withdrawWallet.amount))
      throw new BadRequestException(
        'Số dư khả dụng trong tài khoản không đủ để thực hiện rút tiền',
      );
    else {
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
    fromWallet.lockedBalance = Number(fromWallet.lockedBalance) + amount;
    toWallet.lockedBalance = Number(toWallet.lockedBalance) + deposit - amount;

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
}
