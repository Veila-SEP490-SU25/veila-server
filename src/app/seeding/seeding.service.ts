import { AccessoryService } from '@/app/accessory';
import { AppSettingService } from '@/app/appsetting';
import { BlogService } from '@/app/blog';
import { CategoryService } from '@/app/category';
import { ContractService } from '@/app/contract';
import { DressService } from '@/app/dress';
import { FeedbackService } from '@/app/feedback';
import { OrderService } from '@/app/order';
import { PasswordService } from '@/app/password';
import { RequestService } from '@/app/request';
import { ServiceService } from '@/app/service';
import { ShopService } from '@/app/shop';
import { SingleService } from '@/app/single';
import { SubscriptionService } from '@/app/subscription';
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
  OrderServiceDetail,
  ComplaintStatus,
  Complaint,
} from '@/common/models';
import { AppSetting } from '@/common/models/single/appsetting.model';
import {
  ComplaintReason,
  ComplaintReasonType,
} from '@/common/models/single/complaint-reason.model';
import {
  MilestoneTemplate,
  MilestoneTemplateType,
} from '@/common/models/single/milestone-template.model';
import { Faker, faker, vi } from '@faker-js/faker';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SeedingService implements OnModuleInit {
  private readonly logger = new Logger(SeedingService.name, {
    timestamp: true,
  });
  private readonly node_env: string;

  private readonly customFaker: Faker;
  private readonly customerEmail: string;
  private readonly customer1Email: string;
  private readonly shop1Email: string;
  private readonly shop2Email: string;
  private readonly shop3Email: string;
  private readonly shop4Email: string;
  private readonly shop5Email: string;
  private readonly superAdminEmail: string;
  private readonly adminEmail: string;
  private readonly systemOperatorEmail: string;

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
    private readonly requestService: RequestService,
    private readonly orderService: OrderService,
    private readonly taskService: TaskService,
    private readonly transactionService: TransactionService,
    private readonly feedbackService: FeedbackService,
    private readonly appSettingService: AppSettingService,
    private readonly singleService: SingleService,
  ) {
    // Khởi tạo faker với locale tiếng Việt
    this.customFaker = new Faker({
      locale: vi,
    });

    // Lấy đuôi biến môi trường
    this.node_env = process.env.NODE_ENV || 'development';

    const customerEmail = this.configService.get<string>('SEED_CUSTOMER_EMAIL');
    if (!customerEmail) {
      this.logger.error('SEED_CUSTOMER_EMAIL is not set in the environment variables.');
      throw new Error('SEED_CUSTOMER_EMAIL is not set in the environment variables.');
    }
    this.customerEmail = customerEmail;

    const customer1Email = this.configService.get<string>('SEED_CUSTOMER_1_EMAIL');
    if (!customer1Email) {
      this.logger.error('SEED_CUSTOMER_1_EMAIL is not set in the environment variables.');
      throw new Error('SEED_CUSTOMER_1_EMAIL is not set in the environment variables.');
    }
    this.customer1Email = customer1Email;

    const shop1Email = this.configService.get<string>('SEED_SHOP_1_EMAIL');
    const shop2Email = this.configService.get<string>('SEED_SHOP_2_EMAIL');
    const shop3Email = this.configService.get<string>('SEED_SHOP_3_EMAIL');
    const shop4Email = this.configService.get<string>('SEED_SHOP_4_EMAIL');
    const shop5Email = this.configService.get<string>('SEED_SHOP_5_EMAIL');
    if (!shop1Email || !shop2Email || !shop3Email || !shop4Email || !shop5Email) {
      this.logger.error('One or more shop emails are not set in the environment variables.');
      throw new Error('One or more shop emails are not set in the environment variables.');
    }
    this.shop1Email = shop1Email;
    this.shop2Email = shop2Email;
    this.shop3Email = shop3Email;
    this.shop4Email = shop4Email;
    this.shop5Email = shop5Email;

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
    this.superAdminEmail = superAdminEmail;
    this.adminEmail = adminEmail;
    this.systemOperatorEmail = systemOperatorEmail;
  }

  async onModuleInit() {
    this.logger.log('Seeding module initialized. Starting seeding process...');
    if (this.node_env !== 'production') {
      Promise.all([
        await this.seedComplaintReasons(),
        await this.seedAppSetting(),
        await this.seedMilestoneTemplates(),
        await this.seedContracts(),
        await this.seedSubscriptions(),
      ])
        .then(async () => {
          await this.seedSystemAccounts();
          await this.seedUsersRoleCustomer();
          await this.seedUsersRoleShop();
        })
        .then(async () => {
          await this.seedWallets();
          await this.seedShops();
          await this.seedCategories();
        })
        .then(async () => {
          await this.seedLicenses();
          await this.seedMemberships();
          await this.seedDresses();
          await this.seedServices();
          await this.seedAccessories();
          await this.seedBlogs();
        })
        .then(async () => {
          await this.seedSubmitRequests();
          await this.seedSellOrders();
          await this.seedRentOrders();
          await this.seedCustomOrders();
        })
        .then(async () => {
          await this.seedFeedbacks();
          await this.seedComplaintsForOrder();
        })
        .then(async () => {
          await this.seedUpdateRating();
        });
    } else {
      Promise.all([
        await this.seedComplaintReasons(),
        await this.seedAppSetting(),
        await this.seedMilestoneTemplates(),
        await this.seedContracts(),
        await this.seedSubscriptions(),
      ])
        .then(async () => {
          await this.seedUsersForProd();
        })
        .then(async () => {
          await this.seedShopsForProd();
          await this.seedCategoriesForProd();
        })
        .then(async () => {
          await this.seedDressesForProd();
          await this.seedServicesForProd();
          await this.seedAccessoriesForProd();
          await this.seedBlogsForProd();
        });
    }
  }

  private async seedComplaintReasons() {
    const reasons = await this.singleService.getComplaintReasons();
    if (reasons.length > 0) this.logger.log(`Complaint reasons already exist. Skipping seeding.`);
    else {
      try {
        await Promise.all([
          await this.singleService.createComplaintReason({
            code: 'REASON_1',
            reason: 'Hàng không đúng mô tả',
            reputationPenalty: 10,
            type: ComplaintReasonType.CUSTOMER,
          } as ComplaintReason),
          await this.singleService.createComplaintReason({
            code: 'REASON_2',
            reason: 'Hàng bị lỗi',
            reputationPenalty: 10,
            type: ComplaintReasonType.CUSTOMER,
          } as ComplaintReason),
          await this.singleService.createComplaintReason({
            code: 'REASON_3',
            reason: 'Hàng không đúng kích thước',
            reputationPenalty: 10,
            type: ComplaintReasonType.CUSTOMER,
          } as ComplaintReason),
          await this.singleService.createComplaintReason({
            code: 'REASON_4',
            reason: 'Hàng bị hư hỏng trong quá trình vận chuyển',
            reputationPenalty: 10,
            type: ComplaintReasonType.CUSTOMER,
          } as ComplaintReason),
          await this.singleService.createComplaintReason({
            code: 'REASON_5',
            reason: 'Trễ deadline',
            reputationPenalty: 10,
            type: ComplaintReasonType.CUSTOMER,
          } as ComplaintReason),
          await this.singleService.createComplaintReason({
            code: 'REASON_6',
            reason: 'Hàng bị hư',
            reputationPenalty: 10,
            type: ComplaintReasonType.SHOP,
          } as ComplaintReason),
          await this.singleService.createComplaintReason({
            code: 'REASON_7',
            reason: 'Trả hàng không đúng hạn',
            reputationPenalty: 10,
            type: ComplaintReasonType.SHOP,
          } as ComplaintReason),
        ]);
      } catch (error) {
        this.logger.error(`Error seeding complaint reasons: ${error.message}`);
        throw new Error(`Error seeding complaint reasons: ${error.message}`);
      }
    }
  }

  private async seedMilestoneTemplates() {
    const milestones = await this.singleService.getMilestoneTemplates();
    if (milestones.length > 0)
      this.logger.log(`Milestone templates already exist. Skipping seeding.`);
    else {
      try {
        await Promise.all([
          await this.seedMilestoneTemplate(
            'Chuẩn bị váy',
            'Cửa hàng đang chuẩn bị và kiểm tra chất lượng váy cưới',
            1,
            5,
            MilestoneTemplateType.SELL,
          ),
          await this.seedMilestoneTemplate(
            'Sẵn sàng bàn giao',
            'Váy đã sẵn sàng để giao cho đơn vị vận chuyển hoặc nhận trực tiếp tại cửa hàng',
            2,
            10,
            MilestoneTemplateType.SELL,
          ),
          await this.seedMilestoneTemplate(
            'Đang giao hàng',
            'Váy đang được vận chuyển đến địa chỉ của bạn',
            3,
            15,
            MilestoneTemplateType.SELL,
          ),
          await this.seedMilestoneTemplate(
            'Đã nhận hàng',
            'Bạn đã nhận váy cưới và xác nhận tình trạng sản phẩm',
            4,
            20,
            MilestoneTemplateType.SELL,
          ),
          await this.seedMilestoneTemplate(
            'Hoàn tất đơn hàng',
            'Quy trình mua hàng đã hoàn thành',
            5,
            25,
            MilestoneTemplateType.SELL,
          ),
          await this.seedMilestoneTemplate(
            'Nhận khiếu nại về đơn hàng (nếu có)',
            'Người mua và người bán khiếu nại một số vấn đề nếu có',
            6,
            30,
            MilestoneTemplateType.SELL,
          ),

          await this.seedMilestoneTemplate(
            'Chuẩn bị váy',
            'Cửa hàng đang chuẩn bị và kiểm tra chất lượng váy cưới',
            1,
            5,
            MilestoneTemplateType.RENT,
          ),
          await this.seedMilestoneTemplate(
            'Sẵn sàng bàn giao',
            'Váy đã sẵn sàng để giao cho đơn vị vận chuyển hoặc nhận trực tiếp tại cửa hàng',
            2,
            10,
            MilestoneTemplateType.RENT,
          ),
          await this.seedMilestoneTemplate(
            'Đang giao hàng',
            'Váy đang được vận chuyển đến địa chỉ của bạn',
            3,
            15,
            MilestoneTemplateType.RENT,
          ),
          await this.seedMilestoneTemplate(
            'Hoàn tất đơn hàng',
            'Quy trình mua hàng đã hoàn thành',
            4,
            20,
            MilestoneTemplateType.RENT,
          ),
          await this.seedMilestoneTemplate(
            'Khách hàng đang sử dụng',
            'Bạn đang giữ và sử dụng váy trong thời gian thuê',
            5,
            25,
            MilestoneTemplateType.RENT,
          ),
          await this.seedMilestoneTemplate(
            'Hoàn trả váy',
            'Bạn đã gửi trả váy hoặc bàn giao lại cho cửa hàng',
            6,
            30,
            MilestoneTemplateType.RENT,
          ),
          await this.seedMilestoneTemplate(
            'Hoàn tất đơn hàng',
            'Quy trình mua hàng đã hoàn thành',
            7,
            35,
            MilestoneTemplateType.RENT,
          ),
          await this.seedMilestoneTemplate(
            'Nhận khiếu nại về đơn hàng (nếu có)',
            'Người mua và người bán khiếu nại một số vấn đề nếu có',
            8,
            40,
            MilestoneTemplateType.RENT,
          ),

          await this.seedMilestoneTemplate(
            'Đo và tư vấn',
            'Tiến hành đo số đo và tư vấn kiểu dáng, chất liệu phù hợp cho khách',
            1,
            5,
            MilestoneTemplateType.CUSTOM,
          ),
          await this.seedMilestoneTemplate(
            'Chuẩn bị nguyên liệu',
            'Chuẩn bị vải, ren, phụ kiện và các nguyên liệu cần thiết',
            2,
            10,
            MilestoneTemplateType.CUSTOM,
          ),
          await this.seedMilestoneTemplate(
            'May và hoàn thiện cơ bản',
            'Thợ may tiến hành tạo dáng váy và hoàn thiện phần cơ bản',
            3,
            15,
            MilestoneTemplateType.CUSTOM,
          ),
          await this.seedMilestoneTemplate(
            'Đặt lịch thử và chỉnh sửa',
            'Khách thử váy và thợ may điều chỉnh theo phản hồi',
            4,
            20,
            MilestoneTemplateType.CUSTOM,
          ),
          await this.seedMilestoneTemplate(
            'Hoàn tất đơn hàng',
            'Quy trình mua hàng đã hoàn thành',
            5,
            25,
            MilestoneTemplateType.CUSTOM,
          ),
          await this.seedMilestoneTemplate(
            'Nhận khiếu nại về đơn hàng (nếu có)',
            'Người mua và người bán khiếu nại một số vấn đề nếu có',
            6,
            30,
            MilestoneTemplateType.CUSTOM,
          ),
        ]);
      } catch (error) {
        this.logger.error('Seeding milestone templates failed.', error);
        throw new Error('Seeding milestone templates failed.');
      }
    }
  }

  private async seedMilestoneTemplate(
    title: string,
    description: string,
    index: number,
    timeGap: number,
    type: MilestoneTemplateType,
  ) {
    const milestoneTemplate = {
      title,
      description,
      index,
      timeGap,
      type,
    } as MilestoneTemplate;
    await this.singleService.createMilestoneTemplate(milestoneTemplate);
  }

  private async seedAppSetting() {
    const appsetting = await this.appSettingService.getAppSetting();
    if (appsetting) {
      this.logger.log(`App settings already exist. Skipping seeding.`);
    } else {
      await this.appSettingService.createAppSetting({
        cancelPenalty: 5,
        delayPenalty: 15,
      } as AppSetting);
    }
  }

  private async seedContracts() {
    const contracts = await this.contractService.findAll();
    if (contracts.length >= 3) {
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

      const platformContractContent = `
# Giới thiệu Nền tảng Veila - Wedding Dress Platform

## 1. Thông tin chung
- **Tên nền tảng**: Veila Platform
- **Slogan**: Kết nối cô dâu, chú rể với những chiếc váy cưới đẹp nhất
- **Mô tả**: Veila là nền tảng cung cấp và kết nối các nhà cung cấp váy cưới với khách hàng trên toàn quốc, giúp tiết kiệm thời gian, chi phí và mang lại trải nghiệm cưới hoàn hảo.
- **Website**: https://veila.studio/
- **Năm thành lập**: 2025

## 2. Sứ mệnh và Tầm nhìn
- **Sứ mệnh**: Mang đến trải nghiệm cưới hoàn hảo thông qua công nghệ và dịch vụ chất lượng.
- **Tầm nhìn**: Trở thành nền tảng váy cưới hàng đầu Việt Nam.
- **Giá trị cốt lõi**:
  1. Chất lượng
  2. Tin cậy
  3. Sáng tạo

## 3. Thông tin liên hệ
- **Email**: veila.studio.mail@gmail.com

- **Điện thoại**: +84 967 475 325
- **Địa chỉ**: Quận 9, TP. Hồ Chí Minh, Việt Nam

## 5. Hỗ trợ khách hàng
- **Thời gian hỗ trợ**: 24/7 mọi ngày trong tuần
`;
      Promise.all([
        await this.seedContract(
          ContractType.CUSTOMER,
          customerContractContent,
          `Điều khoản CUSTOMER`,
          new Date(),
        ),
        await this.seedContract(
          ContractType.SHOP,
          shopContractContent,
          `Điều khoản SHOP`,
          new Date(),
        ),
        await this.seedContract(
          ContractType.PLATFORM,
          platformContractContent,
          'Veila - Wedding Dress Platform',
          new Date('2025-05-12'),
        ),
      ]);
      this.logger.log('Seeding process completed successfully!');
    } catch (error) {
      this.logger.error('Seeding process failed.', error);
      throw new Error('Seeding process failed.');
    }
  }

  private async seedContract(
    type: ContractType,
    content: string,
    title: string,
    effectiveFrom: Date,
  ) {
    this.logger.log(`Seeding contract with type: ${type}`);

    const existingContract = await this.contractService.findOne(type);
    if (existingContract) {
      this.logger.warn(`Contract with type ${type} already exists. Skipping seeding.`);
      return;
    }

    const newContract = {
      title,
      content,
      contractType: type,
      effectiveFrom,
      status: ContractStatus.ACTIVE,
    } as Contract;

    await this.contractService.create(newContract);
    this.logger.log(`Contract of type ${type} created successfully!`);
  }

  private async seedSubscriptions() {
    const subscriptions = await this.subscriptionService.getAllForSeeding();
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
      images: this.customFaker.image.url(),
      duration,
      amount: duration < 30 ? 10000 : duration < 365 ? 50000 : 100000,
    } as Subscription;

    await this.subscriptionService.create(newSubscription);
    this.logger.log(`Subscription of ${duration} days created successfully!`);
  }

  private async seedSystemAccounts() {
    try {
      await Promise.all([
        this.seedAccounts(this.superAdminEmail, UserRole.SUPER_ADMIN),
        this.seedAccounts(this.adminEmail, UserRole.ADMIN),
        this.seedAccounts(this.systemOperatorEmail, UserRole.STAFF),
      ]);
      this.logger.log('Seeding process completed successfully!');
    } catch (error) {
      this.logger.error('Seeding process failed.', error);
      throw new Error('Seeding process failed.');
    }
  }

  private async seedUsersRoleCustomer() {
    const customers = await this.userService.getAllForSeeding();
    if (customers.filter((c) => c.role === UserRole.CUSTOMER).length >= 1) {
      this.logger.log(`Enough data available for customer user. Skipping seeding`);
      return;
    }
    try {
      await Promise.all([await this.seedAccounts(this.customerEmail, UserRole.CUSTOMER)]);
      this.logger.log('Seeding process completed successfully!');
    } catch (error) {
      this.logger.error('Seeding process failed.', error);
      throw new Error('Seeding process failed.');
    }
  }

  private async seedUsersRoleShop() {
    const customers = await this.userService.getAllForSeeding();
    if (customers.filter((c) => c.role === UserRole.SHOP).length >= 5) {
      this.logger.log(`Enough data available for shop user. Skipping seeding`);
      return;
    }
    try {
      await Promise.all([
        await this.seedAccounts(this.shop1Email, UserRole.SHOP),
        await this.seedAccounts(this.shop2Email, UserRole.SHOP),
        await this.seedAccounts(this.shop3Email, UserRole.SHOP),
        await this.seedAccounts(this.shop4Email, UserRole.SHOP),
        await this.seedAccounts(this.shop5Email, UserRole.SHOP),
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
      username: this.generateVietnameseUsername(fullName, role),
      email,
      password: await this.passwordService.hashPassword(defaultPassword),
      firstName,
      middleName,
      lastName,
      phone: email.includes('customer.')
        ? `+84${this.customFaker.string.numeric(1)}00${email.charAt(
            9,
          )}${this.customFaker.string.numeric(5)}`
        : email.includes('shop.')
          ? `+84${this.customFaker.string.numeric(1)}11${email.charAt(
              5,
            )}${this.customFaker.string.numeric(5)}`
          : email.includes('admin')
            ? `+84${this.customFaker.string.numeric(1)}22${this.customFaker.string.numeric(6)}`
            : email.includes('staff')
              ? `+84${this.customFaker.string.numeric(1)}33${this.customFaker.string.numeric(6)}`
              : `+84${this.customFaker.string.numeric(1)}44${this.customFaker.string.numeric(6)}`,
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
      role,
      status: UserStatus.ACTIVE,
      reputation: 100,
      isVerified: true,
      isIdentified: true,
      contract,
    } as User;

    const createdUser = await this.userService.createUser(newUser);
    this.logger.log(
      `Account created successfully! Email: ${email}, Username: ${createdUser.username}, Role: ${role}`,
    );
  }

  private async seedWallets() {
    const wallets = await this.walletService.getAllForSeeding();
    if (wallets.length >= 9) {
      this.logger.log(`Enough data available for wallet. Skipping seeding`);
      return;
    }

    try {
      Promise.all([
        await this.seedWallet(this.superAdminEmail),
        await this.seedWallet(this.adminEmail),
        await this.seedWallet(this.systemOperatorEmail),
        await this.seedWallet(this.customerEmail),
        await this.seedWallet(this.shop1Email),
        await this.seedWallet(this.shop2Email),
        await this.seedWallet(this.shop3Email),
        await this.seedWallet(this.shop4Email),
        await this.seedWallet(this.shop5Email),
      ]);
      this.logger.log('Seeding process completed successfully!');
    } catch (error) {
      this.logger.error('Seeding wallets failed.', error);
      throw new Error('Seeding wallets failed.');
    }
  }

  private async seedWallet(email: string) {
    this.logger.log(`Seeding wallet with email: ${email}`);
    const bin = this.configService.get<string>('DEFAULT_BANK_BIN');
    const bankNumber = this.configService.get<string>('DEFAULT_BANK_NUMBER');

    if (!bin || !bankNumber) {
      this.logger.error('DEFAULT_BANK_BIN is not set in the environment variables.');
      throw new Error('DEFAULT_BANK_NUMBER is not set in the environment variables.');
    }

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
      availableBalance: 100000000,
      lockedBalance: 100000000,
      bin,
      bankNumber,
    } as Wallet;

    await this.walletService.create(newWallet);
    this.logger.log(`Wallet created successfully for user: ${user.email}`);
  }

  private async seedShops() {
    const shops = await this.shopService.getAll();
    if (shops.length >= 5) {
      this.logger.log(`Enough data available for shop. Skipping seeding`);
      return;
    }
    try {
      Promise.all([
        await this.seedShop(this.shop1Email),
        await this.seedShop(this.shop2Email),
        await this.seedShop(this.shop3Email),
        await this.seedShop(this.shop4Email),
        await this.seedShop(this.shop5Email),
      ]);
      this.logger.log('Seeding process completed successfully!');
    } catch (error) {
      this.logger.error('Seeding process failed.', error);
      throw new Error('Seeding process failed.');
    }
  }

  private async seedShop(email: string) {
    const user = await this.userService.getByEmail(email);
    if (!user) {
      this.logger.warn(`User role Shop ${email} not exists. Skipping seeding shop.`);
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
      reputation: 100,
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
        await this.seedCategory(this.shop1Email, CategoryType.ACCESSORY),
        await this.seedCategory(this.shop2Email, CategoryType.ACCESSORY),
        await this.seedCategory(this.shop3Email, CategoryType.ACCESSORY),
        await this.seedCategory(this.shop4Email, CategoryType.ACCESSORY),
        await this.seedCategory(this.shop5Email, CategoryType.ACCESSORY),
        await this.seedCategory(this.shop1Email, CategoryType.SERVICE),
        await this.seedCategory(this.shop2Email, CategoryType.SERVICE),
        await this.seedCategory(this.shop3Email, CategoryType.SERVICE),
        await this.seedCategory(this.shop4Email, CategoryType.SERVICE),
        await this.seedCategory(this.shop5Email, CategoryType.SERVICE),
        await this.seedCategory(this.shop1Email, CategoryType.DRESS),
        await this.seedCategory(this.shop2Email, CategoryType.DRESS),
        await this.seedCategory(this.shop3Email, CategoryType.DRESS),
        await this.seedCategory(this.shop4Email, CategoryType.DRESS),
        await this.seedCategory(this.shop5Email, CategoryType.DRESS),
        await this.seedCategory(this.shop1Email, CategoryType.BLOG),
        await this.seedCategory(this.shop2Email, CategoryType.BLOG),
        await this.seedCategory(this.shop3Email, CategoryType.BLOG),
        await this.seedCategory(this.shop4Email, CategoryType.BLOG),
        await this.seedCategory(this.shop5Email, CategoryType.BLOG),
      ]);
      this.logger.log('Seeding process completed successfully!');
    } catch (error) {
      this.logger.error('Seeding process failed.', error);
      throw new Error('Seeding process failed.');
    }
  }

  private async seedCategory(email: string, type: CategoryType) {
    const user = await this.userService.getByEmail(email);
    if (!user) {
      this.logger.warn(`User role Shop ${email} not exists. Skipping seeding category.`);
      return;
    }
    this.logger.log(`Seeding category with email: ${user.email}`);

    const newCategory = {
      user,
      type,
      name: type.toString().toLowerCase(),
    } as Category;

    const createdCategory = await this.categoryService.create(newCategory);
    this.logger.log(
      `Category created successfully! Owner's Email: ${user.email}, Name: ${createdCategory.name}`,
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
        await this.seedLicense(this.shop1Email),
        await this.seedLicense(this.shop2Email),
        await this.seedLicense(this.shop3Email),
        await this.seedLicense(this.shop4Email),
        await this.seedLicense(this.shop5Email),
      ]);
      this.logger.log('Seeding process completed successfully!');
    } catch (error) {
      this.logger.error('Seeding process failed.', error);
      throw new Error('Seeding process failed.');
    }
  }

  private async seedLicense(email: string) {
    const shop = await this.shopService.getByUserEmail(email);
    if (!shop) {
      this.logger.warn(`Shop with email ${email} not found. Skipping seeding license.`);
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
      images: this.customFaker.image.url({ width: 800, height: 600 }),
      status: LicenseStatus.APPROVED,
    } as License;
    await this.shopService.createLicense(newLicense);
    this.logger.log(`License created successfully for shop: ${shop.name}`);
  }

  private async seedMemberships() {
    const memberships = await this.shopService.getAllMemberships();
    if (memberships.length >= 5) {
      this.logger.log(`Enough data available for membership. Skipping seeding`);
      return;
    }
    try {
      Promise.all([
        await this.seedMembership(this.shop1Email, 365),
        await this.seedMembership(this.shop2Email, 30),
        await this.seedMembership(this.shop3Email, 30),
        await this.seedMembership(this.shop4Email, 7),
        await this.seedMembership(this.shop5Email, 7),
      ]);
      this.logger.log('Seeding process completed successfully!');
    } catch (error) {
      this.logger.error('Seeding process failed.', error);
      throw new Error('Seeding process failed.');
    }
  }

  private async seedMembership(email: string, subscriptionDuration: number) {
    this.logger.log(`Seeding membership for shop ${email}`);

    const shop = await this.shopService.getShopByUserEmailForSeeding(email);
    if (!shop) {
      this.logger.warn(`Shop with email ${email} not found. Skipping seeding membership.`);
      return;
    }
    const existingMembership = await this.shopService.getMembershipById(shop.id);
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
      endDate: new Date(Date.now() + subscriptionDuration * 24 * 60 * 60 * 1000),
      status: MembershipStatus.ACTIVE,
    } as Membership;
    const createdMembership = await this.shopService.createMembershipForSeeding(newMembership);
    if (!shop.user.wallet) {
      this.logger.warn(`Wallet for shop ${shop.name} not found. Skipping transaction creation.`);
      return;
    }
    await this.transactionService.createMembershipTransactionForSeeding({
      wallet: shop.user.wallet,
      membership: createdMembership,
      from: shop.name,
      to: this.superAdminEmail,
      fromTypeBalance: TypeBalance.AVAILABLE,
      toTypeBalance: TypeBalance.AVAILABLE,
      amount: subscription.amount,
      type: TransactionType.TRANSFER,
      status: TransactionStatus.COMPLETED,
      note: `Seeding membership transaction for shop: ${shop.name}, Subscription Duration: ${subscriptionDuration} days`,
      availableBalanceSnapshot: shop.user.wallet.availableBalance,
      lockedBalanceSnapshot: shop.user.wallet.lockedBalance,
    } as Transaction);
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
        await this.seedDress(this.shop1Email),
        await this.seedDress(this.shop2Email),
        await this.seedDress(this.shop3Email),
        await this.seedDress(this.shop4Email),
        await this.seedDress(this.shop5Email),
        await this.seedDress(this.shop1Email),
        await this.seedDress(this.shop2Email),
        await this.seedDress(this.shop3Email),
        await this.seedDress(this.shop4Email),
        await this.seedDress(this.shop5Email),
        await this.seedDress(this.shop1Email),
        await this.seedDress(this.shop2Email),
        await this.seedDress(this.shop3Email),
        await this.seedDress(this.shop4Email),
        await this.seedDress(this.shop5Email),
        await this.seedDress(this.shop1Email),
        await this.seedDress(this.shop2Email),
        await this.seedDress(this.shop3Email),
        await this.seedDress(this.shop4Email),
        await this.seedDress(this.shop5Email),
        await this.seedDress(this.shop1Email),
        await this.seedDress(this.shop2Email),
        await this.seedDress(this.shop3Email),
        await this.seedDress(this.shop4Email),
        await this.seedDress(this.shop5Email),
      ]);
      this.logger.log('Seeding process completed successfully!');
    } catch (error) {
      this.logger.error('Seeding process failed.', error);
      throw new Error('Seeding process failed.');
    }
  }

  private async seedDress(email: string) {
    const user = await this.userService.getByEmail(email);
    if (!user) {
      this.logger.warn(`User with email ${email} not exists. Skipping seeding dress.`);
      return;
    }
    const category = await this.categoryService.getOneByUserAndType(user.id, CategoryType.DRESS);
    if (!category) {
      this.logger.warn(`User category ${email} not exists`);
    }

    this.logger.log(`Seeding dress with email: ${user.email}`);

    const newDress = {
      user,
      category,
      name: 'Váy cưới ' + faker.commerce.productAdjective(),
      description: 'Mô tả váy cưới mới: ' + faker.commerce.productDescription(),
      images: this.customFaker.image.url(),
      sellPrice: this.customFaker.number.float({ min: 1000, max: 100000, fractionDigits: 2 }),
      rentalPrice: this.customFaker.number.float({ min: 200, max: 20000, fractionDigits: 2 }),
      isSellable: true,
      isRentable: true,
      ratingAverage: 0,
      ratingCount: 0,
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
        await this.seedService(this.shop1Email),
        await this.seedService(this.shop2Email),
        await this.seedService(this.shop3Email),
        await this.seedService(this.shop4Email),
        await this.seedService(this.shop5Email),
      ]);
      this.logger.log('Seeding process completed successfully!');
    } catch (error) {
      this.logger.error('Seeding process failed.', error);
      throw new Error('Seeding process failed.');
    }
  }

  private async seedService(email: string) {
    const user = await this.userService.getByEmail(email);
    if (!user) {
      this.logger.warn(`User role ${email} not exists. Skipping seeding service.`);
      return;
    }
    const category = await this.categoryService.getOneByUserAndType(user.id, CategoryType.SERVICE);
    if (!category) {
      this.logger.warn(`User category ${email} not exists`);
    }

    this.logger.log(`Seeding service with email: ${user.email}`);

    const newService = {
      user,
      category,
      name: 'Dịch vụ máy váy cưới mới của ' + user.email,
      description:
        'Mô tả dịch vụ máy váy cưới mới của ' + user.email + faker.commerce.productDescription(),
      images: this.customFaker.image.url(),
      status: ServiceStatus.AVAILABLE,
      ratingAverage: 0,
      ratingCount: 0,
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
        await this.seedAccessory(this.shop1Email),
        await this.seedAccessory(this.shop1Email),
        await this.seedAccessory(this.shop1Email),
        await this.seedAccessory(this.shop1Email),
        await this.seedAccessory(this.shop1Email),
        await this.seedAccessory(this.shop2Email),
        await this.seedAccessory(this.shop2Email),
        await this.seedAccessory(this.shop2Email),
        await this.seedAccessory(this.shop2Email),
        await this.seedAccessory(this.shop2Email),
        await this.seedAccessory(this.shop3Email),
        await this.seedAccessory(this.shop3Email),
        await this.seedAccessory(this.shop3Email),
        await this.seedAccessory(this.shop3Email),
        await this.seedAccessory(this.shop3Email),
        await this.seedAccessory(this.shop4Email),
        await this.seedAccessory(this.shop4Email),
        await this.seedAccessory(this.shop4Email),
        await this.seedAccessory(this.shop4Email),
        await this.seedAccessory(this.shop4Email),
        await this.seedAccessory(this.shop5Email),
        await this.seedAccessory(this.shop5Email),
        await this.seedAccessory(this.shop5Email),
        await this.seedAccessory(this.shop5Email),
        await this.seedAccessory(this.shop5Email),
      ]);
      this.logger.log('Seeding process completed successfully!');
    } catch (error) {
      this.logger.error('Seeding process failed.', error);
      throw new Error('Seeding process failed.');
    }
  }

  private async seedAccessory(email: string) {
    const user = await this.userService.getByEmail(email);
    if (!user) {
      this.logger.warn(`User role ${email} not exists. Skipping seeding accessory.`);
      return;
    }
    const category = await this.categoryService.getOneByUserAndType(
      user.id,
      CategoryType.ACCESSORY,
    );
    if (!category) {
      this.logger.warn(`User category ${email} not exists`);
    }

    this.logger.log(`Seeding accessory with email: ${user.email}`);

    const newAccessory = {
      user,
      category,
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      images: this.customFaker.image.url(),
      sellPrice: this.customFaker.number.float({ min: 10, max: 200, fractionDigits: 2 }),
      rentalPrice: this.customFaker.number.float({ min: 2, max: 50, fractionDigits: 2 }),
      isSellable: true,
      isRentable: true,
      ratingAverage: 0,
      ratingCount: 0,
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
        await this.seedBlog(this.shop1Email),
        await this.seedBlog(this.shop1Email),
        await this.seedBlog(this.shop1Email),
        await this.seedBlog(this.shop1Email),
        await this.seedBlog(this.shop1Email),
        await this.seedBlog(this.shop2Email),
        await this.seedBlog(this.shop2Email),
        await this.seedBlog(this.shop2Email),
        await this.seedBlog(this.shop2Email),
        await this.seedBlog(this.shop2Email),
        await this.seedBlog(this.shop3Email),
        await this.seedBlog(this.shop3Email),
        await this.seedBlog(this.shop3Email),
        await this.seedBlog(this.shop3Email),
        await this.seedBlog(this.shop3Email),
        await this.seedBlog(this.shop4Email),
        await this.seedBlog(this.shop4Email),
        await this.seedBlog(this.shop4Email),
        await this.seedBlog(this.shop4Email),
        await this.seedBlog(this.shop4Email),
        await this.seedBlog(this.shop5Email),
        await this.seedBlog(this.shop5Email),
        await this.seedBlog(this.shop5Email),
        await this.seedBlog(this.shop5Email),
        await this.seedBlog(this.shop5Email),
      ]);
      this.logger.log('Seeding process completed successfully!');
    } catch (error) {
      this.logger.error('Seeding process failed.', error);
      throw new Error('Seeding process failed.');
    }
  }

  private async seedBlog(email: string) {
    const user = await this.userService.getByEmail(email);
    if (!user) {
      this.logger.warn(`User role ${email} not exists. Skipping seeding blog.`);
      return;
    }
    const category = await this.categoryService.getOneByUserAndType(user.id, CategoryType.BLOG);
    if (!category) {
      this.logger.warn(`User category ${email} not exists`);
    }

    this.logger.log(`Seeding blog with email: ${user.email}`);

    const newBlog = {
      user,
      category,
      title: this.customFaker.lorem.sentence(),
      content: this.customFaker.lorem.paragraphs(20),
      images: this.customFaker.image.url({ width: 800, height: 600 }),
      isVerified: true,
      status: BlogStatus.PUBLISHED,
    } as Blog;

    const createBlog = await this.blogService.create(newBlog);
    this.logger.log(
      `Blog created successfully! Owner's Email: ${user.email}, Title: ${createBlog.title}`,
    );
  }

  private async seedSubmitRequests() {
    const requests = await this.requestService.getAllRequestsForSeeding();
    if (requests.length >= 5) {
      this.logger.log(`Enough data available for submit request. Skipping seeding`);
      return;
    }
    try {
      Promise.all([
        await this.seedSubmitRequest(this.customerEmail),
        await this.seedSubmitRequest(this.customerEmail),
        await this.seedSubmitRequest(this.customerEmail),
        await this.seedSubmitRequest(this.customerEmail),
        await this.seedSubmitRequest(this.customerEmail),
      ]);
    } catch (error) {
      this.logger.error('Seeding process failed.', error);
      throw new Error('Seeding process failed.');
    }
  }

  private async seedSubmitRequest(email: string) {
    const customer = await this.userService.getByEmail(email);
    if (!customer) {
      this.logger.warn(`Customer with email ${email} not found. Skipping seeding submit request.`);
      return;
    }
    this.logger.log(`Seeding submit request for customer: ${customer.email}`);

    const newRequest = {
      user: customer,
      title: `May váy cưới cho ${customer.email} ` + this.customFaker.string.alphanumeric(5),
      description:
        `May váy cưới đẹp và sang trọng, giá thành từ 100 triệu đồng đổ lại. ` +
        this.customFaker.lorem.paragraph(20),
      height: this.customFaker.number.int({ min: 150, max: 200 }),
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
    if (orders.length >= 25) {
      this.logger.log(`Enough sell orders available. Skipping seeding.`);
      return;
    }
    try {
      Promise.all([
        await this.seedSellOrder(this.customerEmail, this.shop1Email),
        await this.seedSellOrder(this.customerEmail, this.shop2Email),
        await this.seedSellOrder(this.customerEmail, this.shop3Email),
        await this.seedSellOrder(this.customerEmail, this.shop4Email),
        await this.seedSellOrder(this.customerEmail, this.shop5Email),
      ]);
      this.logger.log('Seeding process completed successfully!');
    } catch (error) {
      this.logger.error('Seeding sell orders failed.', error);
      throw new Error('Seeding sell orders failed.');
    }
  }

  private async seedSellOrder(customerEmail: string, shopEmail: string) {
    const customer = await this.userService.getByEmail(customerEmail);
    if (!customer) {
      this.logger.warn(`Customer with email ${customerEmail} not found. Skipping seeding.`);
      return;
    }

    const customerWallet = await this.walletService.findOneByUserId(customer.id);
    if (!customerWallet) {
      this.logger.warn(
        `Wallet for customer ${customer.email} not found. Skipping seeding sell order.`,
      );
      return;
    }

    const shopAccount = await this.userService.getByEmail(shopEmail);
    if (!shopAccount) {
      this.logger.warn(`Shop with email ${shopEmail} not found. Skipping seeding.`);
      return;
    }

    const shopWallet = await this.walletService.findOneByUserId(shopAccount.id);
    if (!shopWallet) {
      this.logger.warn(
        `Wallet for shop ${shopAccount.email} not found. Skipping seeding sell order.`,
      );
      return;
    }

    const shop = await this.shopService.getShopForSeeding(shopAccount.id);
    if (!shop) {
      this.logger.warn(
        `Shop not found for user ${shopAccount.email}. Skipping seeding sell order.`,
      );
      return;
    }

    const dresses = await this.dressService.getAllDressesByUserIdForSeeding(shopAccount.id);
    if (dresses.length === 0) {
      this.logger.warn(
        `No dresses found for shop ${shopAccount.email}. Skipping seeding sell order.`,
      );
      return;
    }

    for (const dress of dresses) {
      const accessories = await this.accessoryService.getAllByUserIdForSeeding(shopAccount.id);
      if (accessories.length === 0) {
        this.logger.warn(
          `No accessories found for shop ${shopAccount.email}. Skipping seeding sell order.`,
        );
        return;
      }

      this.logger.log(
        `Seeding sell order for customer: ${customer.email}, shop: ${shopAccount.email}, dress: ${dress.name}`,
      );

      const newOrder = await this.orderService.createOrderForSeeding({
        customer,
        shop,
        phone: customer.phone,
        email: customer.email,
        address: customer.address || `${faker.location.streetAddress()}, ${faker.location.city()}`,
        dueDate: new Date(),
        returnDate: null,
        // Coerce all price parts to numbers to avoid NaN inserting into DB
        amount:
          Number(dress.sellPrice ?? 0) +
          accessories.reduce((acc, curr) => acc + Number(curr?.sellPrice ?? 0), 0),
        type: OrderType.SELL,
        status: OrderStatus.COMPLETED,
      } as Order);

      await this.orderService.createOrderDressDetailForSeeding({
        order: newOrder,
        dress,
        height: this.customFaker.number.int({ min: 150, max: 200 }),
        weight: this.customFaker.number.int({ min: 40, max: 80 }),
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
        // Ensure numeric price
        price: Number(dress.sellPrice ?? 0),
        isRated: false,
      } as OrderDressDetail);

      for (const accessory of accessories) {
        await this.orderService.createOrderAccessoryDetailForSeeding({
          order: newOrder,
          accessory,
          quantity: 1,
          description: 'Mô tả chi tiết về đơn hàng phụ kiện',
          // Ensure numeric price
          price: Number(accessory.sellPrice ?? 0),
          isRated: false,
        } as OrderAccessoryDetail);
      }

      const milestone1 = await this.orderService.createMilestoneForSeeding({
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

      const milestone2 = await this.orderService.createMilestoneForSeeding({
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
        type: TransactionType.TRANSFER,
        status: TransactionStatus.COMPLETED,
        availableBalanceSnapshot: customerWallet.availableBalance,
        lockedBalanceSnapshot: customerWallet.lockedBalance,
      } as Transaction);
      await this.transactionService.createTransactionForSeeding({
        wallet: shopWallet,
        order: newOrder,
        from: customer.username,
        to: shopAccount.username,
        fromTypeBalance: TypeBalance.AVAILABLE,
        toTypeBalance: TypeBalance.LOCKED,
        amount: newOrder.amount,
        type: TransactionType.TRANSFER,
        status: TransactionStatus.COMPLETED,
        availableBalanceSnapshot: shopWallet.availableBalance,
        lockedBalanceSnapshot: shopWallet.lockedBalance,
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
        availableBalanceSnapshot: shopWallet.availableBalance,
        lockedBalanceSnapshot: shopWallet.lockedBalance,
      } as Transaction);

      this.logger.log(
        `Sell order created successfully! Order ID: ${newOrder.id}, Customer: ${customer.email}, Shop: ${shopAccount.email}`,
      );
    }
  }

  private async seedRentOrders() {
    const orders = await this.orderService.getAllTypeOrders(OrderType.RENT);
    if (orders.length >= 25) {
      this.logger.log(`Enough rent orders available. Skipping seeding.`);
      return;
    }
    try {
      Promise.all([
        await this.seedRentOrder(this.customerEmail, this.shop1Email),
        await this.seedRentOrder(this.customerEmail, this.shop2Email),
        await this.seedRentOrder(this.customerEmail, this.shop3Email),
        await this.seedRentOrder(this.customerEmail, this.shop4Email),
        await this.seedRentOrder(this.customerEmail, this.shop5Email),
      ]);
      this.logger.log('Seeding process completed successfully!');
    } catch (error) {
      this.logger.error('Seeding rent orders failed.', error);
      throw new Error('Seeding rent orders failed.');
    }
  }

  private async seedRentOrder(customerEmail: string, shopEmail: string) {
    const customer = await this.userService.getByEmail(customerEmail);
    if (!customer) {
      this.logger.warn(
        `Customer with email ${customerEmail} not found. Skipping rent order seeding.`,
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

    const shopAccount = await this.userService.getByEmail(shopEmail);
    if (!shopAccount) {
      this.logger.warn(`Shop with email ${shopEmail} not found. Skipping seeding rent order.`);
      return;
    }

    const shopWallet = await this.walletService.findOneByUserId(shopAccount.id);
    if (!shopWallet) {
      this.logger.warn(
        `Wallet for shop ${shopAccount.email} not found. Skipping seeding rent order.`,
      );
      return;
    }

    const shop = await this.shopService.getShopForSeeding(shopAccount.id);
    if (!shop) {
      this.logger.warn(
        `Shop not found for user ${shopAccount.email}. Skipping seeding rent order.`,
      );
      return;
    }

    const dresses = await this.dressService.getAllDressesByUserIdForSeeding(shopAccount.id);
    if (dresses.length === 0) {
      this.logger.warn(
        `No dresses found for shop ${shopAccount.email}. Skipping seeding rent order.`,
      );
      return;
    }

    for (const dress of dresses) {
      const accessories = await this.accessoryService.getAllByUserIdForSeeding(shopAccount.id);
      if (accessories.length === 0) {
        this.logger.warn(
          `No accessories found for shop ${shopAccount.email}. Skipping seeding sell order.`,
        );
        return;
      }

      this.logger.log(
        `Seeding sell order for customer: ${customer.email}, shop: ${shopAccount.email}, dress: ${dress.name}`,
      );

      const newOrder = await this.orderService.createOrderForSeeding({
        customer,
        shop,
        phone: customer.phone,
        email: customer.email,
        address: customer.address || `${faker.location.streetAddress()}, ${faker.location.city()}`,
        dueDate: new Date(),
        returnDate: new Date(),
        amount:
          Number(dress.rentalPrice ?? 0) +
          accessories.reduce((acc, curr) => acc + Number(curr?.rentalPrice ?? 0), 0),
        type: OrderType.RENT,
        status: OrderStatus.COMPLETED,
      } as Order);

      await this.orderService.createOrderDressDetailForSeeding({
        order: newOrder,
        dress,
        height: this.customFaker.number.int({ min: 150, max: 200 }),
        weight: this.customFaker.number.int({ min: 40, max: 80 }),
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
        // For rent orders, use rental price and ensure numeric
        price: Number(dress.rentalPrice ?? 0),
        isRated: false,
      } as OrderDressDetail);

      for (const accessory of accessories) {
        await this.orderService.createOrderAccessoryDetailForSeeding({
          order: newOrder,
          accessory,
          quantity: 1,
          description: 'Mô tả chi tiết về đơn hàng phụ kiện',
          // For rent orders, use accessory rental price and ensure numeric
          price: Number(accessory.rentalPrice ?? 0),
          isRated: false,
        } as OrderAccessoryDetail);
      }
      const milestone1 = await this.orderService.createMilestoneForSeeding({
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

      const milestone2 = await this.orderService.createMilestoneForSeeding({
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

      const milestone3 = await this.orderService.createMilestoneForSeeding({
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
        type: TransactionType.TRANSFER,
        status: TransactionStatus.COMPLETED,
        availableBalanceSnapshot: customerWallet.availableBalance,
        lockedBalanceSnapshot: customerWallet.lockedBalance,
      } as Transaction);
      await this.transactionService.createTransactionForSeeding({
        wallet: shopWallet,
        order: newOrder,
        from: customer.username,
        to: shopAccount.username,
        fromTypeBalance: TypeBalance.AVAILABLE,
        toTypeBalance: TypeBalance.LOCKED,
        amount: newOrder.amount,
        type: TransactionType.TRANSFER,
        status: TransactionStatus.COMPLETED,
        availableBalanceSnapshot: shopWallet.availableBalance,
        lockedBalanceSnapshot: shopWallet.lockedBalance,
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
        availableBalanceSnapshot: shopWallet.availableBalance,
        lockedBalanceSnapshot: shopWallet.lockedBalance,
      } as Transaction);

      this.logger.log(
        `Rent order created successfully! Order ID: ${newOrder.id}, Customer: ${customer.email}, Shop: ${shopAccount.email}`,
      );
    }
  }

  private async seedCustomOrders() {
    const orders = await this.orderService.getAllTypeOrders(OrderType.CUSTOM);
    if (orders.length >= 5) {
      this.logger.log(`Enough custom orders available. Skipping seeding.`);
      return;
    }
    try {
      await Promise.all([
        this.seedCustomOrder(this.shop1Email),
        this.seedCustomOrder(this.shop2Email),
        this.seedCustomOrder(this.shop3Email),
        this.seedCustomOrder(this.shop4Email),
        this.seedCustomOrder(this.shop5Email),
      ]);
    } catch (error) {
      this.logger.error('Seeding custom orders failed.', error);
      throw new Error('Seeding custom orders failed.');
    }
  }

  private async seedCustomOrder(shopEmail: string) {
    const customer = await this.userService.getByEmail(this.customerEmail);
    if (!customer) {
      this.logger.warn(
        `Customer with email ${this.customerEmail} not found. Skipping rent order seeding.`,
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

    const shopAccount = await this.userService.getByEmail(shopEmail);
    if (!shopAccount) {
      this.logger.warn(`Shop with email ${shopEmail} not found. Skipping seeding rent order.`);
      return;
    }

    const shopWallet = await this.walletService.findOneByUserId(shopAccount.id);
    if (!shopWallet) {
      this.logger.warn(
        `Wallet for shop ${shopAccount.email} not found. Skipping seeding rent order.`,
      );
      return;
    }

    const shop = await this.shopService.getShopForSeeding(shopAccount.id);
    if (!shop) {
      this.logger.warn(
        `Shop not found for user ${shopAccount.email}. Skipping seeding rent order.`,
      );
      return;
    }

    const service = await this.serviceService.getServiceByUserIdForSeeding(shopAccount.id);
    if (!service) {
      this.logger.warn(
        `No services found for shop ${shopAccount.email}. Skipping seeding rent order.`,
      );
      return;
    }
    this.logger.log(
      `Seeding sell order for customer: ${customer.email}, shop: ${shopAccount.email}, service: ${service.name}`,
    );

    const newRequest = await this.requestService.createRequestForSeeding({
      user: customer,
      title: `May váy cưới cho ${customer.email} ` + this.customFaker.string.alphanumeric(5),
      description:
        `May váy cưới đẹp và sang trọng, giá thành từ 100 triệu đồng đổ lại. ` +
        this.customFaker.lorem.paragraph(20),
      height: this.customFaker.number.int({ min: 150, max: 200 }),
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
      status: RequestStatus.ACCEPTED,
      isPrivate: false,
      images: this.customFaker.datatype.boolean()
        ? this.customFaker.image.url({ width: 800, height: 600 })
        : '',
    } as Request);

    const newOrder = await this.orderService.createOrderForSeeding({
      customer,
      shop,
      phone: customer.phone,
      email: customer.email,
      address: customer.address || `${faker.location.streetAddress()}, ${faker.location.city()}`,
      dueDate: new Date(),
      returnDate: null,
      amount: this.customFaker.number.float({ min: 1000, max: 100000, fractionDigits: 2 }),
      type: OrderType.CUSTOM,
      status: OrderStatus.COMPLETED,
    } as Order);

    await this.orderService.createOrderServiceDetailForSeeding({
      order: newOrder,
      request: newRequest,
      service,
      price: newOrder.amount,
      isRated: false,
    } as OrderServiceDetail);

    const milestone1 = await this.orderService.createMilestoneForSeeding({
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

    const milestone2 = await this.orderService.createMilestoneForSeeding({
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
      type: TransactionType.TRANSFER,
      status: TransactionStatus.COMPLETED,
      availableBalanceSnapshot: customerWallet.availableBalance,
      lockedBalanceSnapshot: customerWallet.lockedBalance,
    } as Transaction);
    await this.transactionService.createTransactionForSeeding({
      wallet: shopWallet,
      order: newOrder,
      from: customer.username,
      to: shopAccount.username,
      fromTypeBalance: TypeBalance.AVAILABLE,
      toTypeBalance: TypeBalance.LOCKED,
      amount: newOrder.amount,
      type: TransactionType.TRANSFER,
      status: TransactionStatus.COMPLETED,
      availableBalanceSnapshot: shopWallet.availableBalance,
      lockedBalanceSnapshot: shopWallet.lockedBalance,
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
      availableBalanceSnapshot: shopWallet.availableBalance,
      lockedBalanceSnapshot: shopWallet.lockedBalance,
    } as Transaction);

    this.logger.log(
      `Rent order created successfully! Order ID: ${newOrder.id}, Customer: ${customer.email}, Shop: ${shopAccount.email}`,
    );
  }

  private async seedFeedbacks() {
    const feedbacks = await this.feedbackService.getAllFeedbacksForSeeding();
    if (feedbacks.length > 0) {
      this.logger.log(`Enough feedbacks available. Skipping seeding.`);
      return;
    }
    try {
      Promise.all([await this.seedFeedback()]);
      this.logger.log('Seeding process completed successfully!');
    } catch (error) {
      this.logger.error('Seeding feedbacks failed.', error);
      throw new Error('Seeding feedbacks failed.');
    }
  }

  private async seedFeedback() {
    const customer = await this.userService.getByEmail(this.customerEmail);
    if (!customer) {
      this.logger.warn(
        `Customer with email ${this.customerEmail} not found. Skipping rent order seeding.`,
      );
      return;
    }
    const sellOrders = await this.orderService.getAllOrdersForSeeding(
      OrderType.SELL,
      OrderStatus.COMPLETED,
    );
    for (const order of sellOrders) {
      if (!order.orderDressDetail || !order.orderAccessoriesDetail) {
        this.logger.warn(
          `Order ${order.id} does not have complete details. Skipping feedback seeding.`,
        );
        continue;
      }
      const newDressFeedback = {
        customer,
        order,
        dress: order.orderDressDetail.dress,
        content: this.customFaker.lorem.sentence(),
        rating: this.customFaker.number.int({ min: 1, max: 5 }),
        images: this.customFaker.datatype.boolean()
          ? this.customFaker.image.url({ width: 800, height: 600 })
          : null,
      } as Feedback;
      await this.feedbackService.createFeedbackForSeeding(newDressFeedback);
      await this.orderService.updateOrderDressDetailForSeedingFeedback(order.orderDressDetail.id);
      for (const accessory of order.orderAccessoriesDetail) {
        const newAccessoryFeedback = {
          customer,
          order,
          accessory: accessory.accessory,
          content: this.customFaker.lorem.sentence(),
          rating: this.customFaker.number.int({ min: 1, max: 5 }),
          images: this.customFaker.datatype.boolean()
            ? this.customFaker.image.url({ width: 800, height: 600 })
            : null,
        } as Feedback;
        await this.feedbackService.createFeedbackForSeeding(newAccessoryFeedback);
        await this.orderService.updateOrderAccessoryDetailForSeedingFeedback(accessory.id);
      }
    }

    const rentalOrders = await this.orderService.getAllOrdersForSeeding(
      OrderType.RENT,
      OrderStatus.COMPLETED,
    );
    for (const order of rentalOrders) {
      if (!order.orderDressDetail || !order.orderAccessoriesDetail) {
        this.logger.warn(
          `Order ${order.id} does not have complete details. Skipping feedback seeding.`,
        );
        continue;
      }
      const newDressFeedback = {
        customer,
        order,
        dress: order.orderDressDetail.dress,
        content: this.customFaker.lorem.sentence(),
        rating: this.customFaker.number.int({ min: 1, max: 5 }),
        images: this.customFaker.datatype.boolean()
          ? this.customFaker.image.url({ width: 800, height: 600 })
          : null,
      } as Feedback;
      await this.feedbackService.createFeedbackForSeeding(newDressFeedback);
      await this.orderService.updateOrderDressDetailForSeedingFeedback(order.orderDressDetail.id);
      for (const accessory of order.orderAccessoriesDetail) {
        const newAccessoryFeedback = {
          customer,
          order,
          accessory: accessory.accessory,
          content: this.customFaker.lorem.sentence(),
          rating: this.customFaker.number.int({ min: 1, max: 5 }),
          images: this.customFaker.datatype.boolean()
            ? this.customFaker.image.url({ width: 800, height: 600 })
            : null,
        } as Feedback;
        await this.feedbackService.createFeedbackForSeeding(newAccessoryFeedback);
        await this.orderService.updateOrderAccessoryDetailForSeedingFeedback(accessory.id);
      }
    }

    const customOrders = await this.orderService.getAllOrdersForSeeding(
      OrderType.CUSTOM,
      OrderStatus.COMPLETED,
    );
    for (const order of customOrders) {
      if (!order.orderServiceDetail) {
        this.logger.warn(
          `Order ${order.id} does not have service details. Skipping feedback seeding.`,
        );
        return;
      }
      const newServiceFeedback = {
        customer,
        order,
        service: order.orderServiceDetail.service,
        content: this.customFaker.lorem.sentence(),
        rating: this.customFaker.number.int({ min: 1, max: 5 }),
        images: this.customFaker.datatype.boolean()
          ? this.customFaker.image.url({ width: 800, height: 600 })
          : null,
      } as Feedback;
      await this.feedbackService.createFeedbackForSeeding(newServiceFeedback);
      await this.orderService.updateOrderServiceDetailForSeedingFeedback(
        order.orderServiceDetail.id,
      );
    }
  }

  private async seedUpdateRating() {
    const dresses = await this.dressService.getAll();
    for (const dress of dresses) {
      if (dress.ratingCount === 0) {
        try {
          await this.dressService.updateDressRatingForSeedingFeedback(dress.id);
        } catch (error) {
          this.logger.error(`Failed to update rating for dress ${dress.id}`, error);
        }
      }
    }
    const accessories = await this.accessoryService.getAll();
    for (const accessory of accessories) {
      if (accessory.ratingCount === 0) {
        try {
          await this.accessoryService.updateAccessoryRatingForSeedingFeedback(accessory.id);
        } catch (error) {
          this.logger.error(`Failed to update rating for accessory ${accessory.id}`, error);
        }
      }
    }
    const services = await this.serviceService.getAll();
    for (const service of services) {
      if (service.ratingCount === 0) {
        try {
          await this.serviceService.updateServiceRatingForSeedingFeedback(service.id);
        } catch (error) {
          this.logger.error(`Failed to update rating for service ${service.id}`, error);
        }
      }
    }
  }

  private async seedComplaintsForOrder() {
    const complaints = await this.orderService.getAllComplaintsForSeeding();
    if (complaints.length >= 10) {
      this.logger.log(`Enough complaints available. Skipping seeding.`);
      return;
    }
    try {
      await Promise.all([
        await this.seedComplaintForOrder(1, 1, OrderType.SELL, ComplaintStatus.DRAFT),
        await this.seedComplaintForOrder(1, 2, OrderType.SELL, ComplaintStatus.IN_PROGRESS),
        await this.seedComplaintForOrder(1, 3, OrderType.SELL, ComplaintStatus.APPROVED),
        await this.seedComplaintForOrder(1, 4, OrderType.RENT, ComplaintStatus.REJECTED),
        await this.seedComplaintForOrder(1, 5, OrderType.RENT, ComplaintStatus.IN_PROGRESS),
        await this.seedComplaintForOrder(1, 4, OrderType.RENT, ComplaintStatus.IN_PROGRESS),
        await this.seedComplaintForOrder(1, 3, OrderType.SELL, ComplaintStatus.APPROVED),
        await this.seedComplaintForOrder(1, 5, OrderType.RENT, ComplaintStatus.IN_PROGRESS),
        await this.seedComplaintForOrder(1, 2, OrderType.SELL, ComplaintStatus.REJECTED),
        await this.seedComplaintForOrder(1, 1, OrderType.SELL, ComplaintStatus.DRAFT),
      ]);
      this.logger.log('Seeding process completed successfully!');
    } catch (error) {
      this.logger.error('Seeding complaints failed.', error);
      throw new Error('Seeding complaints failed.');
    }
  }

  private async seedComplaintForOrder(
    customerNumber: number,
    shopNumber: number,
    type: OrderType,
    status: ComplaintStatus,
  ) {
    const customer = await this.userService.getByEmail(`customer@veila.studio`);
    if (!customer) {
      this.logger.warn(`Customer with email customer@veila.studio not found.`);
      return;
    }

    const shop = await this.userService.getByEmail(`shop.${shopNumber}@veila.studio`);
    if (!shop) {
      this.logger.warn(`Shop with email shop.${shopNumber}@veila.studio not found.`);
      return;
    }

    const order = await this.orderService.getOrderForSeedingComplaint(customer.id, shop.id, type);
    if (!order) {
      this.logger.warn(`Order not found for customer ${customer.id} and shop ${shop.id}.`);
      return;
    }

    if (type === OrderType.RENT) {
      const newComplaint = {
        sender: { id: this.customFaker.datatype.boolean() ? customer.id : shop.id },
        order,
        title: 'REASON_1',
        description: this.customFaker.lorem.sentence(),
        images:
          'https://linhnga.vn/wp-content/uploads/2022/08/f004a698955bf4dc9e6993d946a9f40b.jpg',
        reason: 'Hàng không đúng mô tả',
        status,
      } as Complaint;
      await this.orderService.createComplaintForSeeding(newComplaint);
    } else {
      const newComplaint = {
        sender: { id: customer.id },
        order,
        title: 'REASON_1',
        description: this.customFaker.lorem.sentence(),
        images:
          'https://linhnga.vn/wp-content/uploads/2022/08/f004a698955bf4dc9e6993d946a9f40b.jpg',
        reason: 'Hàng không đúng mô tả',
        status,
      } as Complaint;
      await this.orderService.createComplaintForSeeding(newComplaint);
    }
  }

  private async seedUsersForProd() {
    const users = await this.userService.getAllForSeeding();
    if (users.length > 0) this.logger.log(`Users already exist. Skipping user seeding.`);
    else {
      try {
        await Promise.all([
          await this.seedUserForProd(this.superAdminEmail, UserRole.SUPER_ADMIN),
          await this.seedUserForProd(this.adminEmail, UserRole.ADMIN),
          await this.seedUserForProd(this.systemOperatorEmail, UserRole.STAFF),
          await this.seedUserForProd(this.customerEmail, UserRole.CUSTOMER),
          await this.seedUserForProd(this.customer1Email, UserRole.CUSTOMER),
          await this.seedUserForProd(this.shop1Email, UserRole.SHOP),
          await this.seedUserForProd(this.shop2Email, UserRole.SHOP),
          await this.seedUserForProd(this.shop3Email, UserRole.SHOP),
          await this.seedUserForProd(this.shop4Email, UserRole.SHOP),
          await this.seedUserForProd(this.shop5Email, UserRole.SHOP),
        ]);
        this.logger.log('Seeding process completed successfully!');
      } catch (error) {
        this.logger.error('Seeding users failed.', error);
        throw new Error('Seeding users failed.');
      }
    }
  }

  private async seedUserForProd(email: string, role: UserRole) {
    const contract = await this.contractService.findOne(ContractType.CUSTOMER);
    if (!contract) {
      this.logger.warn(
        `Contract for type ${ContractType.CUSTOMER} not found. Skipping seeding user.`,
      );
      return;
    }
    const defaultPassword = this.configService.get<string>('SEED_ACCOUNT_PASSWORD');
    if (!defaultPassword) {
      this.logger.error('SEED_ACCOUNT_PASSWORD is not set in the environment variables.');
      throw new Error('SEED_ACCOUNT_PASSWORD is not set in the environment variables.');
    }
    const bankNumber = this.configService.get<string>('DEFAULT_BANK_NUMBER');
    if (!bankNumber) {
      this.logger.error('DEFAULT_BANK_NUMBER is not set in the environment variables.');
      throw new Error('DEFAULT_BANK_NUMBER is not set in the environment variables.');
    }
    const bin = this.configService.get<string>('DEFAULT_BANK_BIN');
    if (!bin) {
      this.logger.error('DEFAULT_BANK_BIN is not set in the environment variables.');
      throw new Error('DEFAULT_BANK_BIN is not set in the environment variables.');
    }
    const pin = this.configService.get<string>('DEFAULT_BANK_PIN');
    if (!pin) {
      this.logger.error('DEFAULT_BANK_PIN is not set in the environment variables.');
      throw new Error('DEFAULT_BANK_PIN is not set in the environment variables.');
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
      username: this.generateVietnameseUsername(fullName, role),
      email,
      password: await this.passwordService.hashPassword(defaultPassword),
      firstName,
      middleName,
      lastName,
      phone: email.includes('customer')
        ? `+84${this.customFaker.string.numeric(1)}00${this.customFaker.string.numeric(6)}`
        : email.includes('shop')
          ? `+84${this.customFaker.string.numeric(1)}11${this.customFaker.string.numeric(6)}`
          : email.includes('admin')
            ? `+84${this.customFaker.string.numeric(1)}22${this.customFaker.string.numeric(6)}`
            : email.includes('staff')
              ? `+84${this.customFaker.string.numeric(1)}33${this.customFaker.string.numeric(6)}`
              : `+84${this.customFaker.string.numeric(1)}44${this.customFaker.string.numeric(6)}`,
      address: 'Lô E2a-7, Đường D1, Khu Công nghệ cao, Phường Tăng Nhơn Phú, TP. HCM',
      birthDate: this.customFaker.date.between({ from: '1980-01-01', to: '2000-12-31' }),
      avatarUrl: this.customFaker.image.avatar(),
      coverUrl:
        'https://marketplace.canva.com/EAE8yuYZRpo/1/0/1600w/canva-cam-v%C3%A0-xanh-l%C3%A1-khu-r%E1%BB%ABng-%E1%BA%A3nh-b%C3%ACa-facebook-m%C3%B9a-thu-hGIvF_HcwGE.jpg',
      role,
      status: UserStatus.ACTIVE,
      reputation: 100,
      isVerified: true,
      isIdentified: true,
      contract,
    } as User;

    const createdUser = await this.userService.createUser(newUser);

    const hashedPin = await this.passwordService.hashPassword(pin);

    const newWallet = {
      user: createdUser,
      availableBalance: 100000000,
      lockedBalance: 0,
      bankNumber,
      bin,
      pin: hashedPin,
    } as Wallet;

    await this.walletService.create(newWallet);
  }

  private async seedShopsForProd() {
    const shops = await this.shopService.getAll();
    if (shops.length > 0) this.logger.log(`Shops already exist. Skipping shop seeding.`);
    else {
      try {
        await Promise.all([
          await this.seedShopForProd(this.shop1Email, 365),
          await this.seedShopForProd(this.shop2Email, 365),
          await this.seedShopForProd(this.shop3Email, 30),
          await this.seedShopForProd(this.shop4Email, 30),
          await this.seedShopForProd(this.shop5Email, 7),
        ]);
      } catch (error) {
        this.logger.error(`Error seeding shops: ${error.message}`);
        throw new Error('Seeding shops failed.');
      }
    }
  }

  private async seedShopForProd(email: string, subscriptionDuration: number) {
    const user = await this.userService.getByEmail(email);
    if (!user) {
      this.logger.warn(`User role Shop ${email} not exists. Skipping seeding shop.`);
      return;
    }
    const contract = await this.contractService.findOne(ContractType.SHOP);
    if (!contract) {
      this.logger.warn(`Contract for type ${ContractType.SHOP} not found. Skipping seeding shop.`);
      return;
    }
    const subscription = await this.subscriptionService.findOneByDuration(subscriptionDuration);
    if (!subscription) {
      this.logger.warn(
        `Subscription for duration ${subscriptionDuration} not found. Skipping seeding shop.`,
      );
      return;
    }

    const shopName = email.split('@')[0].replace('.', ' ').toUpperCase();
    const newShop = {
      user,
      name: shopName,
      phone: user.phone,
      email: user.email,
      address: 'Đường Tạ Quang Bửu, Khu phố 33, Phường Linh Xuân, TP. Hồ Chí Minh',
      description:
        'Cửa hàng thời trang váy cưới cao cấp, chuyên cung cấp các mẫu váy cưới đẹp và sang trọng.',
      logoUrl:
        'https://github.com/Veila-SEP490-SU25/Veila-mobile-app/blob/main/assets/images/logo.png?raw=true',
      coverUrl:
        'https://www.essexwedding.co.uk/wp-content/uploads/The-Wedding-Shop-Colchester-1.jpg',
      status: ShopStatus.ACTIVE,
      reputation: 100,
      isVerified: true,
      contract,
    } as Shop;
    const createdShop = await this.shopService.create(newShop);

    const license = {
      shop: createdShop,
      images:
        'https://mocongty.net/wp-content/uploads/2023/11/GIAY-PHEP-KINH-DOANH-CONG-TY-TNHH-1TV-525x1024.jpg',
      status: LicenseStatus.APPROVED,
      rejectReason: null,
    } as License;
    await this.shopService.createLicense(license);

    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + subscriptionDuration);
    const membership = {
      shop: createdShop,
      subscription,
      startDate,
      endDate,
      status: MembershipStatus.ACTIVE,
    } as Membership;
    await this.shopService.createMembershipForSeeding(membership);
  }

  private async seedCategoriesForProd() {
    const categories = await this.categoryService.getAll();
    if (categories.length > 0)
      this.logger.log(`Categories already exist. Skipping category seeding.`);
    else {
      try {
        await Promise.all([
          this.seedCategoryForProd(this.shop1Email),
          this.seedCategoryForProd(this.shop2Email),
          this.seedCategoryForProd(this.shop3Email),
          this.seedCategoryForProd(this.shop4Email),
          this.seedCategoryForProd(this.shop5Email),
        ]);
      } catch (error) {
        this.logger.error(`Error seeding categories: ${error.message}`);
        throw new Error('Seeding categories failed.');
      }
    }
  }

  private async seedCategoryForProd(email: string) {
    const user = await this.userService.getByEmail(email);
    if (!user) {
      this.logger.warn(`User role Shop ${email} not exists. Skipping seeding category.`);
      return;
    }

    const categories = [
      {
        user,
        type: CategoryType.ACCESSORY,
        name: 'Phụ kiện',
      } as Category,
      {
        user,
        type: CategoryType.BLOG,
        name: 'Blog',
      } as Category,
      {
        user,
        type: CategoryType.DRESS,
        name: 'Váy cưới',
      } as Category,
      {
        user,
        type: CategoryType.SERVICE,
        name: 'Dịch vụ',
      } as Category,
    ];

    categories.forEach(async (category) => {
      await this.categoryService.create(category);
    });
  }

  private async seedDressesForProd() {
    const dresses = await this.dressService.getAll();
    if (dresses.length > 0) {
      this.logger.log(`Dresses already exist. Skipping dress seeding.`);
    } else {
      try {
        await Promise.all([
          this.seedDressForProd(this.shop1Email),
          this.seedDressForProd(this.shop2Email),
          this.seedDressForProd(this.shop3Email),
          this.seedDressForProd(this.shop4Email),
          this.seedDressForProd(this.shop5Email),
        ]);
      } catch (error) {
        this.logger.error(`Error seeding dresses: ${error.message}`);
        throw new Error('Seeding dresses failed.');
      }
    }
  }

  private async seedDressForProd(email: string) {
    const user = await this.userService.getByEmail(email);
    if (!user) {
      this.logger.warn(`User with email ${email} not exists. Skipping seeding dress.`);
      return;
    }
    const category = await this.categoryService.getOneByUserAndType(user.id, CategoryType.DRESS);
    if (!category) {
      this.logger.warn(`User category ${email} not exists`);
    }

    const shopName = email.split('@')[0].replace('.', ' ').toUpperCase();
    const dresses = [
      {
        user,
        category,
        name: 'Váy cưới công chúa',
        description:
          'Váy cưới công chúa lộng lẫy với thiết kế tinh tế và chất liệu cao cấp. Cung cấp bởi ' +
          shopName,
        images: 'https://mimosawedding.vn/wp-content/uploads/2022/08/vay-cuoi-cong-chua.jpg',
        bust: 90,
        waist: 60,
        hip: 90,
        material: 'Lụa cao cấp',
        color: 'Trắng',
        length: 'Dài đến sàn',
        neckline: 'Cổ vuông',
        sleeve: 'Không tay',
        sellPrice: 100000,
        rentalPrice: 50000,
        isSellable: true,
        isRentable: true,
        ratingAverage: 0,
        ratingCount: 0,
        status: DressStatus.AVAILABLE,
      } as Dress,
      {
        user,
        category,
        name: 'Váy cưới đuôi cá',
        description:
          'Váy cưới đuôi cá quyến rũ với thiết kế tinh tế và chất liệu cao cấp. Cung cấp bởi ' +
          shopName,
        images: 'https://i.pinimg.com/originals/72/5f/fc/725ffc17b944400e96deb1cff94d15c8.jpg',
        bust: 90,
        waist: 60,
        hip: 90,
        material: 'Lụa cao cấp',
        color: 'Trắng',
        length: 'Dài đến sàn',
        neckline: 'Cổ vuông',
        sleeve: 'Không tay',
        sellPrice: 100000,
        rentalPrice: 50000,
        isSellable: true,
        isRentable: true,
        ratingAverage: 0,
        ratingCount: 0,
        status: DressStatus.AVAILABLE,
      } as Dress,
      {
        user,
        category,
        name: 'Váy cưới chữ A',
        description:
          'Váy cưới chữ A thanh lịch với thiết kế tinh tế và chất liệu cao cấp. Cung cấp bởi ' +
          shopName,
        images: 'https://felywedding.com/wp-content/uploads/2021/11/25-2.jpg',
        bust: 90,
        waist: 60,
        hip: 90,
        material: 'Lụa cao cấp',
        color: 'Trắng',
        length: 'Dài đến sàn',
        neckline: 'Cổ tròn',
        sleeve: 'Không tay',
        sellPrice: 100000,
        rentalPrice: 50000,
        isSellable: true,
        isRentable: true,
        ratingAverage: 0,
        ratingCount: 0,
        status: DressStatus.AVAILABLE,
      } as Dress,
      {
        user,
        category,
        name: 'Váy cưới vintage',
        description:
          'Váy cưới vintage lộng lẫy với thiết kế tinh tế và chất liệu cao cấp. Cung cấp bởi ' +
          shopName,
        images:
          'https://thaka.bing.com/th/id/OIP.5uUMhHntQyqbO7nY3-t96wHaLH?r=0&o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3',
        bust: 90,
        waist: 60,
        hip: 90,
        material: 'Lụa cao cấp',
        color: 'Trắng',
        length: 'Dài đến sàn',
        neckline: 'Cổ tròn',
        sleeve: 'Có tay',
        sellPrice: 100000,
        rentalPrice: 50000,
        isSellable: true,
        isRentable: true,
        ratingAverage: 0,
        ratingCount: 0,
        status: DressStatus.AVAILABLE,
      } as Dress,
      {
        user,
        category,
        name: 'Váy cưới xòe',
        description:
          'Váy cưới xòe bồng bềnh với thiết kế tinh tế và chất liệu cao cấp. Cung cấp bởi ' +
          shopName,
        images: 'https://linhnga.vn/wp-content/uploads/2020/07/IMG_6067-Edit-scaled.jpg',
        bust: 90,
        waist: 60,
        hip: 90,
        material: 'Lụa cao cấp',
        color: 'Trắng',
        length: 'Dài đến sàn',
        neckline: 'Cổ tròn',
        sleeve: 'Có tay',
        sellPrice: 100000,
        rentalPrice: 50000,
        isSellable: true,
        isRentable: true,
        ratingAverage: 0,
        ratingCount: 0,
        status: DressStatus.AVAILABLE,
      } as Dress,
    ] as Dress[];

    await dresses.forEach(async (dress) => {
      await this.dressService.create(dress);
    });
  }

  private async seedServicesForProd() {
    const services = await this.serviceService.getAll();
    if (services.length > 0) this.logger.log(`Services already exist. Skipping service seeding.`);
    else {
      try {
        await Promise.all([
          await this.seedServiceForProd(this.shop1Email),
          await this.seedServiceForProd(this.shop2Email),
          await this.seedServiceForProd(this.shop3Email),
        ]);
      } catch (error) {
        this.logger.error(`Error seeding services: ${error.message}`);
        throw new Error('Seeding services failed.');
      }
    }
  }

  private async seedServiceForProd(email: string) {
    const user = await this.userService.getByEmail(email);
    if (!user) {
      this.logger.warn(`User role ${email} not exists. Skipping seeding service.`);
      return;
    }
    const category = await this.categoryService.getOneByUserAndType(user.id, CategoryType.SERVICE);
    if (!category) {
      this.logger.warn(`User category ${email} not exists`);
    }

    const shopName = email.split('@')[0].replace('.', ' ').toUpperCase();
    const newService = {
      user,
      category,
      name: `${shopName} Service`,
      description: `${shopName} cung cấp dịch vụ may đo váy cưới`,
      images:
        'https://nicolebridal.vn/wp-content/uploads/2022/12/ao-cuoi-co-dau-cam-ho-576x864.jpg',
      ratingAverage: 0,
      ratingCount: 0,
      status: ServiceStatus.AVAILABLE,
    } as Service;

    await this.serviceService.create(newService);
  }

  private async seedAccessoriesForProd() {
    const accessories = await this.accessoryService.getAll();
    if (accessories.length > 0) {
      this.logger.log(`Accessories already exist. Skipping accessory seeding.`);
    } else {
      try {
        await Promise.all([
          await this.seedAccessoryForProd(this.shop1Email),
          await this.seedAccessoryForProd(this.shop2Email),
          await this.seedAccessoryForProd(this.shop3Email),
          await this.seedAccessoryForProd(this.shop4Email),
          await this.seedAccessoryForProd(this.shop5Email),
        ]);
      } catch (error) {
        this.logger.error(`Error seeding accessories: ${error.message}`);
        throw new Error('Seeding accessories failed.');
      }
    }
  }

  private async seedAccessoryForProd(email: string) {
    const user = await this.userService.getByEmail(email);
    if (!user) {
      this.logger.warn(`User role ${email} not exists. Skipping seeding accessory.`);
      return;
    }
    const category = await this.categoryService.getOneByUserAndType(
      user.id,
      CategoryType.ACCESSORY,
    );
    if (!category) {
      this.logger.warn(`User category ${email} not exists`);
    }

    const accessories = [
      {
        user,
        category,
        name: 'Voan cô dâu',
        description: 'Voan cô dâu tinh tế, phù hợp với nhiều kiểu tóc và trang phục cưới.',
        images: 'https://product.hstatic.net/1000003159/product/bridal_veil_master.jpg',
        sellPrice: 50000,
        rentalPrice: 25000,
        isSellable: true,
        isRentable: true,
        ratingAverage: 0,
        ratingCount: 0,
        status: AccessoryStatus.AVAILABLE,
      } as Accessory,
      {
        user,
        category,
        name: 'Vương miện cưới',
        description: 'Vương miện cưới lấp lánh, tôn vinh vẻ đẹp của cô dâu.',
        images:
          'https://linhnga.vn/wp-content/uploads/2022/08/f004a698955bf4dc9e6993d946a9f40b.jpg',
        sellPrice: 70000,
        rentalPrice: 35000,
        isSellable: true,
        isRentable: true,
        ratingAverage: 0,
        ratingCount: 0,
        status: AccessoryStatus.AVAILABLE,
      } as Accessory,
      {
        user,
        category,
        name: 'Lược cài tóc cô dâu',
        description: 'Lược cài tóc cô dâu tinh tế, hoàn hảo cho ngày trọng đại.',
        images:
          'https://linhnga.vn/wp-content/uploads/2022/08/Luoc-cai-toc-co-dau-vong-hoa-cuoi.jpg',
        sellPrice: 30000,
        rentalPrice: 15000,
        isSellable: true,
        isRentable: true,
        ratingAverage: 0,
        ratingCount: 0,
        status: AccessoryStatus.AVAILABLE,
      } as Accessory,
      {
        user,
        category,
        name: 'Phụ kiện Hair Vine',
        description: 'Phụ kiện Hair Vine tinh tế, tạo điểm nhấn cho kiểu tóc cô dâu.',
        images:
          'https://i.pinimg.com/736x/37/e7/1d/37e71dc08d23db95dd45ba22d69fc975--gold-accessories-babys-breath.jpg',
        sellPrice: 40000,
        rentalPrice: 20000,
        isSellable: true,
        isRentable: true,
        ratingAverage: 0,
        ratingCount: 0,
        status: AccessoryStatus.AVAILABLE,
      } as Accessory,
      {
        user,
        category,
        name: 'Giày cưới',
        description: 'Giày cưới sang trọng, tôn vinh vẻ đẹp của cô dâu.',
        images: 'https://linhnga.vn/wp-content/uploads/2022/08/Giay-cuoi.jpg',
        sellPrice: 100000,
        rentalPrice: 50000,
        isSellable: true,
        isRentable: true,
        ratingAverage: 0,
        ratingCount: 0,
        status: AccessoryStatus.AVAILABLE,
      } as Accessory,
    ] as Accessory[];

    await accessories.forEach(async (accessory) => {
      await this.accessoryService.create(accessory);
    });
  }

  private async seedBlogsForProd() {
    const blogs = await this.blogService.getAll();
    if (blogs.length > 0) this.logger.log(`Blogs already exist. Skipping blog seeding.`);
    else {
      try {
        await Promise.all([
          await this.seedBlogForProd(this.shop1Email),
          await this.seedBlogForProd(this.shop2Email),
          await this.seedBlogForProd(this.shop3Email),
          await this.seedBlogForProd(this.shop4Email),
          await this.seedBlogForProd(this.shop5Email),
        ]);
      } catch (error) {
        this.logger.error(`Error seeding blogs: ${error.message}`);
        throw new Error('Seeding blogs failed.');
      }
    }
  }

  private async seedBlogForProd(email: string) {
    const user = await this.userService.getByEmail(email);
    if (!user) {
      this.logger.warn(`User role ${email} not exists. Skipping seeding blog.`);
      return;
    }
    const category = await this.categoryService.getOneByUserAndType(user.id, CategoryType.BLOG);
    if (!category) {
      this.logger.warn(`User category ${email} not exists`);
    }

    for (let i = 1; i <= 5; i++) {
      const newBlog = {
        user,
        category,
        title: this.customFaker.lorem.sentence(),
        content: this.customFaker.lorem.paragraphs(50),
        images:
          'https://images2.thanhnien.vn/528068263637045248/2023/9/29/snapinstaapp38148559410051804873592488387668610735444640n1080-16960069698972083614296.jpg,https://chupanhphuyen.com/uploads/news/2024_09/co-dau-dien-vay-cuoi-suot-mot-nam-ao-cuoi-dep-tuy-hoa-phu-yen.jpg',
        isVerified: true,
        status: BlogStatus.PUBLISHED,
      } as Blog;

      await this.blogService.create(newBlog);
    }
  }
}
