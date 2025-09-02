import { ListResponse } from '@/common/base';
import { Filtering, getOrder, getWhere, Pagination, Sorting } from '@/common/decorators';
import { Contract, ContractType, User, UserRole } from '@/common/models';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { CreateUser, IdentifyAuthDto, UpdateUser, UserContactDto, UsernameDto } from '@/app/user';
import { PasswordService } from '@/app/password';
import { RedisService } from '../redis';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Contract) private readonly contractRepository: Repository<Contract>,
    private readonly passwordService: PasswordService,
    private readonly redisService: RedisService,
  ) {}

  async updateUsername(userId: string, body: UsernameDto): Promise<void> {
    const user = await this.getUserById(userId);
    if (!user) throw new NotFoundException('Không tìm thấy người dùng');

    const existingUser = await this.getByUsername(body.username);
    if (existingUser) throw new ConflictException('Username này đã tồn tại');

    user.username = body.username.trim();

    await this.userRepository.save(user);
  }

  async getUserById(id: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { id },
      withDeleted: true,
    });
  }

  async getByUsername(username: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { username },
    });
  }

  async getByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { email },
    });
  }

  async createUser(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }

  async updateUser(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }

  async create(user: CreateUser): Promise<User> {
    const existingEmail = await this.getByEmail(user.email);
    if (existingEmail) throw new BadRequestException('Không thể tạo user vì trùng lặp email');

    const existingUsername = await this.getByUsername(user.username);
    if (existingUsername) throw new BadRequestException('Không thể tạo user vì trùng lặp username');

    user.password = await this.passwordService.hashPassword(user.password);
    const contract = await this.contractRepository.findOneBy({ contractType: ContractType.CUSTOMER });
    const newUser = { ...user, contract } as User;
    return await this.userRepository.save(newUser);
  }

  async update(existingUser: User, user: UpdateUser): Promise<User> {
    if (existingUser.email !== user.email) {
      const existingEmail = await this.getByEmail(user.email);
      if (existingEmail) throw new BadRequestException('Không thể tạo user vì trùng lặp email');
    }
    if (existingUser.username !== user.username) {
      const existingUsername = await this.getByUsername(user.username);
      if (existingUsername)
        throw new BadRequestException('Không thể tạo user vì trùng lặp username');
    }
    Object.assign(existingUser, user);
    return await this.userRepository.save(existingUser);
  }

  async getUsers(
    currentRole: UserRole,
    { page, size, limit, offset }: Pagination,
    sort?: Sorting,
    filter?: Filtering,
  ): Promise<ListResponse<User>> {
    if (currentRole === UserRole.SUPER_ADMIN) {
      const order = getOrder(sort);
      const dynamicFilter = getWhere(filter);

      const where = {
        role: Not(UserRole.SUPER_ADMIN),
        ...dynamicFilter,
      };
      const [users, totalItems] = await this.userRepository.findAndCount({
        where,
        order,
        take: limit,
        skip: offset,
        withDeleted: true,
      });

      const totalPages = Math.ceil(totalItems / size);

      return {
        message: 'Đây là toàn bộ danh sách tài khoản người dùng',
        statusCode: HttpStatus.OK,
        pageIndex: page,
        pageSize: size,
        totalItems,
        totalPages,
        hasNextPage: page + 1 < totalPages,
        hasPrevPage: 0 < page,
        items: users,
      };
    } else {
      const order = getOrder(sort);
      const dynamicFilter = getWhere(filter);

      const where = {
        role: Not(In([UserRole.SUPER_ADMIN, UserRole.ADMIN])),
        ...dynamicFilter,
      };
      const [users, totalItems] = await this.userRepository.findAndCount({
        where,
        order,
        take: limit,
        skip: offset,
        withDeleted: true,
      });

      const totalPages = Math.ceil(totalItems / size);

      return {
        message: 'Đây là toàn bộ danh sách tài khoản người dùng',
        statusCode: HttpStatus.OK,
        pageIndex: page,
        pageSize: size,
        totalItems,
        totalPages,
        hasNextPage: page + 1 < totalPages,
        hasPrevPage: 0 < page,
        items: users,
      };
    }
  }

  async getUser(currentRole: UserRole, id: string): Promise<User> {
    if (currentRole === UserRole.SUPER_ADMIN) {
      const existingUser = await this.getUserById(id);
      if (!existingUser) throw new NotFoundException('Không tìm thấy user nào');
      return existingUser;
    } else {
      const existingUser = await this.getUserById(id);
      if (!existingUser) throw new NotFoundException('Không tìm thấy user nào');
      if (existingUser.role === UserRole.SUPER_ADMIN || existingUser.role === UserRole.ADMIN)
        throw new ForbiddenException('Không có quyền truy vấn user này');
      return existingUser;
    }
  }

  async createUserForApi(currentRole: UserRole, user: CreateUser): Promise<User> {
    if (currentRole === UserRole.SUPER_ADMIN) {
      if (user.role === UserRole.SUPER_ADMIN)
        throw new ForbiddenException('Không thể tạo 1 tài khoản Super Admin mới');
      return this.create(user);
    } else {
      if (user.role === UserRole.SUPER_ADMIN || user.role === UserRole.ADMIN)
        throw new ForbiddenException('Không thể tạo 1 tài khoản Super Admin | Admin mới');
      return this.create(user);
    }
  }

  async updateUserForApi(currentRole: UserRole, id: string, user: UpdateUser): Promise<User> {
    const existingUser = await this.getUser(currentRole, id);
    if (currentRole === UserRole.SUPER_ADMIN) {
      if (existingUser.role === UserRole.SUPER_ADMIN)
        throw new ForbiddenException('Không có quyền thay đổi role user này');
      if (user.role === UserRole.SUPER_ADMIN)
        throw new ForbiddenException('Không thể thay role thành Super Admin');
      return this.update(existingUser, user);
    } else {
      if (existingUser.role === UserRole.ADMIN || existingUser.role === UserRole.SUPER_ADMIN)
        throw new ForbiddenException('Không có quyền thay đổi role user này');
      if (user.role === UserRole.SUPER_ADMIN || user.role === UserRole.ADMIN)
        throw new ForbiddenException('Không thể đổi role Admin | System Admin');
      return this.update(existingUser, user);
    }
  }

  async deleteUserForApi(currentRole: UserRole, id: string) {
    const existingUser = await this.getUser(currentRole, id);
    if (existingUser.deletedAt !== null) throw new BadRequestException('User đã xóa');
    if (currentRole === UserRole.SUPER_ADMIN) {
      if (existingUser.role === UserRole.SUPER_ADMIN)
        throw new ForbiddenException('Không có quyền xóa user này');
      await this.userRepository.softDelete(id);
    } else {
      if (existingUser.role === UserRole.SUPER_ADMIN || existingUser.role === UserRole.ADMIN)
        throw new ForbiddenException('Không có quyền xóa user này');
      await this.userRepository.softDelete(id);
    }
  }

  async restoreUserForApi(currentRole: UserRole, id: string) {
    const existingUser = await this.getUser(currentRole, id);
    if (existingUser.deletedAt === null) throw new BadRequestException('User đang hoạt động');
    if (currentRole === UserRole.SUPER_ADMIN) {
      await this.userRepository.restore(id);
    } else {
      if ([UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(existingUser.role))
        throw new ForbiddenException('Không có quyền khôi phục user này');
      await this.userRepository.restore(id);
    }
  }

  async getAllForSeeding(): Promise<User[]> {
    return this.userRepository.find({ withDeleted: true });
  }

  async getContactInformation(userId: string): Promise<UserContactDto> {
    const user = await this.getUserById(userId);
    if (!user) throw new NotFoundException('Không tìm thấy người dùng');

    if (!user.isIdentified) throw new ForbiddenException('Người dùng chưa xác thực danh tính');

    const userContact = {
      email: user.email,
      phone: user.phone,
      address: user.address,
    } as UserContactDto;

    return userContact;
  }

  async identifyUser(userId: string, body: IdentifyAuthDto) {
    const user = await this.getUserById(userId);
    if (!user) throw new NotFoundException('Không tìm thấy người dùng');

    const hashedOtp = await this.redisService.get(`${userId}:phone-otp`);
    if (!hashedOtp) throw new NotFoundException('OTP đã hết hạn hoặc không tồn tại');
    if (!(await this.passwordService.comparePassword(body.otp, hashedOtp)))
      throw new BadRequestException('Mã OTP không chính xác');

    const phone = body.phone.trim();

    //chuyển từ 0xxxxxxxxx -> +84xxxxxxxxx
    if (phone.startsWith('0')) {
      user.phone = '+84' + phone.slice(1);
    }
    if (phone.startsWith('84')) {
      user.phone = '+' + phone;
    }
    user.isIdentified = true;

    await this.userRepository.save(user);
  }

  async getSelf(id: string): Promise<User> {
    const user = await this.getUserById(id);
    if (!user) throw new NotFoundException('Không tìm thấy người dùng');
    return user;
  }

  async updateFavDresses(id: string, favDresses: string[] | null): Promise<void> {
    await this.userRepository.update(id, { favDresses } as User);
  }

  async updateFavShops(id: string, favShops: string[] | null): Promise<void> {
    await this.userRepository.update(id, { favShops } as User);
  }
}
