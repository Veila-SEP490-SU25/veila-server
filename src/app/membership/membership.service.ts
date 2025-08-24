import { Membership, MembershipStatus, UserRole } from '@/common/models';
import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterMembershipDto } from './membership.dto';
import { SubscriptionService } from '../subscription/subscription.service';
import { ShopService } from '@/app/shop/shop.service';
import { WalletService } from '@/app//wallet/wallet.service';
import { TransactionService } from '@/app/transaction/transaction.service';
import { UserService } from '@/app/user/user.service';

@Injectable()
export class MembershipService {
  constructor(
    @InjectRepository(Membership)
    private readonly membershipRepository: Repository<Membership>,
    private readonly subscriptionService: SubscriptionService,
    @Inject(forwardRef(() => ShopService))
    private readonly shopService: ShopService,
    @Inject(forwardRef(() => WalletService))
    private readonly walletService: WalletService,
    @Inject(forwardRef(() => TransactionService))
    private readonly transactionService: TransactionService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  async purchaseMembership(userId: string, body: RegisterMembershipDto): Promise<Membership> {
    const shop = await this.shopService.getShopByUserId(userId);
    if(!shop)
      throw new NotFoundException('Không tìm thấy cửa hàng');

    const subscription = await this.subscriptionService.getSubscription(UserRole.SHOP, body.subscriptionId);
    if (!subscription) throw new NotFoundException('Không tìm thấy gói đăng ký phù hợp');

    const activeMembership = await this.membershipRepository.findOne({
      where: { shop: { id: shop.id }, status: MembershipStatus.ACTIVE },
      relations: ['shop', 'subscription'],
    });

    if (activeMembership) {
      if (Number(activeMembership.subscription.amount) >= Number(subscription.amount)) {
        // Nếu gói cũ đắt tiền hơn hoặc bằng gói mới
        if (Number(activeMembership.subscription.amount) > Number(subscription.amount)) {
          // Cũ giá trị hơn -> không cho phép mua
          throw new BadRequestException('Bạn đang sử dụng gói cao cấp hơn, không thể mua gói thấp hơn');
        } else {
          // Bằng giá -> không cần mua lại
          throw new BadRequestException('Bạn đang dùng gói có giá trị tương đương');
        }
      } else {
        // Nếu gói cũ rẻ hơn gói mới
        if (!body.force) {
          throw new BadRequestException('Bạn đang dùng gói rẻ hơn. Nếu muốn mua gói này sẽ hủy gói cũ, xác nhận mua hay không?');
        }
        // Hủy gói cũ
        await this.membershipRepository.update(activeMembership.id, {
          status: MembershipStatus.INACTIVE,
          endDate: new Date(),
        });
      }
    }

    // Tạo membership mới
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + subscription.duration);

    const newMembership = this.membershipRepository.create({
    shop,
    subscription,
    startDate,
    endDate,
    status: MembershipStatus.ACTIVE,
  } as Membership);

  const wallet = await this.walletService.getWalletByUserIdV2(userId);
  if(Number(wallet.availableBalance) < Number(subscription.amount))
    throw new BadRequestException('Số dư trong ví không đủ để thực hiện mua gói'); 

  await this.walletService.saveWalletBalanceV4(wallet, Number(subscription.amount));
  const user = await this.userService.getUserById(userId);
  if(!user)
    throw new NotFoundException('Không tìm thấy người dùng');
  await this.transactionService.saveTransferToPlatformTransaction(user, wallet.id,Number(subscription.amount));

  return this.membershipRepository.save(newMembership);
}

  async cancelMembership(userId: string): Promise<void> {
    const shop = await this.shopService.getShopByUserId(userId);
    if(!shop)
      throw new NotFoundException('Không tìm thấy cửa hàng');

    const activeMembership = await this.membershipRepository.findOne({
      where: { shop: { id: shop.id }, status: MembershipStatus.ACTIVE },
    });

    if (!activeMembership) {
      throw new NotFoundException('Không tìm thấy membership đang hoạt động để hủy');
    }

    await this.membershipRepository.update(activeMembership.id, {
      status: MembershipStatus.INACTIVE,
      endDate: new Date(),
    });
  }

  async findAll(): Promise<Membership[]> {
    return this.membershipRepository.find({ withDeleted: true });
  }

  async findOne(shopId: string): Promise<Membership | null> {
    return this.membershipRepository.findOne({
      where: { shop: { id: shopId } },
      withDeleted: true,
    });
  }

  async createForSeeding(membership: Membership): Promise<Membership> {
    return await this.membershipRepository.save(membership);
  }

  async registerMembership(shopId: string, subscriptionId: string): Promise<void> {
    const subscription = await this.subscriptionService.getSubscription(UserRole.SHOP, subscriptionId);
    if (!subscription) throw new NotFoundException('Không tìm thấy gói đăng ký phù hợp');
    if (!subscription) throw new NotFoundException('Không tìm thấy gói đăng ký phù hợp');

    const membership = await this.membershipRepository.findOne({
      where: {
        shop: { id: shopId },
        status: MembershipStatus.ACTIVE,
      },
    });
    if (membership) {
      await this.membershipRepository.update(membership.id, {
        status: MembershipStatus.INACTIVE,
      });
    }

    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + subscription.duration);
    const newMembership = this.membershipRepository.create({
      shop: { id: shopId },
      subscription,
      startDate,
      endDate,
      status: MembershipStatus.ACTIVE,
    } as Membership);
    await this.membershipRepository.save(newMembership);
  }
}
