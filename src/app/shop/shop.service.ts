import { MembershipService } from '@/app/membership';
import {
  RegisterShopDto,
  ResubmitShopDto,
  ReviewShopDto,
  UpdateShopDto,
} from '@/app/shop/shop.dto';
import { Filtering, getOrder, getWhere, Sorting } from '@/common/decorators';
import {
  Accessory,
  AccessoryStatus,
  Blog,
  BlogStatus,
  Category,
  Dress,
  DressStatus,
  License,
  LicenseStatus,
  Service,
  ServiceStatus,
  Shop,
  ShopStatus,
  Subscription,
  User,
  UserRole,
} from '@/common/models';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
    private readonly membershipService: MembershipService,
  ) {}

  async updateShopProfile(userId: string, body: UpdateShopDto): Promise<void> {
    const existingShop = await this.getShopForOwner(userId);
    await this.shopRepository.update(existingShop.id, { ...body });
  }

  async getShopsForCustomer(
    take: number,
    skip: number,
    sort?: Sorting,
    filter?: Filtering,
  ): Promise<[Shop[], number]> {
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
  }

  async getShopForCustomer(id: string): Promise<Shop> {
    const where = {
      id,
      status: ShopStatus.ACTIVE,
      isVerified: true,
    };
    const existingShop = await this.shopRepository.findOneBy(where);
    if (!existingShop) throw new NotFoundException('Không tìm thấy cửa hàng phù hợp');
    return existingShop;
  }

  async getDressesForCustomer(
    id: string,
    take: number,
    skip: number,
    sort?: Sorting,
    filter?: Filtering,
  ): Promise<[Dress[], number]> {
    const existingShop = await this.getShopWithUserWithoutDeletedById(id);
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
    });
  }

  async getAccessoriesForCustomer(
    id: string,
    take: number,
    skip: number,
    sort?: Sorting,
    filter?: Filtering,
  ): Promise<[Accessory[], number]> {
    const existingShop = await this.getShopWithUserWithoutDeletedById(id);
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
    });
  }

  async getServicesForCustomer(
    id: string,
    take: number,
    skip: number,
    sort?: Sorting,
    filter?: Filtering,
  ): Promise<[Service[], number]> {
    const existingShop = await this.getShopWithUserWithoutDeletedById(id);
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
    });
  }

  async getBlogsForCustomer(
    id: string,
    take: number,
    skip: number,
    sort?: Sorting,
    filter?: Filtering,
  ): Promise<[Blog[], number]> {
    const existingShop = await this.getShopWithUserWithoutDeletedById(id);
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
    });
  }

  async getCategoriesForCustomer(
    id: string,
    take: number,
    skip: number,
    sort?: Sorting,
    filter?: Filtering,
  ): Promise<[Category[], number]> {
    const existingShop = await this.getShopWithUserWithoutDeletedById(id);
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
    });
    if (!existingShop) throw new NotFoundException('Không tìm thấy cửa hàng phù hợp');
    return existingShop;
  }

  async registerShop(
    userId: string,
    { contractId, isAccepted, name, phone, email, address, licenseImages }: RegisterShopDto,
  ): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Không tìm thấy người dùng phù hợp');
    if (user.shop || user.role === UserRole.SHOP)
      throw new BadRequestException('Người dùng đã có cửa hàng');
    if (!user.isIdentified)
      throw new BadRequestException('Bạn cần xác thực danh tính (SDT) để đăng ký cửa hàng');

    if (!isAccepted)
      throw new BadRequestException('Bạn cần đồng ý với điều khoản để đăng ký cửa hàng');

    const newShop = await this.shopRepository.save({
      user: { id: userId },
      contract: { id: contractId },
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

  async getShopsForStaff(
    take: number,
    skip: number,
    sort?: Sorting,
    filter?: Filtering,
  ): Promise<[Shop[], number]> {
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

  async getShopForStaff(id: string): Promise<Shop> {
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
    return existingShop;
  }

  async reviewShopRegister(id: string, { isApproved, rejectReason }: ReviewShopDto): Promise<void> {
    const existingShop = await this.shopRepository.findOne({
      where: { id },
      withDeleted: true,
      relations: { license: true },
    });
    if (!existingShop) throw new NotFoundException('Không tìm thấy cửa hàng phù hợp');
    if (!existingShop.license)
      throw new NotFoundException('Không tìm thấy giấy phép kinh doanh của cửa hàng');
    if (existingShop.status !== ShopStatus.PENDING)
      throw new BadRequestException('Cửa hàng không ở trạng thái chờ duyệt');

    if (isApproved) {
      await this.shopRepository.update(existingShop.id, {
        status: ShopStatus.ACTIVE,
        isVerified: true,
      });

      await this.licenseRepository.update(existingShop.license.id, {
        status: LicenseStatus.APPROVED,
      });

      await this.userRepository.update({ shop: existingShop }, { role: UserRole.SHOP });

      const subscription = await this.subscriptionRepository.findOne({ where: { duration: 7 } });
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

  async getShopWithUserWithoutDeletedById(id: string): Promise<Shop> {
    const existingShop = await this.shopRepository.findOne({
      where: { id },
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
}
