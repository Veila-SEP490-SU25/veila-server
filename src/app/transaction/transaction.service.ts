import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CUTransactionDto,
  DepositAndWithdrawTransactionDto,
  TransactionDto,
} from './transaction.dto';
import {
  TransactionStatus,
  Transaction,
  User,
  TypeBalance,
  TransactionType,
} from '@/common/models';
import { plainToInstance } from 'class-transformer';
import { Filtering, getOrder, getWhere, Sorting } from '@/common/decorators';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    // @Inject(forwardRef(() => WalletService))
    // private readonly walletService: WalletService,
  ) {}

  async saveDepositTransaction(
    user: User,
    walletId: string,
    transactionDetail: DepositAndWithdrawTransactionDto,
  ): Promise<void> {
    const newTransaction = {
      walletId,
      from: user.firstName + ' ' + user.middleName + ' ' + user.lastName,
      to: user.firstName + ' ' + user.middleName + ' ' + user.lastName + ' Wallet',
      fromTypeBalance: TypeBalance.AVAILABLE,
      toTypeBalance: TypeBalance.AVAILABLE,
      amount: transactionDetail.amount,
      type: TransactionType.DEPOSIT,
      status: TransactionStatus.PENDING,
      note: transactionDetail.note,
    };
    await this.transactionRepository.save(plainToInstance(Transaction, newTransaction));
  }

  async saveWithdrawTransaction(
    user: User,
    walletId: string,
    transactionDetail: DepositAndWithdrawTransactionDto,
  ): Promise<void> {
    const newTransaction = {
      walletId,
      from: user.firstName + ' ' + user.middleName + ' ' + user.lastName + ' Wallet',
      to: user.firstName + ' ' + user.middleName + ' ' + user.lastName,
      fromTypeBalance: TypeBalance.AVAILABLE,
      toTypeBalance: TypeBalance.AVAILABLE,
      amount: transactionDetail.amount,
      type: TransactionType.WITHDRAW,
      status: TransactionStatus.PENDING,
      note: transactionDetail.note,
    };
    await this.transactionRepository.save(plainToInstance(Transaction, newTransaction));
  }

  async saveTransferTransaction(
    fromUser: User,
    toUser: User,
    walletId: string,
    amount: number,
    type: TransactionType,
  ): Promise<void> {
    const fromUserName = fromUser.firstName + ' ' + fromUser.middleName + ' ' + fromUser.lastName;
    const toUserName = toUser.firstName + ' ' + toUser.middleName + ' ' + toUser.lastName;

    const newTransaction = {
      walletId,
      from: fromUserName + ' Wallet',
      to: toUserName + ' Wallet',
      fromTypeBalance: TypeBalance.AVAILABLE,
      toTypeBalance: TypeBalance.LOCKED,
      amount: amount,
      type: type,
      status: TransactionStatus.COMPLETED,
      note: fromUserName + ' transfer to ' + toUserName,
    };
    await this.transactionRepository.save(plainToInstance(Transaction, newTransaction));
  }

  async updateTransaction(id: string, transactionDetail: CUTransactionDto): Promise<void> {
    const existingTransaction = await this.transactionRepository.findOneBy({ id });
    if (!existingTransaction) throw new NotFoundException('Không tìm thấy giao dịch phù hợp');

    existingTransaction.wallet.id = transactionDetail.walletId;
    if (existingTransaction.order) existingTransaction.order.id = transactionDetail.orderId;
    if (existingTransaction.membership)
      existingTransaction.membership.id = transactionDetail.membershipId;
    existingTransaction.from = transactionDetail.from;
    existingTransaction.to = transactionDetail.to;
    existingTransaction.fromTypeBalance = transactionDetail.fromTypeBalance;
    existingTransaction.toTypeBalance = transactionDetail.toTypeBalance;
    existingTransaction.amount = transactionDetail.amount;
    existingTransaction.type = transactionDetail.type;
    existingTransaction.status = transactionDetail.status;
    existingTransaction.note = transactionDetail.note;

    await this.transactionRepository.save(existingTransaction);
  }

  async updateTransactionStatus(id: string, status: TransactionStatus): Promise<Transaction> {
    const existingTransaction = await this.getTransactionById(id);

    if (
      !existingTransaction ||
      existingTransaction.status === TransactionStatus.CANCELLED ||
      existingTransaction.status === TransactionStatus.COMPLETED
    )
      throw new NotFoundException('Không tìm thấy giao dịch phù hợp');

    existingTransaction.status = status;

    return await this.transactionRepository.save(plainToInstance(Transaction, existingTransaction));
  }

  async getTransactionsForAdmin(
    take: number,
    skip: number,
    sort?: Sorting,
    filter?: Filtering,
  ): Promise<[TransactionDto[], number]> {
    const dynamicFilter = getWhere(filter);
    const where = {
      ...dynamicFilter,
    };
    const order = getOrder(sort);

    const transactions = await this.transactionRepository.find({
      where,
      order,
      take,
      skip,
      relations: ['wallet', 'order', 'membership'],
    });
    return [plainToInstance(TransactionDto, transactions), transactions.length];
  }

  async getTransactionsForUser(
    walletId: string,
    take: number,
    skip: number,
    sort?: Sorting,
    filter?: Filtering,
  ): Promise<[TransactionDto[], number]> {
    const dynamicFilter = getWhere(filter);
    const where = {
      ...dynamicFilter,
      wallet: { id: walletId },
    };
    const order = getOrder(sort);
    const transactions = await this.transactionRepository.find({
      where,
      order,
      take,
      skip,
      relations: ['wallet', 'order', 'membership'],
    });

    return [plainToInstance(TransactionDto, transactions), transactions.length];
  }

  async getTransactionById(id: string): Promise<TransactionDto> {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
      relations: ['wallet', 'order', 'membership'],
    });
    return plainToInstance(TransactionDto, transaction);
  }

  async createTransactionForSeeding(transaction: Transaction): Promise<Transaction> {
    return await this.transactionRepository.save(transaction);
  }

  async approveWithdrawRequest(id: string): Promise<Transaction> {
    const transaction = await this.getTransactionById(id);
    if (!transaction) throw new NotFoundException('Không tìm thấy giao dịch');

    if (transaction.type !== TransactionType.WITHDRAW)
      throw new NotFoundException('Giao dịch không phải là yêu cầu rút tiền');

    if (transaction.status !== TransactionStatus.PENDING)
      throw new NotFoundException('Giao dịch rút tiền này đã được xử lý hoặc không còn hiệu lực');

    transaction.status = TransactionStatus.COMPLETED;
    return await this.transactionRepository.save(plainToInstance(Transaction, transaction));
  }

  async cancelWithdrawRequest(id: string): Promise<Transaction> {
    const transaction = await this.getTransactionById(id);
    if (!transaction) throw new NotFoundException('Không tìm thấy giao dịch');

    if (transaction.type !== TransactionType.WITHDRAW)
      throw new NotFoundException('Giao dịch không phải là yêu cầu rút tiền');

    if (transaction.status !== TransactionStatus.PENDING)
      throw new NotFoundException('Giao dịch rút tiền này đã được xử lý hoặc không còn hiệu lực');

    transaction.status = TransactionStatus.CANCELLED;
    return await this.transactionRepository.save(plainToInstance(Transaction, transaction));
  }
}
