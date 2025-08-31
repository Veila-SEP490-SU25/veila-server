import { ContractService } from '@/app/contract';
import { MembershipService } from '@/app/membership';
import {
  ItemShopDto,
  RegisterShopDto,
  ResubmitShopDto,
  ReviewShopDto,
  ShopContactDto,
  UpdateShopDto,
} from '@/app/shop/shop.dto';
import { UserService } from '@/app/user';
import { Filtering, getOrder, getWhere, Sorting } from '@/common/decorators';
import {
  Accessory,
  AccessoryStatus,
  Blog,
  BlogStatus,
  Category,
  ContractType,
  Dress,
  DressStatus,
  License,
  LicenseStatus,
  Membership,
  MembershipStatus,
  Service,
  ServiceStatus,
  Shop,
  ShopStatus,
  Subscription,
  User,
  UserRole,
} from '@/common/models';
import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { In, Repository } from 'typeorm';

@Injectable()
export class ShopService {
  constructor(
    @InjectRepository(Shop) private readonly shopRepository: Repository<Shop>,
    @InjectRepository(Accessory) private readonly accessoryRepository: Repository<Accessory>,
    @InjectRepository(Blog) private readonly blogRepository: Repository<Blog>,
    @InjectRepository(Category) private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Dress) private readonly dressRepository: Repository<Dress>,
    @InjectRepository(Service) private readonly serviceRepository: Repository<Service>,
    @InjectRepository(License) private readonly licenseRepository: Repository<License>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
    @Inject(MembershipService)
    private readonly membershipService: MembershipService,
    private readonly contractService: ContractService,
    @Inject(UserService)
    private readonly userService: UserService,
  ) {}

  async updateShopProfile(userId: string, body: UpdateShopDto): Promise<void> {
    const existingShop = await this.getShopForOwner(userId);
    await this.shopRepository.update(existingShop.id, { ...body });
  }

  async getShops(
    currentRole: UserRole,
    take: number,
    skip: number,
    sort?: Sorting,
    filter?: Filtering,
  ): Promise<[Shop[], number]> {
    if (!currentRole || currentRole === UserRole.CUSTOMER || currentRole === UserRole.SHOP) {
      const dynamicFilter = getWhere(filter);
      const where = {
        ...dynamicFilter,
        status: ShopStatus.ACTIVE,
        isVerified: true,
      };
      const order = getOrder(sort);

      return await this.shopRepository.findAndCount({
        where,
        order,
        take,
        skip,
      });
    } else {
      const dynamicFilter = getWhere(filter);
      const where = {
        ...dynamicFilter,
      };
      const order = getOrder(sort);
      return await this.shopRepository.findAndCount({
        where,
        order,
        take,
        skip,
        withDeleted: true,
      });
    }
  }

  async getShop(userId: string, currentRole: UserRole, id: string): Promise<ItemShopDto> {
    if (!currentRole || currentRole === UserRole.CUSTOMER || currentRole === UserRole.SHOP) {
      const where = {
        id,
        status: ShopStatus.ACTIVE,
        isVerified: true,
      };
      const existingShop = await this.shopRepository.findOneBy(where);
      if (!existingShop) throw new NotFoundException('Không tìm thấy cửa hàng phù hợp');
      if (!userId) return plainToInstance(ItemShopDto, existingShop);
      else {
        const user = await this.userService.getSelf(userId);

        const isFavorite = user.favShops ? user.favShops.includes(existingShop.id) : null;
        return plainToInstance(ItemShopDto, { ...existingShop, isFavorite });
      }
    } else {
      const existingShop = await this.shopRepository.findOne({
        where: { id },
        withDeleted: true,
        relations: {
          user: true,
          license: true,
          memberships: true,
        },
      });
      if (!existingShop) throw new NotFoundException('Không tìm thấy cửa hàng phù hợp');
      return plainToInstance(ItemShopDto, existingShop);
    }
  }

  async getDressesForCustomer(
    id: string,
    take: number,
    skip: number,
    sort?: Sorting,
    filter?: Filtering,
  ): Promise<[Dress[], number]> {
    const existingShop = await this.getShopForCustomerWithUser(id);
    const dynamicFilter = getWhere(filter);
    const where = {
      ...dynamicFilter,
      user: { id: existingShop.user.id },
      status: In([DressStatus.AVAILABLE, DressStatus.OUT_OF_STOCK]),
    };
    const order = getOrder(sort);
    return await this.dressRepository.findAndCount({
      where,
      order,
      take,
      skip,
      relations: { user: { shop: true }, category: true },
    });
  }

  async getAccessoriesForCustomer(
    id: string,
    take: number,
    skip: number,
    sort?: Sorting,
    filter?: Filtering,
  ): Promise<[Accessory[], number]> {
    const existingShop = await this.getShopForCustomerWithUser(id);
    const dynamicFilter = getWhere(filter);
    const where = {
      ...dynamicFilter,
      user: { id: existingShop.user.id },
      status: In([AccessoryStatus.OUT_OF_STOCK, AccessoryStatus.AVAILABLE]),
    };
    const order = getOrder(sort);
    return await this.accessoryRepository.findAndCount({
      where,
      order,
      take,
      skip,
      relations: { user: { shop: true }, category: true },
    });
  }

  async getServicesForCustomer(
    id: string,
    take: number,
    skip: number,
    sort?: Sorting,
    filter?: Filtering,
  ): Promise<[Service[], number]> {
    const existingShop = await this.getShopForCustomerWithUser(id);
    const dynamicFilter = getWhere(filter);
    const where = {
      ...dynamicFilter,
      user: { id: existingShop.user.id },
      status: ServiceStatus.AVAILABLE,
    };
    const order = getOrder(sort);
    return await this.serviceRepository.findAndCount({
      where,
      order,
      take,
      skip,
      relations: { user: { shop: true }, category: true },
    });
  }

  async getBlogsForCustomer(
    id: string,
    take: number,
    skip: number,
    sort?: Sorting,
    filter?: Filtering,
  ): Promise<[Blog[], number]> {
    const existingShop = await this.getShopForCustomerWithUser(id);
    const dynamicFilter = getWhere(filter);
    const where = {
      ...dynamicFilter,
      user: { id: existingShop.user.id },
      isVerified: true,
      status: BlogStatus.PUBLISHED,
    };
    const order = getOrder(sort);
    return await this.blogRepository.findAndCount({
      where,
      order,
      take,
      skip,
      relations: { user: { shop: true }, category: true },
    });
  }

  async getCategoriesForCustomer(
    id: string,
    take: number,
    skip: number,
    sort?: Sorting,
    filter?: Filtering,
  ): Promise<[Category[], number]> {
    const existingShop = await this.getShopForCustomerWithUser(id);
    const dynamicFilter = getWhere(filter);
    const where = {
      ...dynamicFilter,
      user: { id: existingShop.user.id },
    };
    const order = getOrder(sort);
    return await this.categoryRepository.findAndCount({
      where,
      order,
      take,
      skip,
    });
  }

  async getShopForOwner(userId: string): Promise<Shop> {
    const where = { user: { id: userId } };
    const existingShop = await this.shopRepository.findOne({
      where,
      withDeleted: true,
      relations: {
        license: true,
      },
    });
    if (!existingShop) throw new NotFoundException('Không tìm thấy cửa hàng của bạn');
    return existingShop;
  }

  async registerShop(
    userId: string,
    { name, phone, email, address, licenseImages }: RegisterShopDto,
  ): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Không tìm thấy người dùng phù hợp');
    if (user.shop || user.role === UserRole.SHOP)
      throw new BadRequestException('Người dùng đã có cửa hàng');
    if (!user.isIdentified)
      throw new BadRequestException('Bạn cần xác thực danh tính (SDT) để đăng ký cửa hàng');

    const existingShop = await this.shopRepository.findOne({
      where: { user: { id: userId } },
      relations: {
        license: true,
      },
    });
    if (!existingShop) {
      const contract = await this.contractService.findAvailableContract(ContractType.SHOP);

      const newShop = await this.shopRepository.save({
        user: { id: userId },
        contract,
        name,
        phone,
        email,
        address,
        status: ShopStatus.PENDING,
        isVerified: false,
      });
      await this.licenseRepository.save({
        images: licenseImages,
        shop: newShop,
        status: LicenseStatus.PENDING,
      });
    } else {
      if (!existingShop.license)
        throw new NotFoundException('Không tìm thấy giấy phép kinh doanh của cửa hàng');
      await this.shopRepository.update(existingShop.id, {
        name,
        phone,
        email,
        address,
        status: ShopStatus.PENDING,
      });
      await this.licenseRepository.update(existingShop.license.id, {
        images: licenseImages,
        status: LicenseStatus.RESUBMIT,
      });
    }
  }

  async resubmitShop(
    userId: string,
    { name, phone, email, address, licenseImages }: ResubmitShopDto,
  ) {
    const existingShop = await this.shopRepository.findOne({
      where: { user: { id: userId } },
      relations: {
        license: true,
      },
    });
    if (!existingShop) throw new NotFoundException('Không tìm thấy cửa hàng phù hợp');
    if (!existingShop.license)
      throw new NotFoundException('Không tìm thấy giấy phép kinh doanh của cửa hàng');

    await this.shopRepository.update(existingShop.id, {
      name,
      phone,
      email,
      address,
      status: ShopStatus.PENDING,
    });
    await this.licenseRepository.update(existingShop.license.id, {
      images: licenseImages,
      status: LicenseStatus.RESUBMIT,
    });
  }

  async reviewShopRegister(id: string, { isApproved, rejectReason }: ReviewShopDto): Promise<void> {
    const existingShop = await this.shopRepository.findOne({
      where: { id },
      withDeleted: true,
      relations: { license: true, user: true },
    });

    if (!existingShop) {
      throw new NotFoundException('Không tìm thấy cửa hàng phù hợp');
    }
    if (!existingShop.license) {
      throw new NotFoundException('Không tìm thấy giấy phép kinh doanh của cửa hàng');
    }
    if (existingShop.status !== ShopStatus.PENDING) {
      throw new BadRequestException('Cửa hàng không ở trạng thái chờ duyệt');
    }

    if (isApproved) {
      await this.shopRepository.update(existingShop.id, {
        status: ShopStatus.ACTIVE,
        isVerified: true,
      });

      await this.licenseRepository.update(existingShop.license.id, {
        status: LicenseStatus.APPROVED,
      });

      await this.userRepository.update({ id: existingShop.user.id }, { role: UserRole.SHOP });

      const subscription = await this.subscriptionRepository.findOne({
        where: { duration: 7 },
      });
      if (!subscription) {
        throw new NotFoundException('Không tìm thấy gói đăng ký phù hợp');
      }
      await this.membershipService.registerMembership(existingShop.id, subscription.id);
    } else {
      await this.shopRepository.update(existingShop.id, {
        status: ShopStatus.INACTIVE,
      });
      await this.licenseRepository.update(existingShop.license.id, {
        status: LicenseStatus.REJECTED,
        rejectReason,
      });
    }
  }

  async getShopForCustomerWithUser(id: string): Promise<Shop> {
    const existingShop = await this.shopRepository.findOne({
      where: { id, status: ShopStatus.ACTIVE, isVerified: true },
      relations: { user: true },
    });
    if (!existingShop) throw new NotFoundException('Không tìm thấy cửa hàng phù hợp');
    return existingShop;
  }

  async create(shop: Shop): Promise<Shop> {
    return await this.shopRepository.save(shop);
  }

  async getAll(): Promise<Shop[]> {
    return await this.shopRepository.find({ withDeleted: true });
  }

  async getByUserEmail(email: string): Promise<Shop | null> {
    return await this.shopRepository.findOne({
      where: { user: { email } },
      withDeleted: true,
    });
  }

  async getAllLicenses(): Promise<License[]> {
    return await this.licenseRepository.find({
      withDeleted: true,
    });
  }

  async getLicenseByShopId(shopId: string): Promise<License | null> {
    return await this.licenseRepository.findOne({
      where: { shop: { id: shopId } },
      withDeleted: true,
    });
  }

  async createLicense(license: License): Promise<void> {
    await this.licenseRepository.save(license);
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, { timeZone: 'Asia/Ho_Chi_Minh' })
  async suspendShopsUnRenewedMemberships(): Promise<void> {
    const today = new Date();
    const shops = await this.shopRepository.find({
      where: { status: ShopStatus.ACTIVE },
      relations: {
        memberships: true,
      },
    });

    const shopIdsToSuspend = shops
      .filter((shop) => {
        const activeMembership = shop.memberships.find(
          (membership) => membership.status === MembershipStatus.ACTIVE,
        );
        return activeMembership && new Date(activeMembership.endDate) < today;
      })
      .map((shop) => shop.id);

    if (shopIdsToSuspend.length > 0) {
      await this.shopRepository.update(
        { id: In(shopIdsToSuspend) },
        { status: ShopStatus.SUSPENDED },
      );
    }
  }

  async getShopByUserId(userId: string): Promise<Shop | null> {
    return await this.shopRepository
      .createQueryBuilder('shop')
      .leftJoinAndSelect('shop.user', 'user')
      .where('user.id = :userId', { userId })
      .andWhere('shop.status = :status', { status: ShopStatus.ACTIVE })
      .getOne();
  }

  async getContactInformation(userId: string): Promise<ShopContactDto> {
    const shop = await this.getShopByUserId(userId);
    if (!shop) throw new NotFoundException('Không tìm thấy cửa hàng');

    if (!shop.isVerified) throw new ForbiddenException('Cừa hàng chưa được xác thực');

    const shopContact = {
      email: shop.email,
      phone: shop.phone,
      address: shop.address,
    } as ShopContactDto;

    return shopContact;
  }

  async getShopForSeeding(userId: string): Promise<Shop | null> {
    return await this.shopRepository.findOne({
      where: { user: { id: userId } },
      withDeleted: true,
    });
  }

  async getShopByUserEmailForSeeding(email: string): Promise<Shop | null> {
    return await this.shopRepository.findOne({
      where: { user: { email } },
      relations: {
        user: {
          wallet: true,
        },
      },
      withDeleted: true,
    });
  }

  async getShopForOrderCustom(id: string): Promise<Shop> {
    const shop = await this.shopRepository.findOne({
      where: {
        id,
        status: ShopStatus.ACTIVE,
        isVerified: true,
      },
      relations: { user: true },
    });
    if (!shop) throw new NotFoundException('Không tìm thấy cửa hàng');
    return shop;
  }

  async getShopById(id: string): Promise<Shop> {
    const shop = await this.shopRepository.findOne({
      where: {
        id,
        status: ShopStatus.ACTIVE,
        isVerified: true,
      },
      relations: { user: true },
    });
    if (!shop) throw new NotFoundException('Không tìm thấy cửa hàng');
    return shop;
  }

  async addFavorite(userId: string, id: string): Promise<void> {
    const shop = await this.shopRepository.findOne({
      where: {
        id,
        status: ShopStatus.ACTIVE,
        isVerified: true,
      },
    });
    if (!shop) throw new NotFoundException('Không tìm thấy cửa hàng');

    const user = await this.userService.getSelf(userId);
    let favShops = user.favShops;
    if (!favShops) favShops = [];
    if (favShops.includes(shop.id)) return; // Already a favorite
    favShops.push(shop.id);
    await this.userService.updateFavShops(userId, favShops);
  }

  async removeFavorite(userId: string, id: string): Promise<void> {
    const user = await this.userService.getSelf(userId);
    let favShops = user.favShops;
    if (!favShops) return; // No favorites to remove
    favShops = favShops.filter((shopId) => shopId !== id);
    await this.userService.updateFavShops(userId, favShops);
  }

  async getFavorite(
    userId: string,
    take: number,
    skip: number,
    sort?: Sorting,
    filter?: Filtering,
  ): Promise<[Shop[], number]> {
    const user = await this.userService.getSelf(userId);
    if (!user.favShops || user.favShops.length === 0) {
      return [[], 0];
    }
    const dynamicFilter = getWhere(filter);
    const where = {
      ...dynamicFilter,
      id: In(user.favShops),
      status: ShopStatus.ACTIVE,
      isVerified: true,
    };
    const order = getOrder(sort);
    return await this.shopRepository.findAndCount({
      where,
      order,
      take,
      skip,
    });
  }

  async save(shop: Shop): Promise<Shop> {
    return await this.shopRepository.save(shop);
  }

  async getAllMemberships(): Promise<Membership[]> {
    return await this.membershipService.findAll();
  }

  async getMembershipById(id: string): Promise<Membership | null> {
    return await this.membershipService.findOne(id);
  }

  async createMembershipForSeeding(data: Membership): Promise<Membership> {
    return await this.membershipService.createForSeeding(data);
  }
}
