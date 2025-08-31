import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CUTransactionDto, WithdrawTransactionDto, TransactionDto } from './transaction.dto';
import {
  TransactionStatus,
  Transaction,
  User,
  TypeBalance,
  TransactionType,
  Wallet,
} from '@/common/models';
import { plainToInstance } from 'class-transformer';
import { Filtering, getOrder, getWhere, Sorting } from '@/common/decorators';
import { DepositViaPayOSDto, WalletService } from '../wallet';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @Inject(forwardRef(() => WalletService))
    private readonly walletService: WalletService,
  ) {}

  async saveDepositTransaction(
    user: User,
    walletId: string,
    transactionDetail: DepositViaPayOSDto,
  ): Promise<string> {
    const wallet = await this.walletService.getWalletById(walletId);

    const newTransaction = {
      wallet: { id: walletId },
      from: user.firstName + ' ' + user.middleName + ' ' + user.lastName,
      to: user.firstName + ' ' + user.middleName + ' ' + user.lastName + ' Wallet',
      fromTypeBalance: TypeBalance.AVAILABLE,
      toTypeBalance: TypeBalance.AVAILABLE,
      amount: transactionDetail.amount,
      type: TransactionType.DEPOSIT,
      status: TransactionStatus.PENDING,
      note: transactionDetail.note,
      availableBalanceSnapshot: Number(wallet.availableBalance),
      lockedBalanceSnapshot: Number(wallet.lockedBalance),
    };
    return (await this.transactionRepository.save(plainToInstance(Transaction, newTransaction))).id;
  }

  async updateBalanceSnapshotForDeposit(transactionId: string): Promise<Transaction> {
    const existingTransaction = await this.getTransactionByIdV2(transactionId);
    existingTransaction.availableBalanceSnapshot =
      Number(existingTransaction.availableBalanceSnapshot) + Number(existingTransaction.amount);

    await this.transactionRepository.save(existingTransaction);
    return existingTransaction;
  }

  async saveWithdrawTransaction(
    user: User,
    wallet: Wallet,
    transactionDetail: WithdrawTransactionDto,
  ): Promise<void> {
    const newTransaction = {
      wallet,
      from: user.firstName + ' ' + user.middleName + ' ' + user.lastName + ' Wallet',
      to: user.firstName + ' ' + user.middleName + ' ' + user.lastName,
      fromTypeBalance: TypeBalance.AVAILABLE,
      toTypeBalance: TypeBalance.AVAILABLE,
      amount: transactionDetail.amount,
      type: TransactionType.WITHDRAW,
      status: TransactionStatus.PENDING,
      note: transactionDetail.note,
      availableBalanceSnapshot: Number(wallet.availableBalance),
      lockedBalanceSnapshot: Number(wallet.lockedBalance),
    };
    await this.transactionRepository.save(plainToInstance(Transaction, newTransaction));
  }

  async updateBalanceSnapshotForApprovedWithDraw(transactionId: string): Promise<Transaction> {
    const existingTransaction = await this.getTransactionByIdV2(transactionId);
    existingTransaction.lockedBalanceSnapshot =
      Number(existingTransaction.lockedBalanceSnapshot) - Number(existingTransaction.amount);

    await this.transactionRepository.save(existingTransaction);
    return existingTransaction;
  }

  async updateBalanceSnapshotForCancelledWithDraw(transactionId: string): Promise<Transaction> {
    const existingTransaction = await this.getTransactionByIdV2(transactionId);
    existingTransaction.availableBalanceSnapshot =
      Number(existingTransaction.availableBalanceSnapshot) + Number(existingTransaction.amount);
    existingTransaction.lockedBalanceSnapshot =
      Number(existingTransaction.lockedBalanceSnapshot) - Number(existingTransaction.amount);

    await this.transactionRepository.save(existingTransaction);
    return existingTransaction;
  }

  async saveTransferTransactionForSell(
    fromUser: User,
    toUser: User,
    walletId: string,
    orderId: string,
    amount: number,
    type: TransactionType,
  ): Promise<void> {
    const fromUserName = fromUser.firstName + ' ' + fromUser.middleName + ' ' + fromUser.lastName;
    const toUserName = toUser.firstName + ' ' + toUser.middleName + ' ' + toUser.lastName;
    const wallet = await this.walletService.getWalletById(walletId);

    const newTransaction = {
      wallet: { id: walletId },
      order: { id: orderId },
      from: fromUserName + ' Wallet',
      to: toUserName + ' Wallet',
      fromTypeBalance: TypeBalance.AVAILABLE,
      toTypeBalance: TypeBalance.LOCKED,
      amount: amount,
      type: type,
      status: TransactionStatus.COMPLETED,
      note: fromUserName + ' transfer to ' + toUserName,
      availableBalanceSnapshot: Number(wallet.availableBalance),
      lockedBalanceSnapshot: Number(wallet.lockedBalance),
    } as Transaction;
    await this.transactionRepository.save(plainToInstance(Transaction, newTransaction));
  }

  async saveTransferTransactionForRent(
    fromUser: User,
    toUser: User,
    walletId: string,
    orderId: string,
    amount: number,
    type: TransactionType,
  ): Promise<void> {
    const fromUserName = fromUser.firstName + ' ' + fromUser.middleName + ' ' + fromUser.lastName;
    const toUserName = toUser.firstName + ' ' + toUser.middleName + ' ' + toUser.lastName;
    const wallet = await this.walletService.getWalletById(walletId);

    const newTransaction = {
      wallet: { id: walletId },
      order: { id: orderId },
      from: fromUserName + ' Wallet',
      to: toUserName + ' Wallet',
      fromTypeBalance: TypeBalance.AVAILABLE,
      toTypeBalance: TypeBalance.LOCKED,
      amount: amount,
      type: type,
      status: TransactionStatus.COMPLETED,
      note: fromUserName + ' transfer to ' + toUserName,
      availableBalanceSnapshot: Number(wallet.availableBalance),
      lockedBalanceSnapshot: Number(wallet.lockedBalance),
    } as Transaction;
    await this.transactionRepository.save(plainToInstance(Transaction, newTransaction));
  }

  async saveSelfTransferTransactionForRent(
    fromUser: User,
    toUser: User,
    walletId: string,
    orderId: string,
    amount: number,
    deposit: number,
    type: TransactionType,
  ): Promise<void> {
    const fromUserName = fromUser.firstName + ' ' + fromUser.middleName + ' ' + fromUser.lastName;
    const toUserName = toUser.firstName + ' ' + toUser.middleName + ' ' + toUser.lastName;
    const wallet = await this.walletService.getWalletById(walletId);

    const newTransaction = {
      wallet: { id: walletId },
      order: { id: orderId },
      from: fromUserName + ' Wallet',
      to: toUserName + ' Wallet',
      fromTypeBalance: TypeBalance.AVAILABLE,
      toTypeBalance: TypeBalance.LOCKED,
      amount: deposit,
      type: type,
      status: TransactionStatus.COMPLETED,
      note: fromUserName + ' transfer to ' + toUserName,
      availableBalanceSnapshot: Number(wallet.availableBalance),
      lockedBalanceSnapshot: Number(wallet.lockedBalance) + amount,
    } as Transaction;
    await this.transactionRepository.save(plainToInstance(Transaction, newTransaction));
  }

  async saveTransferToPlatformTransaction(
    fromUser: User,
    walletId: string,
    amount: number,
  ): Promise<void> {
    const fromUserName = fromUser.firstName + ' ' + fromUser.middleName + ' ' + fromUser.lastName;
    const toUserName = 'Veila Platform Wallet';
    const wallet = await this.walletService.getWalletById(walletId);

    const newTransaction = {
      wallet: { id: walletId },
      from: fromUserName + ' Wallet',
      to: toUserName,
      fromTypeBalance: TypeBalance.AVAILABLE,
      toTypeBalance: TypeBalance.AVAILABLE,
      amount: amount,
      type: TransactionType.TRANSFER,
      status: TransactionStatus.COMPLETED,
      note: fromUserName + ' transfer to ' + toUserName,
      availableBalanceSnapshot: Number(wallet.availableBalance),
      lockedBalanceSnapshot: Number(wallet.lockedBalance),
    } as Transaction;
    await this.transactionRepository.save(plainToInstance(Transaction, newTransaction));
  }

  async saveRefundTransaction(
    fromUser: User,
    toUser: User,
    walletId: string,
    orderId: string,
    amount: number,
    type: TransactionType,
  ): Promise<void> {
    const fromUserName = fromUser.firstName + ' ' + fromUser.middleName + ' ' + fromUser.lastName;
    const toUserName = toUser.firstName + ' ' + toUser.middleName + ' ' + toUser.lastName;
    const wallet = await this.walletService.getWalletById(walletId);

    const newTransaction = {
      wallet: { id: walletId },
      order: { id: orderId },
      from: fromUserName + ' Wallet',
      to: toUserName + ' Wallet',
      fromTypeBalance: TypeBalance.LOCKED,
      toTypeBalance: TypeBalance.AVAILABLE,
      amount: amount,
      type,
      status: TransactionStatus.COMPLETED,
      note: fromUserName + ' refund to ' + toUserName,
      availableBalanceSnapshot: Number(wallet.availableBalance),
      lockedBalanceSnapshot: Number(wallet.lockedBalance),
    } as Transaction;
    await this.transactionRepository.save(plainToInstance(Transaction, newTransaction));
  }

  async saveTransferOrderTransaction(
    fromUser: User,
    toUser: User,
    walletId: string,
    orderId: string,
    amount: number,
    type: TransactionType,
  ): Promise<void> {
    const fromUserName = fromUser.firstName + ' ' + fromUser.middleName + ' ' + fromUser.lastName;
    const toUserName = toUser.firstName + ' ' + toUser.middleName + ' ' + toUser.lastName;
    const wallet = await this.walletService.getWalletById(walletId);

    const newTransaction = {
      wallet: { id: walletId },
      from: fromUserName + ' Wallet',
      to: toUserName + ' Wallet',
      fromTypeBalance: TypeBalance.AVAILABLE,
      toTypeBalance: TypeBalance.LOCKED,
      amount: amount,
      type: type,
      order: { id: orderId },
      status: TransactionStatus.COMPLETED,
      note: fromUserName + ' transfer to ' + toUserName,
      availableBalanceSnapshot: Number(wallet.availableBalance),
      lockedBalanceSnapshot: Number(wallet.lockedBalance),
    } as Transaction;
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
    existingTransaction.availableBalanceSnapshot = transactionDetail.availableBalanceSnapshot;
    existingTransaction.lockedBalanceSnapshot = transactionDetail.lockedBalanceSnapshot;

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

    const [transactions, count] = await this.transactionRepository.findAndCount({
      where,
      order,
      take,
      skip,
      relations: ['wallet', 'order', 'membership'],
    });

    return [plainToInstance(TransactionDto, transactions), count];
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

    const [transactions, count] = await this.transactionRepository.findAndCount({
      where,
      order,
      take,
      skip,
      relations: ['wallet', 'order', 'membership'],
    });

    return [plainToInstance(TransactionDto, transactions), count];
  }

  async getTransactionsByOrderId(
    orderId: string,
    take: number,
    skip: number,
    sort?: Sorting,
    filter?: Filtering,
  ): Promise<[Transaction[], number]> {
    const dynamicFilter = getWhere(filter);
    const where = {
      ...dynamicFilter,
      order: { id: orderId },
    };
    const order = getOrder(sort);

    return await this.transactionRepository.findAndCount({
      where,
      order,
      take,
      skip,
      relations: ['wallet', 'order', 'membership'],
    });
  }

  async getTransactionById(id: string): Promise<TransactionDto> {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
      relations: ['wallet', 'order', 'membership'],
    });
    if (!transaction) throw new NotFoundException('Không tìm thấy giao dịch');
    return plainToInstance(TransactionDto, transaction);
  }

  async getTransactionByIdV2(id: string): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
      relations: ['wallet', 'order', 'membership'],
    });
    if (!transaction) throw new NotFoundException('Không tìm thấy giao dịch');
    return transaction;
  }

  async getTransactionByOrderId(orderId: string): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({
      where: { order: { id: orderId } },
      relations: ['wallet', 'order', 'membership'],
    });
    if (!transaction) throw new NotFoundException('Không tìm thấy giao dịch');

    return transaction;
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

    const wallet = await this.walletService.getWalletById(transaction.walletId);
    await this.walletService.saveWalletBalanceV2(wallet, transaction.amount);
    await this.updateBalanceSnapshotForApprovedWithDraw(transaction.id);

    return await this.updateTransactionStatus(id, TransactionStatus.COMPLETED);
  }

  async cancelWithdrawRequest(id: string): Promise<Transaction> {
    const transaction = await this.getTransactionById(id);
    if (!transaction) throw new NotFoundException('Không tìm thấy giao dịch');

    if (transaction.type !== TransactionType.WITHDRAW)
      throw new NotFoundException('Giao dịch không phải là yêu cầu rút tiền');

    if (transaction.status !== TransactionStatus.PENDING)
      throw new NotFoundException('Giao dịch rút tiền này đã được xử lý hoặc không còn hiệu lực');

    const wallet = await this.walletService.getWalletById(transaction.walletId);
    await this.walletService.saveWalletBalanceV3(wallet, transaction.amount);
    await this.updateBalanceSnapshotForCancelledWithDraw(transaction.id);
    return await this.updateTransactionStatus(id, TransactionStatus.CANCELLED);
  }

  async getTransferTransactionsForCustomOrder(
    userId: string,
    orderId: string,
  ): Promise<Transaction[]> {
    return await this.transactionRepository.find({
      where: {
        order: { id: orderId },
        wallet: { user: { id: userId } },
        type: TransactionType.TRANSFER,
        status: TransactionStatus.COMPLETED,
      },
    });
  }

  async getTransactionsForCustomOrder(
    userId: string,
    orderId: string,
    type: TransactionType,
  ): Promise<Transaction[]> {
    return await this.transactionRepository.find({
      where: {
        order: { id: orderId },
        wallet: { user: { id: userId } },
        type,
        status: TransactionStatus.COMPLETED,
      },
    });
  }

  async createMembershipTransactionForSeeding(transaction: Transaction): Promise<Transaction> {
    return await this.transactionRepository.save(transaction);
  }
}
