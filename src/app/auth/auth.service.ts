import { LoginDto, RegisterDto, TokenResponse } from '@/app/auth/auth.dto';
import { MailService } from '@/app/mail';
import { PasswordService } from '@/app/password';
import { RedisService } from '@/app/redis';
import { TokenService } from '@/app/token';
import { UserService } from '@/app/user';
import { User, UserRole, UserStatus } from '@/common/models';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private readonly redisService: RedisService,
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly mailService: MailService,
    private readonly passwordService: PasswordService,
  ) {}

  async login(body: LoginDto): Promise<TokenResponse> {
    const user = await this.userService.getByEmail(body.email);
    if (!user) throw new NotFoundException('Tài khoản không tồn tại trong hệ thống.');
    await this.checkValidUser(user, false);
    const isPasswordValid = await this.passwordService.comparePassword(
      body.password,
      user.password,
    );
    if (!isPasswordValid) throw new ForbiddenException('Mật khẩu không chính xác.');
    const accessToken = await this.tokenService.createToken(user, {
      isRefresh: false,
    });
    const refreshToken = await this.tokenService.createToken(user, {
      isRefresh: true,
    });
    const hashedRefreshToken = await this.passwordService.hashPassword(refreshToken);
    await this.redisService.set(
      `user:refreshToken:${user.id}`,
      hashedRefreshToken,
      60 * 60 * 24 * 7 * 1000,
    );
    return {
      accessToken,
      refreshToken,
    };
  }

  async register(body: RegisterDto): Promise<string> {
    const user = await this.userService.getByEmail(body.email);
    if (user) throw new ForbiddenException('Tài khoản đã tồn tại trong hệ thống.');
    const activationCode = this.passwordService.generateOTP(6);
    const hashedActivationCode = await this.passwordService.hashPassword(activationCode);
    const newUser = await this.userService.createUser({
      ...body,
      username: new Date().getTime().toString(),
      isVerified: false,
      password: hashedActivationCode,
      id: uuidv4(),
      role: UserRole.CUSTOMER,
      isIdentified: false,
      status: UserStatus.ACTIVE,
    } as User);
    await Promise.all([
      this.redisService.set(`user:otp:${newUser.id}`, hashedActivationCode, 5 * 60 * 1000),
      this.mailService.sendOtpEmail(
        'Mã xác thực Veila',
        newUser.email,
        newUser.lastName,
        activationCode,
      ),
    ]);
    return newUser.id;
  }

  async refreshToken(refreshToken: string): Promise<TokenResponse> {
    const decodedToken = await this.tokenService
      .validateToken(refreshToken, {
        isRefresh: true,
      })
      .catch(() => {
        throw new UnauthorizedException('Mã xác thực không hợp lệ hoặc đã hết hạn.');
      });
    const userId = decodedToken.id;
    const storedRefreshToken = await this.redisService.get(`user:refreshToken:${userId}`);
    if (!storedRefreshToken)
      throw new UnauthorizedException('Mã xác thực không hợp lệ hoặc đã hết hạn.');
    const isValid = await this.passwordService.comparePassword(refreshToken, storedRefreshToken);
    if (!isValid) {
      await this.redisService.del(`user:refreshToken:${userId}`);
      throw new UnauthorizedException('Mã xác thực không chính xác.');
    }
    const user = await this.userService.getUserById(userId);
    if (!user) throw new NotFoundException('Tài khoản không tồn tại trong hệ thống.');
    const accessToken = await this.tokenService.createToken(user, {
      isRefresh: false,
    });
    return {
      accessToken,
      refreshToken,
    };
  }

  async requestOTP(email: string): Promise<string> {
    const user = await this.userService.getByEmail(email);
    if (!user) throw new NotFoundException('Tài khoản không tồn tại trong hệ thống.');
    await this.checkValidUser(user, true);
    const otp = this.passwordService.generateOTP(6);
    const hashedOtp = await this.passwordService.hashPassword(otp);
    await Promise.all([
      await this.redisService.set(`user:otp:${user.id}`, hashedOtp, 5 * 60 * 1000),
      await this.mailService.sendOtpEmail('Mã xác thực Veila', user.email, user.lastName, otp),
    ]);
    return user.id;
  }

  async verifyOTP(userId: string, otp: string): Promise<TokenResponse> {
    const storedOtp = await this.redisService.get(`user:otp:${userId}`);
    if (!storedOtp) throw new ForbiddenException('Mã xác thực không hợp lệ hoặc đã hết hạn.');
    const isValid = await this.passwordService.comparePassword(otp, storedOtp);
    if (!isValid) {
      await this.redisService.del(`user:otp:${userId}`);
      throw new ForbiddenException('Mã xác thực không chính xác.');
    } else {
      await this.redisService.del(`user:otp:${userId}`);
    }
    const user = await this.userService.getUserById(userId);
    if (!user) throw new NotFoundException('Tài khoản không tồn tại trong hệ thống.');
    await this.checkValidUser(user, true);
    this.userService.updateUser({
      ...user,
      isVerified: true,
      status: UserStatus.ACTIVE,
    });
    const accessToken = await this.tokenService.createToken(user, {
      isRefresh: false,
    });
    const refreshToken = await this.tokenService.createToken(user, {
      isRefresh: true,
    });
    const hashedRefreshToken = await this.passwordService.hashPassword(refreshToken);
    await this.redisService.set(
      `user:refreshToken:${user.id}`,
      hashedRefreshToken,
      60 * 60 * 24 * 7 * 1000,
    );
    return {
      accessToken,
      refreshToken,
    };
  }

  private async checkValidUser(user: User, requestOTP: boolean): Promise<void> {
    if (user.status === UserStatus.BANNED)
      throw new ForbiddenException(
        'Tài khoản đã bị cấm. Vui lòng liên hệ với quản trị viên để biết thêm thông tin.',
      );
    if (user.deletedAt !== null)
      throw new ForbiddenException(
        'Tài khoản đã bị xoá. Vui lòng liên hệ với quản trị viên để biết thêm thông tin.',
      );
    if (user.status === UserStatus.SUSPENDED)
      throw new ForbiddenException(
        'Tài khoản đã đang bị hạn chế đăng nhập. Vui lòng liên hệ với quản trị viên để biết thêm thông tin.',
      );
    if (requestOTP !== true) {
      if (!user.isVerified) throw new UnauthorizedException('Tài khoản chưa được xác thực.');
      if (user.status === UserStatus.INACTIVE) {
        throw new UnauthorizedException(
          'Tài khoản đã bị vô hiệu hoá. Vui lòng kiểm tra email để kích hoạt lại tài khoản.',
        );
      }
    }
  }

  async logout(userId: string, token: string): Promise<void> {
    await this.redisService.set(`token:blacklist:${token}`, 'true', 15 * 60 * 1000);
    await this.redisService.del(`user:refreshToken:${userId}`);
    await this.redisService.del(`user:otp:${userId}`);
  }

  async getMe(userId: string): Promise<User> {
    const user = await this.userService.getUserById(userId);
    if (!user) throw new NotFoundException('Tài khoản không tồn tại trong hệ thống.');
    return user;
  }
}
