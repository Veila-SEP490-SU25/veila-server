import {
  ChangePasswordDto,
  LoginDto,
  LoginGoogleDto,
  RegisterDto,
  ResetPasswordDto,
  TokenResponse,
} from '@/app/auth/auth.dto';
import { ContractService } from '@/app/contract';
import { MailService } from '@/app/mail';
import { PasswordService } from '@/app/password';
import { RedisService } from '@/app/redis';
import { TokenService } from '@/app/token';
import { UpdateProfile, UserService } from '@/app/user';
import { WalletService } from '@/app/wallet';
import { ContractType, User, UserRole, UserStatus } from '@/common/models';
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
    private readonly contractService: ContractService,
    private readonly walletService: WalletService,
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
    const contract = await this.contractService.findAvailableContract(ContractType.CUSTOMER);
    const activationCode = this.passwordService.generateOTP(6);
    const hashedActivationCode = await this.passwordService.hashPassword(activationCode);
    const hashedPassword = await this.passwordService.hashPassword(body.password);
    const newUser = await this.userService.createUser({
      ...body,
      username: new Date().getTime().toString(),
      isVerified: false,
      password: hashedPassword,
      id: uuidv4(),
      role: UserRole.CUSTOMER,
      isIdentified: false,
      status: UserStatus.ACTIVE,
      contract,
    } as User);
    await this.walletService.createWalletForUser(newUser.id);
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

  async updateProfile(userId: string, updateData: UpdateProfile): Promise<User> {
    const user = await this.userService.getUserById(userId);
    if (!user) throw new NotFoundException('Tài khoản không tồn tại trong hệ thống.');
    Object.assign(user, updateData);
    const updatedUser = await this.userService.updateUser(user);
    return updatedUser;
  }

  async changePassword(
    userId: string,
    { currentPassword, newPassword, confirmPassword }: ChangePasswordDto,
  ): Promise<void> {
    const user = await this.userService.getUserById(userId);
    if (!user) throw new NotFoundException('Tài khoản không tồn tại trong hệ thống.');
    if (newPassword !== confirmPassword)
      throw new ForbiddenException('Mật khẩu mới và xác nhận mật khẩu không khớp.');
    const isOldPasswordValid = await this.passwordService.comparePassword(
      currentPassword,
      user.password,
    );
    if (!isOldPasswordValid) throw new ForbiddenException('Mật khẩu hiện tại không chính xác.');
    const hashedNewPassword = await this.passwordService.hashPassword(newPassword);
    user.password = hashedNewPassword;
    await this.userService.updateUser(user);
  }

  async resetPassword({ userId, otp, newPassword }: ResetPasswordDto): Promise<void> {
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
    const hashedNewPassword = await this.passwordService.hashPassword(newPassword);
    user.password = hashedNewPassword;
    await this.userService.updateUser(user);
  }

  async loginGoogle(body: LoginGoogleDto) {
    const user = await this.userService.getByEmail(body.email);

    //đã tồn tại user có email này
    if (user) {
      const tokenResponse = await this.loginByEmail(body.email);
      return {
        accessToken: tokenResponse.accessToken,
        refreshToken: tokenResponse.refreshToken,
      };
    }

    //user chưa tồn tại
    const randomPassword = this.passwordService.generatePassword(8);
    const { firstName, lastName, middleName } = await this.splitVietnameseName(body.fullname);

    const registerDto = new RegisterDto();
    registerDto.email = body.email;
    registerDto.password = randomPassword;
    registerDto.firstName = firstName;
    registerDto.lastName = lastName;
    registerDto.middleName = middleName;

    const tokenResponse = await this.registerGoogleUser(registerDto);

    await this.mailService.sendWelcomeWithPasswordEmail(body.email, body.fullname, randomPassword);

    return tokenResponse;
  }

  private async registerGoogleUser(body: RegisterDto): Promise<TokenResponse> {
    const user = await this.userService.getByEmail(body.email);
    if (user) throw new ForbiddenException('Tài khoản đã tồn tại trong hệ thống.');
    const contract = await this.contractService.findAvailableContract(ContractType.CUSTOMER);
    const hashedPassword = await this.passwordService.hashPassword(body.password);
    const newUser = await this.userService.createUser({
      ...body,
      username: new Date().getTime().toString(),
      isVerified: true,
      password: hashedPassword,
      id: uuidv4(),
      role: UserRole.CUSTOMER,
      isIdentified: false,
      status: UserStatus.ACTIVE,
      contract,
    } as User);
    await this.walletService.createWalletForUser(newUser.id);

    return this.loginByEmail(body.email);
  }

  private async loginByEmail(email: string): Promise<TokenResponse> {
    const user = await this.userService.getByEmail(email);
    if (!user) throw new NotFoundException('Tài khoản không tồn tại trong hệ thống.');
    await this.checkValidUser(user, false);
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

  private async splitVietnameseName(fullname: string) {
    const parts = fullname.trim().split(/\s+/);
    if (parts.length === 1) {
      return {
        firstName: parts[0],
        lastName: '',
        middleName: '',
      };
    }

    return {
      firstName: parts[0],
      lastName: parts[parts.length - 1],
      middleName: parts.slice(1, -1).join(' ') || '',
    };
  }
}
