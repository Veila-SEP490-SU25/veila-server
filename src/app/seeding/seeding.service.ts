import { AccessoryService } from '@/app/accessory';
import { BlogService } from '@/app/blog';
import { CategoryService } from '@/app/category';
import { DressService } from '@/app/dress';
import { PasswordService } from '@/app/password';
import { ServiceService } from '@/app/service';
import { ShopService } from '@/app/shop';
import { UserService } from '@/app/user';
import {
  Accessory,
  AccessoryStatus,
  Blog,
  BlogStatus,
  Category,
  CategoryType,
  Dress,
  DressStatus,
  Service,
  ServiceStatus,
  Shop,
  User,
  UserRole,
  UserStatus,
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
  ) {
    // Khởi tạo faker với locale tiếng Việt
    this.customFaker = new Faker({
      locale: vi,
    });
  }

  async onModuleInit() {
    this.logger.log('Seeding module initialized. Starting seeding process...');
    await this.seedSystemAccounts();
    Promise.all([await this.seedUsersRoleCustomer(), await this.seedUsersRoleShop()])
      .then(async () => {
        await this.seedCategories();
        await this.seedShops();
      })
      .then(async () => {
        await this.seedAccessories();
        await this.seedBlogs();
        await this.seedDresses();
        await this.seedServices();
      });
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
    if (services.length >= 25) {
      this.logger.log(`Enough data available for service. Skipping seeding`);
      return;
    }
    try {
      Promise.all([
        await this.seedService(1),
        await this.seedService(1),
        await this.seedService(1),
        await this.seedService(1),
        await this.seedService(1),
        await this.seedService(2),
        await this.seedService(2),
        await this.seedService(2),
        await this.seedService(2),
        await this.seedService(2),
        await this.seedService(3),
        await this.seedService(3),
        await this.seedService(3),
        await this.seedService(3),
        await this.seedService(3),
        await this.seedService(4),
        await this.seedService(4),
        await this.seedService(4),
        await this.seedService(4),
        await this.seedService(4),
        await this.seedService(5),
        await this.seedService(5),
        await this.seedService(5),
        await this.seedService(5),
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
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      status: ServiceStatus.ACTIVE,
      ratingAverage: this.customFaker.number.float({ min: 3, max: 5, fractionDigits: 2 }),
      ratingCount: this.customFaker.number.int({ min: 0, max: 100 }),
    } as Service;

    const createService = await this.serviceService.create(newService);
    this.logger.log(
      `Service created successfully! Owner's Email: ${user.email}, Name: ${createService.name}`,
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

  private async seedShops() {
    const shops = await this.shopService.getAll();
    if (shops.length >= 25) {
      this.logger.log(`Enough data available for shop. Skipping seeding`);
      return;
    }
    try {
      Promise.all([
        await this.seedShop(1),
        await this.seedShop(1),
        await this.seedShop(1),
        await this.seedShop(1),
        await this.seedShop(1),
        await this.seedShop(2),
        await this.seedShop(2),
        await this.seedShop(2),
        await this.seedShop(2),
        await this.seedShop(2),
        await this.seedShop(3),
        await this.seedShop(3),
        await this.seedShop(3),
        await this.seedShop(3),
        await this.seedShop(3),
        await this.seedShop(4),
        await this.seedShop(4),
        await this.seedShop(4),
        await this.seedShop(4),
        await this.seedShop(4),
        await this.seedShop(5),
        await this.seedShop(5),
        await this.seedShop(5),
        await this.seedShop(5),
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
    this.logger.log(`Seeding shop with email: ${user.email}`);

    const newShop = {
      user,
      name: faker.company.name(),
      taxCode: this.customFaker.string.numeric({ length: 10 }),
      phone: `+84${this.customFaker.string.numeric({ length: 9 })}`,
      email: faker.internet.email(),
      address: `${faker.location.streetAddress()}, ${faker.location.city()}`,
      description: faker.company.name(),
      logoUrl: this.customFaker.image.avatar(),
      coverUrl: this.customFaker.image.url(),
      status: 'ACTIVE',
      isVerified: true,
    } as Shop;

    const createShop = await this.shopService.create(newShop);
    this.logger.log(
      `Shop created successfully! Owner's Email: ${user.email}, Name: ${createShop.name}`,
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
      phone: this.customFaker.datatype.boolean()
        ? `+84${this.customFaker.string.numeric({ length: 9 })}`
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
      isIdentified: role !== UserRole.CUSTOMER,
      images: null,
    } as User;

    const createdUser = await this.userService.createUser(newUser);
    this.logger.log(
      `Account created successfully! Email: ${email}, Username: ${createdUser.username}, Role: ${role}`,
    );
  }
}
