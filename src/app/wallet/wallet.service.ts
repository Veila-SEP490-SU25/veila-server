import { Filtering, getOrder, getWhere, Sorting } from '@/common/decorators';
import { Wallet } from '@/common/models';
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
import { WalletDto } from './wallet.dto';
import { plainToInstance } from 'class-transformer';
import { UserService } from '../user';
import { DepositAndWithdrawTransactionDto, TransactionService } from '../transaction';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
    private readonly userService: UserService,
    @Inject(forwardRef(() => TransactionService))
    private readonly transactionService: TransactionService,
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

    const wallets = await this.walletRepository.find({
      where,
      order,
      take,
      skip,
      relations: ['user'],
    });

    return [plainToInstance(WalletDto, wallets), wallets.length];
  }

  async getWalletByUserId(userId: string): Promise<WalletDto> {
    const wallet = await this.walletRepository.findOne({
      where: {
        user: { id: userId },
      },
      relations: ['user'],
    });
    if (!wallet) throw new NotFoundException('Không tìm thấy ví điện tử của người dùng này');
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

  async depositWallet(userId: string, depositWallet: DepositAndWithdrawTransactionDto): Promise<Wallet> {
    const user = await this.userService.getUserById(userId);
    if (!user) throw new NotFoundException('Người dùng không tồn tại');

    if (!user.isIdentified) throw new ForbiddenException('Người dùng chưa định danh');

    const wallet = await this.findOneByUserId(userId);
    if (!wallet) throw new NotFoundException('Người dùng này chưa sở hữu ví điện tử');

    await this.transactionService.saveDepositTransaction(user, wallet.id, depositWallet);
    wallet.availableBalance = wallet.availableBalance + depositWallet.amount;

    await this.walletRepository.save(wallet);
    return wallet;
  }

  async withdrawWalletRequest(userId: string, withdrawWallet: DepositAndWithdrawTransactionDto): Promise<string> {
    const user = await this.userService.getUserById(userId);
    if (!user) throw new NotFoundException('Người dùng không tồn tại');

    if (!user.isIdentified) throw new ForbiddenException('Người dùng chưa định danh');

    const wallet = await this.findOneByUserId(userId);
    if (!wallet) throw new NotFoundException('Người dùng này chưa sở hữu ví điện tử');

    if (wallet.availableBalance < withdrawWallet.amount)
      throw new BadRequestException(
        'Số dư khả dụng trong tài khoản không đủ để thực hiện rút tiền',
      );
    else await this.transactionService.saveWithdrawTransaction(user, wallet.id, withdrawWallet);

    return 'Yêu cầu rút tiền của bạn đã được tạo, xin vui lòng chờ hệ thống của chúng tôi xác nhận';
  }

  //Function for seeding data
  async findAll(): Promise<Wallet[]> {
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
}
