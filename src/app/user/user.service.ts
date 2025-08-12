import { ListResponse } from '@/common/base';
import { Filtering, getOrder, getWhere, Pagination, Sorting } from '@/common/decorators';
import { User, UserRole } from '@/common/models';
import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { CreateUser, IdentifyAuthDto, UpdateUser, UserContactDto } from '@/app/user';
import { PasswordService } from '@/app/password';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly passwordService: PasswordService,
  ) {}

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
    const newUser = { ...user };
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

  async getUsersForSuperAdmin(
    { page, size, limit, offset }: Pagination,
    sort?: Sorting,
    filter?: Filtering,
  ): Promise<ListResponse<User>> {
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
  }

  async getUserForSuperAdmin(id: string): Promise<User> {
    const existingUser = await this.getUserById(id);
    if (!existingUser) throw new NotFoundException('Không tìm thấy user nào');
    return existingUser;
  }

  async createUserForSuperAdmin(user: CreateUser): Promise<User> {
    if (user.role === UserRole.SUPER_ADMIN)
      throw new ForbiddenException('Không thể tạo 1 tài khoản Super Admin mới');
    return this.create(user);
  }

  async updateUserForSuperAdmin(id: string, user: UpdateUser): Promise<User> {
    const existingUser = await this.getUserForSuperAdmin(id);
    if (existingUser.role === UserRole.SUPER_ADMIN)
      throw new ForbiddenException('Không có quyền thay đổi role user này');
    if (user.role === UserRole.SUPER_ADMIN)
      throw new ForbiddenException('Không thể thay role thành Super Admin');
    return this.update(existingUser, user);
  }

  async deleteUserForSuperAdmin(id: string) {
    const existingUser = await this.getUserForSuperAdmin(id);
    if (existingUser.deletedAt !== null) throw new BadRequestException('User đã xóa');
    if (existingUser.role === UserRole.SUPER_ADMIN)
      throw new ForbiddenException('Không có quyền xóa user này');
    await this.userRepository.softDelete(id);
  }

  async restoreUserForSuperAdmin(id: string) {
    const existingUser = await this.getUserForSuperAdmin(id);
    if (existingUser.deletedAt === null) throw new BadRequestException('User đang hoạt động');
    await this.userRepository.restore(id);
  }

  async getUsersForAdmin(
    { page, size, limit, offset }: Pagination,
    sort?: Sorting,
    filter?: Filtering,
  ): Promise<ListResponse<User>> {
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

  async getUserForAdmin(id: string): Promise<User> {
    const existingUser = await this.getUserById(id);
    if (!existingUser) throw new NotFoundException('Không tìm thấy user nào');
    if (existingUser.role === UserRole.SUPER_ADMIN || existingUser.role === UserRole.ADMIN)
      throw new ForbiddenException('Không có quyền truy vấn user này');
    return existingUser;
  }

  async createUserForAdmin(user: CreateUser): Promise<User> {
    if (user.role === UserRole.SUPER_ADMIN || user.role === UserRole.ADMIN)
      throw new ForbiddenException('Không thể tạo 1 tài khoản Super Admin | Admin mới');
    return this.create(user);
  }

  async updateUserForAdmin(id: string, user: UpdateUser): Promise<User> {
    const existingUser = await this.getUserForAdmin(id);
    if (!existingUser) throw new NotFoundException('Không tìm thấy user nào');
    if (existingUser.role === UserRole.ADMIN || existingUser.role === UserRole.SUPER_ADMIN)
      throw new ForbiddenException('Không có quyền thay đổi role user này');
    if (user.role === UserRole.SUPER_ADMIN || user.role === UserRole.ADMIN)
      throw new ForbiddenException('Không thể đổi role Admin | System Admin');
    return this.update(existingUser, user);
  }

  async deleteUserForAdmin(id: string) {
    const existingUser = await this.getUserForAdmin(id);
    if (existingUser.deletedAt !== null) throw new BadRequestException('User đã xóa');
    if (existingUser.role === UserRole.SUPER_ADMIN || existingUser.role === UserRole.ADMIN)
      throw new ForbiddenException('Không có quyền xóa user này');
    await this.userRepository.softDelete(id);
  }

  async restoreUserForAdmin(id: string) {
    const existingUser = await this.getUserForAdmin(id);
    if ([UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(existingUser.role))
      throw new ForbiddenException('Không có quyền khôi phục user này');
    if (existingUser.deletedAt === null) throw new BadRequestException('User đang hoạt động');
    await this.userRepository.restore(id);
  }

  async getAll(): Promise<User[]> {
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

    user.phone = body.phone;
    user.isIdentified = true;

    await this.userRepository.save(user);
  }

  async getSelf(id: string): Promise<User> {
    const user = await this.getUserById(id);
    if (!user) throw new NotFoundException('Không tìm thấy người dùng');
    return user;
  }
}
