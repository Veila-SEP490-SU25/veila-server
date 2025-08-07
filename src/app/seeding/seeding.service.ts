import { AccessoryService } from '@/app/accessory';
import { BlogService } from '@/app/blog';
import { CategoryService } from '@/app/category';
import { ContractService } from '@/app/contract';
import { DressService } from '@/app/dress';
import { FeedbackService } from '@/app/feedback';
import { MembershipService } from '@/app/membership';
import { MilestoneService } from '@/app/milestone';
import { OrderService } from '@/app/order';
import { OrderAccessoriesDetailsService } from '@/app/order-accessories-details';
import { OrderDressDetailsService } from '@/app/order-dress-details';
import { PasswordService } from '@/app/password';
import { RequestService } from '@/app/request';
import { ServiceService } from '@/app/service';
import { ShopService } from '@/app/shop';
import { SubscriptionService } from '@/app/subscription';
import { UpdateRequestService } from '@/app/update-request';
import { TaskService } from '@/app/task';
import { TransactionService } from '@/app/transaction';
import { UserService } from '@/app/user';
import { WalletService } from '@/app/wallet';
import {
  Accessory,
  AccessoryStatus,
  Blog,
  BlogStatus,
  Category,
  CategoryType,
  Contract,
  ContractStatus,
  ContractType,
  Dress,
  DressStatus,
  Feedback,
  License,
  LicenseStatus,
  Membership,
  MembershipStatus,
  Request,
  RequestStatus,
  Milestone,
  MilestoneStatus,
  Order,
  OrderAccessoryDetail,
  OrderDressDetail,
  OrderStatus,
  OrderType,
  Service,
  ServiceStatus,
  Shop,
  ShopStatus,
  Subscription,
  Task,
  TaskStatus,
  Transaction,
  TransactionStatus,
  TransactionType,
  TypeBalance,
  User,
  UserRole,
  UserStatus,
  Wallet,
} from '@/common/models';
import { Faker, faker, vi } from '@faker-js/faker';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SeedingService implements OnModuleInit {
  private readonly logger = new Logger(SeedingService.name, {
    timestamp: true,
  });

  private readonly customFaker: Faker;

  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly passwordService: PasswordService,
    private readonly accessoryService: AccessoryService,
    private readonly blogService: BlogService,
    private readonly categoryService: CategoryService,
    private readonly dressService: DressService,
    private readonly serviceService: ServiceService,
    private readonly shopService: ShopService,
    private readonly contractService: ContractService,
    private readonly subscriptionService: SubscriptionService,
    private readonly walletService: WalletService,
    private readonly membershipService: MembershipService,
    private readonly requestService: RequestService,
    private readonly updateRequestService: UpdateRequestService,
    private readonly orderService: OrderService,
    private readonly orderAccessoriesDetailsService: OrderAccessoriesDetailsService,
    private readonly orderDressDetailsService: OrderDressDetailsService,
    private readonly milestoneService: MilestoneService,
    private readonly taskService: TaskService,
    private readonly transactionService: TransactionService,
    private readonly feedbackService: FeedbackService,
  ) {
    // Khởi tạo faker với locale tiếng Việt
    this.customFaker = new Faker({
      locale: vi,
    });
  }

  async onModuleInit() {
    this.logger.log('Seeding module initialized. Starting seeding process...');
    Promise.all([await this.seedContracts(), await this.seedSubscriptions()])
      .then(async () => {
        await this.seedUsersRoleCustomer();
        await this.seedUsersRoleShop();
        await this.seedSystemAccounts();
      })
      .then(async () => {
        await this.seedShops();
        await this.seedCategories();
        await this.seedWallets();
      })
      .then(async () => {
        await this.seedMemberships();
        await this.seedDresses();
        await this.seedServices();
        await this.seedAccessories();
        await this.seedBlogs();
        await this.seedLicenses();
      })
      .then(async () => {
        await this.seedSubmitRequests();
        await this.seedSellOrders();
        await this.seedRentOrders();
      })
      .then(async () => {
        await this.seedFeedbacks();
      });
  }

  private async seedContracts() {
    const contracts = await this.contractService.findAll();
    if (contracts.length >= 2) {
      this.logger.log(`Enough data available for contract. Skipping seeding`);
      return;
    }
    try {
      const shopContractContent = `# ĐIỀU KHOẢN DỊCH VỤ DÀNH CHO CỬA HÀNG

## 1. ĐIỀU KHOẢN CHUNG
### 1.1. Phạm vi áp dụng
- Điều khoản này áp dụng cho tất cả cửa hàng kinh doanh trên nền tảng Veila
- Bằng việc đăng ký và sử dụng dịch vụ, cửa hàng đồng ý tuân thủ toàn bộ điều khoản

### 1.2. Định nghĩa
- "Nền tảng" là website và ứng dụng Veila
- "Cửa hàng" là đối tác cung cấp váy cưới, phụ kiện và dịch vụ
- "Khách hàng" là người sử dụng dịch vụ trên nền tảng

## 2. QUYỀN VÀ NGHĨA VỤ CỦA CỬA HÀNG
### 2.1. Quyền lợi
- Được tiếp cận nguồn khách hàng tiềm năng từ nền tảng
- Được quản lý cửa hàng và sản phẩm qua hệ thống quản lý chuyên nghiệp
- Được hỗ trợ kỹ thuật và tư vấn từ đội ngũ Veila

### 2.2. Nghĩa vụ
- Cung cấp thông tin doanh nghiệp chính xác và đầy đủ giấy tờ pháp lý
- Đảm bảo chất lượng sản phẩm và dịch vụ như cam kết
- Xử lý đơn hàng và khiếu nại của khách hàng kịp thời
- Tuân thủ chính sách giá và quy định của nền tảng

## 3. QUY ĐỊNH VỀ TÀI CHÍNH
### 3.1. Phí dịch vụ
- Phí hoa hồng: 5-10% tùy loại sản phẩm/dịch vụ
- Phí quảng cáo: Theo gói dịch vụ đăng ký
- Phí giao dịch: Theo quy định của đối tác thanh toán

### 3.2. Thanh toán và đối soát
- Chu kỳ đối soát: 2 tuần/lần
- Thời gian thanh toán: Trong vòng 3 ngày làm việc sau đối soát
- Phương thức: Chuyển khoản qua ngân hàng đăng ký

## 4. CHÍNH SÁCH VẬN HÀNH
### 4.1. Quản lý sản phẩm
- Cập nhật thông tin và tình trạng sản phẩm thường xuyên
- Đảm bảo hình ảnh sản phẩm chân thực
- Niêm yết giá rõ ràng và nhất quán

### 4.2. Xử lý đơn hàng
- Phản hồi đơn hàng trong vòng 24h
- Thời gian chuẩn bị hàng: 1-3 ngày
- Báo cáo khi có sự cố hoặc chậm trễ

## 5. CHÍNH SÁCH CHẤT LƯỢNG
### 5.1. Tiêu chuẩn dịch vụ
- Đảm bảo chất lượng sản phẩm như mô tả
- Thái độ phục vụ chuyên nghiệp
- Tuân thủ lịch hẹn và thời gian

### 5.2. Xử lý khiếu nại
- Tiếp nhận và phản hồi khiếu nại trong 24h
- Đề xuất phương án giải quyết trong 48h
- Chịu trách nhiệm bồi thường theo thỏa thuận

## 6. VI PHẠM VÀ XỬ LÝ
### 6.1. Các hành vi vi phạm
- Cung cấp thông tin sai lệch
- Từ chối đơn hàng không có lý do
- Vi phạm cam kết chất lượng
- Có hành vi gian lận

### 6.2. Hình thức xử lý
- Cảnh báo và yêu cầu khắc phục
- Tạm ngừng hoạt động cửa hàng
- Chấm dứt hợp đồng và yêu cầu bồi thường

## 7. HIỆU LỰC VÀ THAY ĐỔI
- Điều khoản có hiệu lực từ ngày ký kết
- Veila có quyền điều chính với thông báo trước 30 ngày
- Cửa hàng có quyền chấm dứt hợp đồng với thông báo trước 60 ngày`;

      const customerContractContent = `# ĐIỀU KHOẢN DỊCH VỤ CHO KHÁCH HÀNG

## 1. ĐIỀU KHOẢN CHUNG
### 1.1. Phạm vi áp dụng
- Điều khoản này áp dụng cho tất cả khách hàng sử dụng dịch vụ trên nền tảng Veila.
- Bằng việc sử dụng dịch vụ, khách hàng đồng ý với toàn bộ điều khoản được nêu.

### 1.2. Định nghĩa
- "Nền tảng" là website và ứng dụng Veila
- "Dịch vụ" bao gồm thuê/mua váy cưới, phụ kiện và các dịch vụ đi kèm
- "Khách hàng" là người sử dụng dịch vụ trên nền tảng

## 2. QUYỀN VÀ NGHĨA VỤ CỦA KHÁCH HÀNG
### 2.1. Quyền lợi
- Được tiếp cận và sử dụng tất cả dịch vụ trên nền tảng
- Được bảo vệ thông tin cá nhân theo chính sách bảo mật
- Được hỗ trợ 24/7 từ đội ngũ chăm sóc khách hàng

### 2.2. Nghĩa vụ
- Cung cấp thông tin chính xác khi đăng ký và sử dụng dịch vụ
- Thanh toán đầy đủ và đúng hạn các khoản phí dịch vụ
- Bảo quản sản phẩm thuê theo hướng dẫn của nhà cung cấp

## 3. QUY ĐỊNH VỀ THANH TOÁN
### 3.1. Phương thức thanh toán
- Thanh toán qua ví điện tử Veila
- Chuyển khoản ngân hàng
- Tiền mặt (với một số dịch vụ)

### 3.2. Đặt cọc và hoàn trả
- Đặt cọc tối thiểu 30% giá trị đơn hàng
- Hoàn trả trong vòng 48h nếu hủy đơn trước 7 ngày

## 4. CHÍNH SÁCH HỦY VÀ HOÀN TIỀN
### 4.1. Điều kiện hủy đơn
- Hủy miễn phí trước 7 ngày
- Phí hủy 50% tiền cọc nếu hủy trong vòng 3-7 ngày
- Không hoàn cọc nếu hủy trong vòng 72h

### 4.2. Hoàn tiền
- Hoàn 100% nếu lỗi từ nhà cung cấp
- Theo chính sách hủy đơn với các trường hợp khác

## 5. GIẢI QUYẾT TRANH CHẤP
### 5.1. Quy trình khiếu nại
- Gửi khiếu nại qua nền tảng trong vòng 48h
- Cung cấp đầy đủ bằng chứng liên quan
- Thời gian xử lý tối đa 7 ngày làm việc

### 5.2. Phương thức giải quyết
- Thương lượng trực tiếp
- Hòa giải qua nền tảng
- Theo quy định pháp luật hiện hành

## 6. HIỆU LỰC VÀ THAY ĐỔI
- Điều khoản có hiệu lực từ ngày khách hàng đồng ý
- Veila có quyền cập nhật điều khoản với thông báo trước 30 ngày
- Khách hàng tiếp tục sử dụng dịch vụ đồng nghĩa với việc chấp nhận điều khoản mới`;
      Promise.all([
        await this.seedContract(ContractType.CUSTOMER, customerContractContent),
        await this.seedContract(ContractType.SHOP, shopContractContent),
      ]);
      this.logger.log('Seeding process completed successfully!');
    } catch (error) {
      this.logger.error('Seeding process failed.', error);
      throw new Error('Seeding process failed.');
    }
  }

  private async seedContract(type: ContractType, content: string) {
    this.logger.log(`Seeding contract with type: ${type}`);

    const existingContract = await this.contractService.findOne(type);
    if (existingContract) {
      this.logger.warn(`Contract with type ${type} already exists. Skipping seeding.`);
      return;
    }

    const newContract = {
      title: `Hợp đồng ${type}`,
      content,
      contractType: type,
      effectiveFrom: new Date(),
      status: ContractStatus.ACTIVE,
    } as Contract;

    await this.contractService.create(newContract);
    this.logger.log(`Contract of type ${type} created successfully!`);
  }

  private async seedSubscriptions() {
    const subscriptions = await this.subscriptionService.findAll();
    if (subscriptions.length >= 3) {
      this.logger.log(`Enough data available for subscription. Skipping seeding`);
      return;
    }
    try {
      Promise.all([
        await this.seedSubscription(7),
        await this.seedSubscription(30),
        await this.seedSubscription(365),
      ]);
      this.logger.log('Seeding process completed successfully!');
    } catch (error) {
      this.logger.error('Seeding process failed.', error);
      throw new Error('Seeding process failed.');
    }
  }

  private async seedSubscription(duration: number) {
    this.logger.log(`Seeding subscription with duration: ${duration} days`);

    const existingSubscription = await this.subscriptionService.findOneByDuration(duration);
    if (existingSubscription) {
      this.logger.warn(
        `Subscription with duration ${duration} days already exists. Skipping seeding.`,
      );
      return;
    }

    const newSubscription = {
      name: `Gói ${duration} ngày`,
      description: `Gói dịch vụ kéo dài ${duration} ngày`,
      duration,
      amount: this.customFaker.number.int({ min: 1000, max: 10000 }),
    } as Subscription;

    await this.subscriptionService.create(newSubscription);
    this.logger.log(`Subscription of ${duration} days created successfully!`);
  }

  private async seedUsersRoleShop() {
    const customers = await this.userService.getAll();
    if (customers.filter((c) => c.role === UserRole.SHOP).length >= 5) {
      this.logger.log(`Enough data available for shop user. Skipping seeding`);
      return;
    }
    try {
      await Promise.all([
        await this.seedAccounts('shop.1@veila.studio', UserRole.SHOP),
        await this.seedAccounts('shop.2@veila.studio', UserRole.SHOP),
        await this.seedAccounts('shop.3@veila.studio', UserRole.SHOP),
        await this.seedAccounts('shop.4@veila.studio', UserRole.SHOP),
        await this.seedAccounts('shop.5@veila.studio', UserRole.SHOP),
      ]);
      this.logger.log('Seeding process completed successfully!');
    } catch (error) {
      this.logger.error('Seeding process failed.', error);
      throw new Error('Seeding process failed.');
    }
  }

  private async seedUsersRoleCustomer() {
    const customers = await this.userService.getAll();
    if (customers.filter((c) => c.role === UserRole.CUSTOMER).length >= 5) {
      this.logger.log(`Enough data available for customer user. Skipping seeding`);
      return;
    }
    try {
      await Promise.all([
        await this.seedAccounts('customer.1@veila.studio', UserRole.CUSTOMER),
        await this.seedAccounts('customer.2@veila.studio', UserRole.CUSTOMER),
        await this.seedAccounts('customer.3@veila.studio', UserRole.CUSTOMER),
        await this.seedAccounts('customer.4@veila.studio', UserRole.CUSTOMER),
        await this.seedAccounts('customer.5@veila.studio', UserRole.CUSTOMER),
      ]);
      this.logger.log('Seeding process completed successfully!');
    } catch (error) {
      this.logger.error('Seeding process failed.', error);
      throw new Error('Seeding process failed.');
    }
  }

  private async seedSystemAccounts() {
    const superAdminEmail = this.configService.get<string>('SEED_SUPER_ADMIN_EMAIL');
    const adminEmail = this.configService.get<string>('SEED_ADMIN_EMAIL');
    const systemOperatorEmail = this.configService.get<string>('SEED_SYSTEM_OPERATOR_EMAIL');

    if (!superAdminEmail || !adminEmail || !systemOperatorEmail) {
      this.logger.error(
        'SEED_SUPER_ADMIN_EMAIL, SEED_ADMIN_EMAIL, or SEED_SYSTEM_OPERATOR_EMAIL is not set in the environment variables.',
      );
      throw new Error(
        'SEED_SUPER_ADMIN_EMAIL, SEED_ADMIN_EMAIL, or SEED_SYSTEM_OPERATOR_EMAIL is not set in the environment variables.',
      );
    }

    try {
      await Promise.all([
        this.seedAccounts(superAdminEmail, UserRole.SUPER_ADMIN),
        this.seedAccounts(adminEmail, UserRole.ADMIN),
        this.seedAccounts(systemOperatorEmail, UserRole.STAFF),
      ]);
      this.logger.log('Seeding process completed successfully!');
    } catch (error) {
      this.logger.error('Seeding process failed.', error);
      throw new Error('Seeding process failed.');
    }
  }

  private generateVietnameseUsername(fullName: string, role: UserRole): string {
    // Chuyển đổi tên tiếng Việt thành username không dấu
    const normalizedName = fullName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9]/g, '');

    // Tạo username theo format: tên_không_dấu + role + số ngẫu nhiên 3 chữ số
    const randomSuffix = this.customFaker.number.int({ min: 100, max: 999 });
    // Đảm bảo username có độ dài tối đa 32 ký tự
    let username = `${normalizedName}_${role.toLowerCase()}_${randomSuffix}`;
    if (username.length > 32) {
      username = username.slice(0, 32);
    }
    // Đảm bảo tối thiểu 6 ký tự
    if (username.length < 6) {
      username = username.padEnd(6, '0');
    }
    return username;
  }

  private async seedAccounts(email: string, role: UserRole) {
    this.logger.log(`Seeding account with email: ${email}`);

    const existingUser = await this.userService.getByEmail(email);
    if (existingUser) {
      this.logger.warn(`Account with email ${email} already exists. Skipping seeding.`);
      return;
    }

    const contract = await this.contractService.findOne(ContractType.CUSTOMER);
    if (!contract) {
      this.logger.warn(`Contract for type ${ContractType.CUSTOMER} not found. Skipping seeding.`);
      return;
    }

    const defaultPassword = this.configService.get<string>('SEED_ACCOUNT_PASSWORD');
    if (!defaultPassword) {
      this.logger.error('SEED_ACCOUNT_PASSWORD is not set in the environment variables.');
      throw new Error('SEED_ACCOUNT_PASSWORD is not set in the environment variables.');
    }

    // Tạo thông tin cá nhân giả
    const sex = Math.random() < 0.5 ? 'male' : 'female';
    const fullName = this.customFaker.person.fullName({ sex });
    const nameParts = fullName.split(' ');
    const firstName = nameParts.pop() || '';
    const lastName = nameParts.shift() || '';
    const middleName = nameParts.length > 0 ? nameParts.join(' ') : null;

    // Tạo user mới với thông tin đầy đủ
    const newUser = {
      email,
      username: this.generateVietnameseUsername(fullName, role),
      password: await this.passwordService.hashPassword(defaultPassword),
      role,
      firstName,
      middleName,
      lastName,
      phone: email.includes('customer.')
        ? `+84${this.customFaker.string.numeric(1)}00${email.charAt(9)}${this.customFaker.string.numeric(5)}`
        : email.includes('shop.')
          ? `+84${this.customFaker.string.numeric(1)}11${email.charAt(5)}${this.customFaker.string.numeric(5)}`
          : email.includes('admin')
            ? `+84${this.customFaker.string.numeric(1)}22${this.customFaker.string.numeric(6)}`
            : email.includes('staff')
              ? `+84${this.customFaker.string.numeric(1)}33${this.customFaker.string.numeric(6)}`
              : email.includes('super.admin')
                ? `+84${this.customFaker.string.numeric(1)}44${this.customFaker.string.numeric(6)}`
                : null,
      address: this.customFaker.datatype.boolean()
        ? `${faker.location.streetAddress()}, ${faker.location.city()}`
        : null,
      birthDate: this.customFaker.datatype.boolean()
        ? this.customFaker.date.between({ from: '1980-01-01', to: '2000-12-31' })
        : null,
      avatarUrl: this.customFaker.datatype.boolean()
        ? this.customFaker.image.url({ width: 200, height: 200 })
        : null,
      coverUrl: this.customFaker.datatype.boolean()
        ? this.customFaker.image.url({ width: 1200, height: 400 })
        : null,
      status: UserStatus.ACTIVE,
      isVerified: true,
      isIdentified: true,
      images: null,
      contract,
    } as User;

    const createdUser = await this.userService.createUser(newUser);
    this.logger.log(
      `Account created successfully! Email: ${email}, Username: ${createdUser.username}, Role: ${role}`,
    );
  }

  private async seedShops() {
    const shops = await this.shopService.getAll();
    if (shops.length >= 5) {
      this.logger.log(`Enough data available for shop. Skipping seeding`);
      return;
    }
    try {
      Promise.all([
        await this.seedShop(1),
        await this.seedShop(2),
        await this.seedShop(3),
        await this.seedShop(4),
        await this.seedShop(5),
      ]);
      this.logger.log('Seeding process completed successfully!');
    } catch (error) {
      this.logger.error('Seeding process failed.', error);
      throw new Error('Seeding process failed.');
    }
  }

  private async seedShop(shopNumber: number) {
    const user = await this.userService.getByEmail(`shop.${shopNumber}@veila.studio`);
    if (!user) {
      this.logger.warn(`User role Shop ${shopNumber} not exists. Skipping seeding shop.`);
      return;
    }
    const contract = await this.contractService.findOne(ContractType.SHOP);
    if (!contract) {
      this.logger.warn(`Contract for type ${ContractType.SHOP} not found. Skipping seeding shop.`);
      return;
    }
    this.logger.log(`Seeding shop with email: ${user.email}`);

    const newShop = {
      user,
      name: faker.company.name(),
      phone: `+84${this.customFaker.string.numeric({ length: 9 })}`,
      email: faker.internet.email(),
      address: `${faker.location.streetAddress()}, ${faker.location.city()}`,
      description: faker.company.name(),
      logoUrl: this.customFaker.image.avatar(),
      coverUrl: this.customFaker.image.url(),
      status: ShopStatus.ACTIVE,
      isVerified: true,
      contract,
    } as Shop;

    const createShop = await this.shopService.create(newShop);
    this.logger.log(
      `Shop created successfully! Owner's Email: ${user.email}, Name: ${createShop.name}`,
    );
  }

  private async seedCategories() {
    const categories = await this.categoryService.getAll();
    if (categories.length >= 20) {
      this.logger.log(`Enough data available for category. Skipping seeding`);
      return;
    }
    try {
      Promise.all([
        await this.seedCategory(1, CategoryType.ACCESSORY),
        await this.seedCategory(2, CategoryType.ACCESSORY),
        await this.seedCategory(3, CategoryType.ACCESSORY),
        await this.seedCategory(4, CategoryType.ACCESSORY),
        await this.seedCategory(5, CategoryType.ACCESSORY),
        await this.seedCategory(1, CategoryType.SERVICE),
        await this.seedCategory(2, CategoryType.SERVICE),
        await this.seedCategory(3, CategoryType.SERVICE),
        await this.seedCategory(4, CategoryType.SERVICE),
        await this.seedCategory(5, CategoryType.SERVICE),
        await this.seedCategory(1, CategoryType.DRESS),
        await this.seedCategory(2, CategoryType.DRESS),
        await this.seedCategory(3, CategoryType.DRESS),
        await this.seedCategory(4, CategoryType.DRESS),
        await this.seedCategory(5, CategoryType.DRESS),
        await this.seedCategory(1, CategoryType.BLOG),
        await this.seedCategory(2, CategoryType.BLOG),
        await this.seedCategory(3, CategoryType.BLOG),
        await this.seedCategory(4, CategoryType.BLOG),
        await this.seedCategory(5, CategoryType.BLOG),
      ]);
      this.logger.log('Seeding process completed successfully!');
    } catch (error) {
      this.logger.error('Seeding process failed.', error);
      throw new Error('Seeding process failed.');
    }
  }

  private async seedCategory(shopNumber: number, type: CategoryType) {
    const user = await this.userService.getByEmail(`shop.${shopNumber}@veila.studio`);
    if (!user) {
      this.logger.warn(`User role Shop ${shopNumber} not exists. Skipping seeding category.`);
      return;
    }
    this.logger.log(`Seeding category with email: ${user.email}`);

    const newCategory = {
      user,
      type,
      name: type.toString().toLowerCase(),
      description: type.toString(),
    } as Category;

    const createdCategory = await this.categoryService.create(newCategory);
    this.logger.log(
      `Category created successfully! Owner's Email: ${user.email}, Name: ${createdCategory.name}`,
    );
  }

  private async seedWallets() {
    const wallets = await this.walletService.findAll();
    if (wallets.length >= 13) {
      this.logger.log(`Enough data available for wallet. Skipping seeding`);
      return;
    }

    try {
      Promise.all([
        await this.seedWallet('super.admin@veila.studio'),
        await this.seedWallet('admin@veila.studio'),
        await this.seedWallet('staff@veila.studio'),
        await this.seedWallet('customer.1@veila.studio'),
        await this.seedWallet('customer.2@veila.studio'),
        await this.seedWallet('customer.3@veila.studio'),
        await this.seedWallet('customer.4@veila.studio'),
        await this.seedWallet('customer.5@veila.studio'),
        await this.seedWallet('shop.1@veila.studio'),
        await this.seedWallet('shop.2@veila.studio'),
        await this.seedWallet('shop.3@veila.studio'),
        await this.seedWallet('shop.4@veila.studio'),
        await this.seedWallet('shop.5@veila.studio'),
      ]);
      this.logger.log('Seeding process completed successfully!');
    } catch (error) {
      this.logger.error('Seeding wallets failed.', error);
      throw new Error('Seeding wallets failed.');
    }
  }

  private async seedWallet(email: string) {
    this.logger.log(`Seeding wallet with email: ${email}`);

    const user = await this.userService.getByEmail(email);
    if (!user) {
      this.logger.warn(`User with email ${email} not found. Skipping seeding wallet.`);
      return;
    }

    const existingWallet = await this.walletService.findOneByUserId(user.id);
    if (existingWallet) {
      this.logger.warn(`Wallet for user ${user.email} already exists. Skipping seeding.`);
      return;
    }

    const newWallet = {
      user,
      availableBalance: this.customFaker.number.float({ min: 1000, max: 10000, fractionDigits: 2 }),
      lockedBalance: this.customFaker.number.float({ min: 0, max: 1000, fractionDigits: 2 }),
    } as Wallet;

    await this.walletService.create(newWallet);
    this.logger.log(`Wallet created successfully for user: ${user.email}`);
  }

  private async seedMemberships() {
    const memberships = await this.membershipService.findAll();
    if (memberships.length >= 5) {
      this.logger.log(`Enough data available for membership. Skipping seeding`);
      return;
    }
    try {
      Promise.all([
        await this.seedMembership(1, 30),
        await this.seedMembership(2, 30),
        await this.seedMembership(3, 7),
        await this.seedMembership(4, 365),
        await this.seedMembership(5, 7),
      ]);
      this.logger.log('Seeding process completed successfully!');
    } catch (error) {
      this.logger.error('Seeding process failed.', error);
      throw new Error('Seeding process failed.');
    }
  }

  private async seedMembership(shopNumber: number, subscriptionDuration: number) {
    this.logger.log(`Seeding membership for shop ${shopNumber}`);

    const shop = await this.shopService.getByUserEmail(`shop.${shopNumber}@veila.studio`);
    if (!shop) {
      this.logger.warn(`Shop with email ${shopNumber} not found. Skipping seeding membership.`);
      return;
    }
    const existingMembership = await this.membershipService.findOne(shop.id);
    if (existingMembership) {
      this.logger.warn(`Membership for shop ${shop.name} already exists. Skipping seeding.`);
      return;
    }
    const subscription = await this.subscriptionService.findOneByDuration(subscriptionDuration);
    if (!subscription) {
      this.logger.warn(
        `Subscription with duration ${subscriptionDuration} days not found. Skipping seeding membership.`,
      );
      return;
    }
    this.logger.log(`Seeding membership for shop: ${shop.name}`);
    const newMembership = {
      shop,
      subscription,
      startDate: new Date(),
      endDate: this.customFaker.date.soon({ days: subscriptionDuration }),
      status: MembershipStatus.ACTIVE,
    } as Membership;
    await this.membershipService.create(newMembership);
    this.logger.log(
      `Membership created successfully for shop: ${shop.name}, Subscription Duration: ${subscriptionDuration} days`,
    );
  }

  private async seedDresses() {
    const dresses = await this.dressService.getAll();
    if (dresses.length >= 25) {
      this.logger.log(`Enough data available for dress. Skipping seeding`);
      return;
    }
    try {
      Promise.all([
        await this.seedDress(1),
        await this.seedDress(1),
        await this.seedDress(1),
        await this.seedDress(1),
        await this.seedDress(1),
        await this.seedDress(2),
        await this.seedDress(2),
        await this.seedDress(2),
        await this.seedDress(2),
        await this.seedDress(2),
        await this.seedDress(3),
        await this.seedDress(3),
        await this.seedDress(3),
        await this.seedDress(3),
        await this.seedDress(3),
        await this.seedDress(4),
        await this.seedDress(4),
        await this.seedDress(4),
        await this.seedDress(4),
        await this.seedDress(4),
        await this.seedDress(5),
        await this.seedDress(5),
        await this.seedDress(5),
        await this.seedDress(5),
        await this.seedDress(5),
      ]);
      this.logger.log('Seeding process completed successfully!');
    } catch (error) {
      this.logger.error('Seeding process failed.', error);
      throw new Error('Seeding process failed.');
    }
  }

  private async seedDress(shopNumber: number) {
    const user = await this.userService.getByEmail(`shop.${shopNumber}@veila.studio`);
    if (!user) {
      this.logger.warn(`User role Shop ${shopNumber} not exists. Skipping seeding dress.`);
      return;
    }
    const category = await this.categoryService.getOneByUserAndType(user.id, CategoryType.DRESS);
    if (!category) {
      this.logger.warn(`User category ${shopNumber} not exists`);
    }

    this.logger.log(`Seeding dress with email: ${user.email}`);

    const newDress = {
      user,
      category,
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      sellPrice: this.customFaker.number.float({ min: 100, max: 1000, fractionDigits: 2 }),
      rentalPrice: this.customFaker.number.float({ min: 20, max: 200, fractionDigits: 2 }),
      isSellable: true,
      isRentable: true,
      ratingAverage: this.customFaker.number.float({ min: 3, max: 5, fractionDigits: 2 }),
      ratingCount: this.customFaker.number.int({ min: 0, max: 100 }),
      status: DressStatus.AVAILABLE,
    } as Dress;

    const createDress = await this.dressService.create(newDress);
    this.logger.log(
      `Dress created successfully! Owner's Email: ${user.email}, Title: ${createDress.name}`,
    );
  }

  private async seedServices() {
    const services = await this.serviceService.getAll();
    if (services.length >= 5) {
      this.logger.log(`Enough data available for service. Skipping seeding`);
      return;
    }
    try {
      Promise.all([
        await this.seedService(1),
        await this.seedService(2),
        await this.seedService(3),
        await this.seedService(4),
        await this.seedService(5),
      ]);
      this.logger.log('Seeding process completed successfully!');
    } catch (error) {
      this.logger.error('Seeding process failed.', error);
      throw new Error('Seeding process failed.');
    }
  }

  private async seedService(shopNumber: number) {
    const user = await this.userService.getByEmail(`shop.${shopNumber}@veila.studio`);
    if (!user) {
      this.logger.warn(`User role Shop ${shopNumber} not exists. Skipping seeding service.`);
      return;
    }
    const category = await this.categoryService.getOneByUserAndType(user.id, CategoryType.SERVICE);
    if (!category) {
      this.logger.warn(`User category ${shopNumber} not exists`);
    }

    this.logger.log(`Seeding service with email: ${user.email}`);

    const newService = {
      user,
      category,
      name: 'Dịch vụ máy váy cưới mới',
      description: 'Mô tả dịch vụ máy váy cưới mới',
      status: ServiceStatus.AVAILABLE,
      ratingAverage: this.customFaker.number.float({ min: 3, max: 5, fractionDigits: 2 }),
      ratingCount: this.customFaker.number.int({ min: 0, max: 100 }),
    } as Service;

    const createService = await this.serviceService.create(newService);
    this.logger.log(
      `Service created successfully! Owner's Email: ${user.email}, Name: ${createService.name}`,
    );
  }

  private async seedAccessories() {
    const accessories = await this.accessoryService.getAll();
    if (accessories.length >= 25) {
      this.logger.log(`Enough data available for accessory. Skipping seeding`);
      return;
    }
    try {
      Promise.all([
        await this.seedAccessory(1),
        await this.seedAccessory(1),
        await this.seedAccessory(1),
        await this.seedAccessory(1),
        await this.seedAccessory(1),
        await this.seedAccessory(2),
        await this.seedAccessory(2),
        await this.seedAccessory(2),
        await this.seedAccessory(2),
        await this.seedAccessory(2),
        await this.seedAccessory(3),
        await this.seedAccessory(3),
        await this.seedAccessory(3),
        await this.seedAccessory(3),
        await this.seedAccessory(3),
        await this.seedAccessory(4),
        await this.seedAccessory(4),
        await this.seedAccessory(4),
        await this.seedAccessory(4),
        await this.seedAccessory(4),
        await this.seedAccessory(5),
        await this.seedAccessory(5),
        await this.seedAccessory(5),
        await this.seedAccessory(5),
        await this.seedAccessory(5),
      ]);
      this.logger.log('Seeding process completed successfully!');
    } catch (error) {
      this.logger.error('Seeding process failed.', error);
      throw new Error('Seeding process failed.');
    }
  }

  private async seedAccessory(shopNumber: number) {
    const user = await this.userService.getByEmail(`shop.${shopNumber}@veila.studio`);
    if (!user) {
      this.logger.warn(`User role Shop ${shopNumber} not exists. Skipping seeding accessory.`);
      return;
    }
    const category = await this.categoryService.getOneByUserAndType(
      user.id,
      CategoryType.ACCESSORY,
    );
    if (!category) {
      this.logger.warn(`User category ${shopNumber} not exists`);
    }

    this.logger.log(`Seeding accessory with email: ${user.email}`);

    const newAccessory = {
      user,
      category,
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      sellPrice: this.customFaker.number.float({ min: 10, max: 200, fractionDigits: 2 }),
      rentalPrice: this.customFaker.number.float({ min: 2, max: 50, fractionDigits: 2 }),
      isSellable: true,
      isRentable: true,
      status: AccessoryStatus.AVAILABLE,
    } as Accessory;

    const createdAccessory = await this.accessoryService.create(newAccessory);
    this.logger.log(
      `Accessory created successfully! Owner's Email: ${user.email}, Name: ${createdAccessory.name}`,
    );
  }

  private async seedBlogs() {
    const blogs = await this.blogService.getAll();
    if (blogs.length >= 25) {
      this.logger.log(`Enough data available for blog. Skipping seeding`);
      return;
    }
    try {
      Promise.all([
        await this.seedBlog(1),
        await this.seedBlog(1),
        await this.seedBlog(1),
        await this.seedBlog(1),
        await this.seedBlog(1),
        await this.seedBlog(2),
        await this.seedBlog(2),
        await this.seedBlog(2),
        await this.seedBlog(2),
        await this.seedBlog(2),
        await this.seedBlog(3),
        await this.seedBlog(3),
        await this.seedBlog(3),
        await this.seedBlog(3),
        await this.seedBlog(3),
        await this.seedBlog(4),
        await this.seedBlog(4),
        await this.seedBlog(4),
        await this.seedBlog(4),
        await this.seedBlog(4),
        await this.seedBlog(5),
        await this.seedBlog(5),
        await this.seedBlog(5),
        await this.seedBlog(5),
        await this.seedBlog(5),
      ]);
      this.logger.log('Seeding process completed successfully!');
    } catch (error) {
      this.logger.error('Seeding process failed.', error);
      throw new Error('Seeding process failed.');
    }
  }

  private async seedBlog(shopNumber: number) {
    const user = await this.userService.getByEmail(`shop.${shopNumber}@veila.studio`);
    if (!user) {
      this.logger.warn(`User role Shop ${shopNumber} not exists. Skipping seeding blog.`);
      return;
    }
    const category = await this.categoryService.getOneByUserAndType(user.id, CategoryType.BLOG);
    if (!category) {
      this.logger.warn(`User category ${shopNumber} not exists`);
    }

    this.logger.log(`Seeding blog with email: ${user.email}`);

    const newBlog = {
      user,
      category,
      title: this.customFaker.lorem.sentence(),
      content: this.customFaker.lorem.paragraphs(2),
      isVerified: true,
      status: BlogStatus.PUBLISHED,
    } as Blog;

    const createBlog = await this.blogService.create(newBlog);
    this.logger.log(
      `Blog created successfully! Owner's Email: ${user.email}, Title: ${createBlog.title}`,
    );
  }

  private async seedLicenses() {
    const licenses = await this.shopService.getAllLicenses();
    if (licenses.length >= 5) {
      this.logger.log(`Enough data available for license. Skipping seeding`);
      return;
    }
    try {
      Promise.all([
        await this.seedLicense(1),
        await this.seedLicense(2),
        await this.seedLicense(3),
        await this.seedLicense(4),
        await this.seedLicense(5),
      ]);
      this.logger.log('Seeding process completed successfully!');
    } catch (error) {
      this.logger.error('Seeding process failed.', error);
      throw new Error('Seeding process failed.');
    }
  }

  private async seedLicense(shopNumber: number) {
    const shop = await this.shopService.getByUserEmail(`shop.${shopNumber}@veila.studio`);
    if (!shop) {
      this.logger.warn(`Shop with email ${shopNumber} not found. Skipping seeding license.`);
      return;
    }
    this.logger.log(`Seeding license for shop: ${shop.name}`);
    const existingLicense = await this.shopService.getLicenseByShopId(shop.id);
    if (existingLicense) {
      this.logger.warn(`License for shop ${shop.name} already exists. Skipping seeding.`);
      return;
    }
    const newLicense = {
      shop,
      status: LicenseStatus.APPROVED,
      images: this.customFaker.datatype.boolean()
        ? this.customFaker.image.url({ width: 800, height: 600 })
        : null,
    } as License;
    await this.shopService.createLicense(newLicense);
    this.logger.log(`License created successfully for shop: ${shop.name}`);
  }

  private async seedSubmitRequests() {
    const requests = await this.requestService.getAllRequestsForSeeding();
    if (requests.length >= 5) {
      this.logger.log(`Enough data available for submit request. Skipping seeding`);
      return;
    }
    try {
      Promise.all([
        await this.seedSubmitRequest(1),
        await this.seedSubmitRequest(2),
        await this.seedSubmitRequest(3),
        await this.seedSubmitRequest(4),
        await this.seedSubmitRequest(5),
      ]);
    } catch (error) {
      this.logger.error('Seeding process failed.', error);
      throw new Error('Seeding process failed.');
    }
  }

  private async seedSubmitRequest(customerNumber: number) {
    const customer = await this.userService.getByEmail(`customer.${customerNumber}@veila.studio`);
    if (!customer) {
      this.logger.warn(
        `Customer with email customer.${customerNumber}@veila.studio not found. Skipping seeding submit request.`,
      );
      return;
    }
    this.logger.log(`Seeding submit request for customer: ${customer.email}`);

    const newRequest = {
      user: customer,
      title: `May váy cưới cho khách hàng ${customerNumber}`,
      description: `May váy cưới đẹp và sang trọng, giá thành từ 100 triệu đồng đổ lại.`,
      high: this.customFaker.number.int({ min: 150, max: 200 }),
      weight: this.customFaker.number.int({ min: 40, max: 80 }),
      bust: this.customFaker.number.int({ min: 70, max: 100 }),
      waist: this.customFaker.number.int({ min: 60, max: 90 }),
      hip: this.customFaker.number.int({ min: 80, max: 110 }),
      armpit: this.customFaker.number.int({ min: 30, max: 50 }),
      bicep: this.customFaker.number.int({ min: 20, max: 40 }),
      neck: this.customFaker.number.int({ min: 30, max: 50 }),
      shoulderWidth: this.customFaker.number.int({ min: 30, max: 50 }),
      sleeveLength: this.customFaker.number.int({ min: 20, max: 40 }),
      backLength: this.customFaker.number.int({ min: 30, max: 50 }),
      lowerWaist: this.customFaker.number.int({ min: 60, max: 90 }),
      waistToFloor: this.customFaker.number.int({ min: 80, max: 120 }),
      dressStyle: 'A-line',
      curtainNeckline: 'V-neck',
      sleeveStyle: 'Long sleeve',
      material: 'Silk',
      color: 'White',
      specialElement: 'Lace',
      coverage: 'Full',
      status: RequestStatus.SUBMIT,
      isPrivate: false,
      images: this.customFaker.datatype.boolean()
        ? this.customFaker.image.url({ width: 800, height: 600 })
        : '',
    } as Request;

    await this.requestService.createRequestForSeeding(newRequest);
    this.logger.log(`Submit request created successfully for customer: ${customer.email}`);
  }

  private async seedSellOrders() {
    const orders = await this.orderService.getAllTypeOrders(OrderType.SELL);
    if (orders.length >= 15) {
      this.logger.log(`Enough sell orders available. Skipping seeding.`);
      return;
    }
    try {
      Promise.all([
        await this.seedSellOrder(1, 1),
        await this.seedSellOrder(2, 1),
        await this.seedSellOrder(3, 1),
        await this.seedSellOrder(4, 1),
        await this.seedSellOrder(5, 1),
        await this.seedSellOrder(1, 2),
        await this.seedSellOrder(2, 2),
        await this.seedSellOrder(3, 2),
        await this.seedSellOrder(4, 2),
        await this.seedSellOrder(5, 2),
        await this.seedSellOrder(1, 3),
        await this.seedSellOrder(2, 3),
        await this.seedSellOrder(3, 3),
        await this.seedSellOrder(4, 3),
        await this.seedSellOrder(5, 3),
      ]);
      this.logger.log('Seeding process completed successfully!');
    } catch (error) {
      this.logger.error('Seeding sell orders failed.', error);
      throw new Error('Seeding sell orders failed.');
    }
  }

  private async seedSellOrder(customerNumber: number, shopNumber: number) {
    const customer = await this.userService.getByEmail(`customer.${customerNumber}@veila.studio`);
    if (!customer) {
      this.logger.warn(
        `Customer with email customer.${customerNumber}@veila.studio not found. Skipping seeding.`,
      );
      return;
    }

    const customerWallet = await this.walletService.findOneByUserId(customer.id);
    if (!customerWallet) {
      this.logger.warn(
        `Wallet for customer ${customer.email} not found. Skipping seeding sell order.`,
      );
      return;
    }

    const shopAccount = await this.userService.getByEmail(`shop.${shopNumber}@veila.studio`);
    if (!shopAccount) {
      this.logger.warn(
        `Shop with email shop.${shopNumber}@veila.studio not found. Skipping seeding.`,
      );
      return;
    }

    const shopWallet = await this.walletService.findOneByUserId(shopAccount.id);
    if (!shopWallet) {
      this.logger.warn(
        `Wallet for shop ${shopAccount.email} not found. Skipping seeding sell order.`,
      );
      return;
    }

    const shop = await this.shopService.getShopByUserId(shopAccount.id);
    if (!shop) {
      this.logger.warn(
        `Shop not found for user ${shopAccount.email}. Skipping seeding sell order.`,
      );
      return;
    }

    const dress = await this.dressService.getOneDressByUserId(shopAccount.id);
    if (!dress) {
      this.logger.warn(
        `No dress found for shop ${shopAccount.email}. Skipping seeding sell order.`,
      );
      return;
    }

    const accessory = await this.accessoryService.getOneAccessoryByUserId(shopAccount.id);
    if (!accessory) {
      this.logger.warn(
        `No accessory found for shop ${shopAccount.email}. Skipping seeding sell order.`,
      );
      return;
    }

    this.logger.log(
      `Seeding sell order for customer: ${customer.email}, shop: ${shopAccount.email}`,
    );

    const newOrder = await this.orderService.createOrderForSeeding({
      customer,
      shop,
      phone: customer.phone || `+84${this.customFaker.string.numeric({ length: 9 })}`,
      email: customer.email,
      address: customer.address || `${faker.location.streetAddress()}, ${faker.location.city()}`,
      dueDate: new Date(),
      returnDate: null,
      isBuyBack: false,
      amount: Number(dress.sellPrice) + Number(accessory.sellPrice),
      type: OrderType.SELL,
      status: OrderStatus.COMPLETED,
    } as Order);

    await this.orderDressDetailsService.createOrderDressDetailForSeeding({
      order: newOrder,
      dress,
      high: this.customFaker.number.int({ min: 1, max: 5 }),
      weight: this.customFaker.number.int({ min: 1, max: 20 }),
      bust: this.customFaker.number.int({ min: 70, max: 120 }),
      waist: this.customFaker.number.int({ min: 60, max: 100 }),
      hip: this.customFaker.number.int({ min: 80, max: 120 }),
      armpit: this.customFaker.number.int({ min: 30, max: 50 }),
      bicep: this.customFaker.number.int({ min: 30, max: 50 }),
      neck: this.customFaker.number.int({ min: 30, max: 50 }),
      shoulderWidth: this.customFaker.number.int({ min: 30, max: 50 }),
      sleeveLength: this.customFaker.number.int({ min: 20, max: 60 }),
      backLength: this.customFaker.number.int({ min: 30, max: 50 }),
      lowerWaist: this.customFaker.number.int({ min: 30, max: 50 }),
      waistToFloor: this.customFaker.number.int({ min: 30, max: 50 }),
      description: 'Mô tả chi tiết về đơn hàng váy cưới',
      price: dress.sellPrice,
      isRated: true,
    } as OrderDressDetail);

    await this.orderAccessoriesDetailsService.createOrderAccessoryDetailForSeeding({
      order: newOrder,
      accessory,
      quantity: 1,
      description: 'Mô tả chi tiết về đơn hàng phụ kiện',
      price: accessory.sellPrice,
      isRated: true,
    } as OrderAccessoryDetail);

    const milestone1 = await this.milestoneService.createMilestoneForSeeding({
      order: newOrder,
      title: 'Chuẩn bị váy cưới',
      description: 'Chuẩn bị váy cưới cho khách hàng',
      index: 1,
      status: MilestoneStatus.COMPLETED,
      dueDate: new Date(),
    } as Milestone);
    await this.taskService.createTaskForSeeding({
      milestone: milestone1,
      title: 'Chuẩn bị mẫu váy cưới',
      description: 'Chuẩn bị mẫu váy cưới khách hàng đã chọn',
      index: 1,
      status: TaskStatus.COMPLETED,
      dueDate: new Date(),
    } as Task);
    await this.taskService.createTaskForSeeding({
      milestone: milestone1,
      title: 'Điều chỉnh váy cưới',
      description: 'Điều chỉnh số đo váy cưới theo yêu cầu khách hàng',
      index: 2,
      status: TaskStatus.COMPLETED,
      dueDate: new Date(),
    } as Task);
    await this.taskService.createTaskForSeeding({
      milestone: milestone1,
      title: 'Kiểm tra váy cưới',
      description: 'Kiểm tra chất lượng váy cưới trước khi giao cho khách hàng',
      index: 3,
      status: TaskStatus.COMPLETED,
      dueDate: new Date(),
    } as Task);

    const milestone2 = await this.milestoneService.createMilestoneForSeeding({
      order: newOrder,
      title: 'Giao váy cưới',
      description: 'Giao váy cưới cho khách hàng',
      index: 2,
      status: MilestoneStatus.COMPLETED,
      dueDate: new Date(),
    } as Milestone);
    await this.taskService.createTaskForSeeding({
      milestone: milestone2,
      title: 'Đóng gói váy cưới',
      description: 'Đóng gói váy cưới cho khách hàng',
      index: 1,
      status: TaskStatus.COMPLETED,
      dueDate: new Date(),
    } as Task);
    await this.taskService.createTaskForSeeding({
      milestone: milestone2,
      title: 'Giao váy cưới',
      description: 'Giao váy cưới cho khách hàng tại địa chỉ đã cung cấp',
      index: 2,
      status: TaskStatus.COMPLETED,
      dueDate: new Date(),
    } as Task);

    await this.transactionService.createTransactionForSeeding({
      wallet: customerWallet,
      order: newOrder,
      from: customer.username,
      to: shopAccount.username,
      fromTypeBalance: TypeBalance.AVAILABLE,
      toTypeBalance: TypeBalance.LOCKED,
      amount: newOrder.amount,
      type: TransactionType.PAYMENT,
      status: TransactionStatus.COMPLETED,
    } as Transaction);
    await this.transactionService.createTransactionForSeeding({
      wallet: shopWallet,
      order: newOrder,
      from: customer.username,
      to: shopAccount.username,
      fromTypeBalance: TypeBalance.AVAILABLE,
      toTypeBalance: TypeBalance.LOCKED,
      amount: newOrder.amount,
      type: TransactionType.PAYMENT,
      status: TransactionStatus.COMPLETED,
    } as Transaction);
    await this.transactionService.createTransactionForSeeding({
      wallet: shopWallet,
      from: shopAccount.username,
      to: shopAccount.username,
      fromTypeBalance: TypeBalance.LOCKED,
      toTypeBalance: TypeBalance.AVAILABLE,
      amount: newOrder.amount,
      type: TransactionType.TRANSFER,
      status: TransactionStatus.COMPLETED,
    } as Transaction);

    this.logger.log(
      `Sell order created successfully! Order ID: ${newOrder.id}, Customer: ${customer.email}, Shop: ${shopAccount.email}`,
    );
  }

  private async seedRentOrders() {
    const orders = await this.orderService.getAllTypeOrders(OrderType.RENT);
    if (orders.length >= 10) {
      this.logger.log(`Enough rent orders available. Skipping seeding.`);
      return;
    }
    try {
      Promise.all([
        await this.seedRentOrder(1, 4),
        await this.seedRentOrder(2, 4),
        await this.seedRentOrder(3, 4),
        await this.seedRentOrder(4, 4),
        await this.seedRentOrder(5, 4),
        await this.seedRentOrder(1, 5),
        await this.seedRentOrder(2, 5),
        await this.seedRentOrder(3, 5),
        await this.seedRentOrder(4, 5),
        await this.seedRentOrder(5, 5),
      ]);
      this.logger.log('Seeding process completed successfully!');
    } catch (error) {
      this.logger.error('Seeding rent orders failed.', error);
      throw new Error('Seeding rent orders failed.');
    }
  }

  private async seedRentOrder(customerNumber: number, shopNumber: number) {
    const customer = await this.userService.getByEmail(`customer.${customerNumber}@veila.studio`);
    if (!customer) {
      this.logger.warn(
        `Customer with email customer.${customerNumber}@veila.studio not found. Skipping rent order seeding.`,
      );
      return;
    }

    const customerWallet = await this.walletService.findOneByUserId(customer.id);
    if (!customerWallet) {
      this.logger.warn(
        `Wallet for customer ${customer.email} not found. Skipping seeding rent order.`,
      );
      return;
    }

    const shopAccount = await this.userService.getByEmail(`shop.${shopNumber}@veila.studio`);
    if (!shopAccount) {
      this.logger.warn(
        `Shop with email shop.${shopNumber}@veila.studio not found. Skipping seeding rent order.`,
      );
      return;
    }

    const shopWallet = await this.walletService.findOneByUserId(shopAccount.id);
    if (!shopWallet) {
      this.logger.warn(
        `Wallet for shop ${shopAccount.email} not found. Skipping seeding rent order.`,
      );
      return;
    }

    const shop = await this.shopService.getShopByUserId(shopAccount.id);
    if (!shop) {
      this.logger.warn(
        `Shop not found for user ${shopAccount.email}. Skipping seeding rent order.`,
      );
      return;
    }

    const dress = await this.dressService.getOneDressByUserId(shopAccount.id);
    if (!dress) {
      this.logger.warn(
        `No dress found for shop ${shopAccount.email}. Skipping seeding sell order.`,
      );
      return;
    }

    const accessory = await this.accessoryService.getOneAccessoryByUserId(shopAccount.id);
    if (!accessory) {
      this.logger.warn(
        `No accessory found for shop ${shopAccount.email}. Skipping seeding sell order.`,
      );
      return;
    }

    this.logger.log(
      `Seeding sell order for customer: ${customer.email}, shop: ${shopAccount.email}`,
    );

    const newOrder = await this.orderService.createOrderForSeeding({
      customer,
      shop,
      phone: customer.phone || `+84${this.customFaker.string.numeric({ length: 9 })}`,
      email: customer.email,
      address: customer.address || `${faker.location.streetAddress()}, ${faker.location.city()}`,
      dueDate: new Date(),
      returnDate: new Date(),
      isBuyBack: false,
      amount: Number(dress.rentalPrice) + Number(accessory.rentalPrice),
      type: OrderType.RENT,
      status: OrderStatus.COMPLETED,
    } as Order);

    await this.orderDressDetailsService.createOrderDressDetailForSeeding({
      order: newOrder,
      dress,
      high: this.customFaker.number.int({ min: 1, max: 5 }),
      weight: this.customFaker.number.int({ min: 1, max: 20 }),
      bust: this.customFaker.number.int({ min: 70, max: 120 }),
      waist: this.customFaker.number.int({ min: 60, max: 100 }),
      hip: this.customFaker.number.int({ min: 80, max: 120 }),
      armpit: this.customFaker.number.int({ min: 30, max: 50 }),
      bicep: this.customFaker.number.int({ min: 30, max: 50 }),
      neck: this.customFaker.number.int({ min: 30, max: 50 }),
      shoulderWidth: this.customFaker.number.int({ min: 30, max: 50 }),
      sleeveLength: this.customFaker.number.int({ min: 20, max: 60 }),
      backLength: this.customFaker.number.int({ min: 30, max: 50 }),
      lowerWaist: this.customFaker.number.int({ min: 30, max: 50 }),
      waistToFloor: this.customFaker.number.int({ min: 30, max: 50 }),
      description: 'Mô tả chi tiết về đơn hàng váy cưới',
      price: dress.sellPrice,
      isRated: true,
    } as OrderDressDetail);

    await this.orderAccessoriesDetailsService.createOrderAccessoryDetailForSeeding({
      order: newOrder,
      accessory,
      quantity: 1,
      description: 'Mô tả chi tiết về đơn hàng phụ kiện',
      price: accessory.sellPrice,
      isRated: true,
    } as OrderAccessoryDetail);

    const milestone1 = await this.milestoneService.createMilestoneForSeeding({
      order: newOrder,
      title: 'Chuẩn bị váy cưới',
      description: 'Chuẩn bị váy cưới cho khách hàng',
      index: 1,
      status: MilestoneStatus.COMPLETED,
      dueDate: new Date(),
    } as Milestone);
    await this.taskService.createTaskForSeeding({
      milestone: milestone1,
      title: 'Chuẩn bị mẫu váy cưới',
      description: 'Chuẩn bị mẫu váy cưới khách hàng đã chọn',
      index: 1,
      status: TaskStatus.COMPLETED,
      dueDate: new Date(),
    } as Task);
    await this.taskService.createTaskForSeeding({
      milestone: milestone1,
      title: 'Điều chỉnh váy cưới',
      description: 'Điều chỉnh số đo váy cưới theo yêu cầu khách hàng',
      index: 2,
      status: TaskStatus.COMPLETED,
      dueDate: new Date(),
    } as Task);
    await this.taskService.createTaskForSeeding({
      milestone: milestone1,
      title: 'Kiểm tra váy cưới',
      description: 'Kiểm tra chất lượng váy cưới trước khi giao cho khách hàng',
      index: 3,
      status: TaskStatus.COMPLETED,
      dueDate: new Date(),
    } as Task);

    const milestone2 = await this.milestoneService.createMilestoneForSeeding({
      order: newOrder,
      title: 'Giao váy cưới',
      description: 'Giao váy cưới cho khách hàng',
      index: 2,
      status: MilestoneStatus.COMPLETED,
      dueDate: new Date(),
    } as Milestone);
    await this.taskService.createTaskForSeeding({
      milestone: milestone2,
      title: 'Đóng gói váy cưới',
      description: 'Đóng gói váy cưới cho khách hàng',
      index: 1,
      status: TaskStatus.COMPLETED,
      dueDate: new Date(),
    } as Task);
    await this.taskService.createTaskForSeeding({
      milestone: milestone2,
      title: 'Giao váy cưới',
      description: 'Giao váy cưới cho khách hàng tại địa chỉ đã cung cấp',
      index: 2,
      status: TaskStatus.COMPLETED,
      dueDate: new Date(),
    } as Task);

    const milestone3 = await this.milestoneService.createMilestoneForSeeding({
      order: newOrder,
      title: 'Trả váy cưới',
      description: 'Khách hàng trả váy cưới sau khi sử dụng',
      index: 3,
      status: MilestoneStatus.COMPLETED,
      dueDate: new Date(),
    } as Milestone);
    await this.taskService.createTaskForSeeding({
      milestone: milestone3,
      title: 'Kiểm tra tình trạng váy cưới',
      description: 'Kiểm tra tình trạng váy cưới sau khi khách hàng trả lại',
      index: 1,
      status: TaskStatus.COMPLETED,
      dueDate: new Date(),
    } as Task);

    await this.transactionService.createTransactionForSeeding({
      wallet: customerWallet,
      order: newOrder,
      from: customer.username,
      to: shopAccount.username,
      fromTypeBalance: TypeBalance.AVAILABLE,
      toTypeBalance: TypeBalance.LOCKED,
      amount: newOrder.amount,
      type: TransactionType.PAYMENT,
      status: TransactionStatus.COMPLETED,
    } as Transaction);
    await this.transactionService.createTransactionForSeeding({
      wallet: customerWallet,
      order: newOrder,
      from: customer.username,
      to: customer.username,
      fromTypeBalance: TypeBalance.AVAILABLE,
      toTypeBalance: TypeBalance.LOCKED,
      amount: Number(newOrder.amount) * 0.5,
      type: TransactionType.TRANSFER,
      status: TransactionStatus.COMPLETED,
    } as Transaction);
    await this.transactionService.createTransactionForSeeding({
      wallet: shopWallet,
      order: newOrder,
      from: customer.username,
      to: shopAccount.username,
      fromTypeBalance: TypeBalance.AVAILABLE,
      toTypeBalance: TypeBalance.LOCKED,
      amount: newOrder.amount,
      type: TransactionType.PAYMENT,
      status: TransactionStatus.COMPLETED,
    } as Transaction);
    await this.transactionService.createTransactionForSeeding({
      wallet: shopWallet,
      from: shopAccount.username,
      to: shopAccount.username,
      fromTypeBalance: TypeBalance.LOCKED,
      toTypeBalance: TypeBalance.AVAILABLE,
      amount: newOrder.amount,
      type: TransactionType.TRANSFER,
      status: TransactionStatus.COMPLETED,
    } as Transaction);
    await this.transactionService.createTransactionForSeeding({
      wallet: customerWallet,
      from: customer.username,
      to: customer.username,
      fromTypeBalance: TypeBalance.LOCKED,
      toTypeBalance: TypeBalance.AVAILABLE,
      amount: Number(newOrder.amount) * 0.5,
      type: TransactionType.REFUND,
      status: TransactionStatus.COMPLETED,
    } as Transaction);

    this.logger.log(
      `Rent order created successfully! Order ID: ${newOrder.id}, Customer: ${customer.email}, Shop: ${shopAccount.email}`,
    );
  }

  private async seedFeedbacks() {
    const feedbacks = await this.feedbackService.getAllFeedbacks();
    if (feedbacks.length >= 50) {
      this.logger.log(`Enough feedbacks available. Skipping seeding.`);
      return;
    }
    try {
      Promise.all([
        await this.seedFeedback(1, 1, OrderType.SELL),
        await this.seedFeedback(2, 1, OrderType.SELL),
        await this.seedFeedback(3, 1, OrderType.SELL),
        await this.seedFeedback(4, 1, OrderType.SELL),
        await this.seedFeedback(5, 1, OrderType.SELL),
        await this.seedFeedback(1, 2, OrderType.SELL),
        await this.seedFeedback(2, 2, OrderType.SELL),
        await this.seedFeedback(3, 2, OrderType.SELL),
        await this.seedFeedback(4, 2, OrderType.SELL),
        await this.seedFeedback(5, 2, OrderType.SELL),
        await this.seedFeedback(1, 3, OrderType.SELL),
        await this.seedFeedback(2, 3, OrderType.SELL),
        await this.seedFeedback(3, 3, OrderType.SELL),
        await this.seedFeedback(4, 3, OrderType.SELL),
        await this.seedFeedback(5, 3, OrderType.SELL),
        await this.seedFeedback(1, 4, OrderType.RENT),
        await this.seedFeedback(2, 4, OrderType.RENT),
        await this.seedFeedback(3, 4, OrderType.RENT),
        await this.seedFeedback(4, 4, OrderType.RENT),
        await this.seedFeedback(5, 4, OrderType.RENT),
        await this.seedFeedback(1, 5, OrderType.RENT),
        await this.seedFeedback(2, 5, OrderType.RENT),
        await this.seedFeedback(3, 5, OrderType.RENT),
        await this.seedFeedback(4, 5, OrderType.RENT),
        await this.seedFeedback(5, 5, OrderType.RENT),
      ]);
      this.logger.log('Seeding process completed successfully!');
    } catch (error) {
      this.logger.error('Seeding feedbacks failed.', error);
      throw new Error('Seeding feedbacks failed.');
    }
  }

  private async seedFeedback(customerNumber: number, shopNumber: number, type: OrderType) {
    const customer = await this.userService.getByEmail(`customer.${customerNumber}@veila.studio`);
    if (!customer) {
      this.logger.warn(
        `Customer with email customer.${customerNumber}@veila.studio not found. Skipping rent order seeding.`,
      );
      return;
    }
    const shopAccount = await this.userService.getByEmail(`shop.${shopNumber}@veila.studio`);
    if (!shopAccount) {
      this.logger.warn(
        `Shop with email shop.${shopNumber}@veila.studio not found. Skipping feedback seeding.`,
      );
      return;
    }
    const shop = await this.shopService.getShopByUserId(shopAccount.id);
    if (!shop) {
      this.logger.warn(`Shop not found for user ${shopAccount.email}. Skipping feedback seeding.`);
      return;
    }
    const order = await this.orderService.getFirstOrderByCustomerIdAndShopIdAndType(
      customer.id,
      shop.id,
      type,
    );
    if (!order) {
      this.logger.warn(
        `Order not found for customer ${customer.id} and type ${type}. Skipping feedback seeding.`,
      );
      return;
    }
    this.logger.log(`Seeding feedback for customer: ${customer.email}, order ID: ${order.id}`);
    const dress = order.orderDressDetail?.dress;
    if (!dress) {
      this.logger.warn(`No dress found for order ID ${order.id}. Skipping feedback seeding.`);
      return;
    }
    const accessory = order.orderAccessoryDetail?.[0].accessory;
    if (!accessory) {
      this.logger.warn(`No accessory found for order ID ${order.id}. Skipping feedback seeding.`);
      return;
    }
    await this.feedbackService.createFeedbackForSeeding({
      customer,
      order,
      dress,
      content: this.customFaker.lorem.sentence(),
      rating: this.customFaker.number.int({ min: 1, max: 5 }),
    } as Feedback);
    await this.feedbackService.createFeedbackForSeeding({
      customer,
      order,
      accessory,
      content: this.customFaker.lorem.sentence(),
      rating: this.customFaker.number.int({ min: 1, max: 5 }),
    } as Feedback);
    this.logger.log(
      `Feedback created successfully for customer: ${customer.email}, order ID: ${order.id}`,
    );
  }
}
