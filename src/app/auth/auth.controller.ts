import {
  ChangePasswordDto,
  LoginDto,
  LoginGoogleDto,
  RegisterDto,
  RequestOtpDto,
  ResetPasswordDto,
  TokenResponse,
  VerifyOtpDto,
} from '@/app/auth/auth.dto';
import { AuthService } from '@/app/auth/auth.service';
import { ItemResponse } from '@/common/base';
import { Token, UserId } from '@/common/decorators';
import { AuthGuard } from '@/common/guards';
import { Body, Controller, Get, HttpStatus, Post, Put, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { RefreshTokenDto } from '@/app/auth/auth.dto';
import { User } from '@/common/models';
import { UpdateProfile } from '@/app/user';
import { Public } from '@/common/decorators/public.decorator';

@Controller('auth')
@ApiTags('Auth Controller')
@ApiExtraModels(ItemResponse, TokenResponse, User)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({
    summary: 'Đăng nhập',
    description: 'Đăng nhập tài khoản hiện có',
  })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            item: { $ref: getSchemaPath(TokenResponse) },
          },
        },
      ],
    },
  })
  async login(@Body() body: LoginDto): Promise<ItemResponse<TokenResponse>> {
    const token = await this.authService.login(body);
    return {
      statusCode: HttpStatus.OK,
      message: 'Đăng nhập thành công.',
      item: token,
    };
  }

  @Post('register')
  @ApiOperation({
    summary: 'Đăng ký tài khoản',
    description: 'Đăng ký tài khoản mới',
  })
  @ApiBody({ type: RegisterDto })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            item: {
              type: 'string',
              description: 'ID của người dùng đã đăng ký',
              example: 'userId',
            },
          },
        },
      ],
    },
  })
  async register(@Body() body: RegisterDto): Promise<ItemResponse<string>> {
    const userId = await this.authService.register(body);
    return {
      statusCode: HttpStatus.OK,
      message: 'Đăng ký tài khoản thành công.',
      item: userId,
    };
  }

  @Post('request-otp')
  @ApiOperation({
    summary: 'Yêu cầu mã xác thực',
    description: 'Yêu cầu mã xác thực để đăng ký tài khoản',
  })
  @ApiBody({ type: RequestOtpDto })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            item: {
              type: 'string',
              description: 'ID của người dùng đã yêu cầu mã xác thực',
              example: 'userId',
            },
          },
        },
      ],
    },
  })
  async requestOtp(@Body() body: RequestOtpDto): Promise<ItemResponse<string>> {
    const userId = await this.authService.requestOTP(body.email);
    return {
      statusCode: HttpStatus.OK,
      message: 'Yêu cầu mã xác thực thành công.',
      item: userId,
    };
  }

  @Post('verify-otp')
  @ApiOperation({
    summary: 'Xác thực mã OTP',
    description: 'Xác thực mã OTP để hoàn tất đăng ký tài khoản',
  })
  @ApiBody({ type: VerifyOtpDto })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            item: { $ref: getSchemaPath(TokenResponse) },
          },
        },
      ],
    },
  })
  async verifyOtp(@Body() body: VerifyOtpDto): Promise<ItemResponse<TokenResponse>> {
    const token = await this.authService.verifyOTP(body.userId, body.otp);
    return {
      statusCode: HttpStatus.OK,
      message: 'Xác thực mã OTP thành công.',
      item: token,
    };
  }

  @Post('refresh-token')
  @ApiOperation({
    summary: 'Làm mới token',
    description: 'Làm mới token để duy trì phiên làm việc',
  })
  @ApiBody({ type: RefreshTokenDto })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            item: { $ref: getSchemaPath(TokenResponse) },
          },
        },
      ],
    },
  })
  async refreshToken(@Body() body: RefreshTokenDto): Promise<ItemResponse<TokenResponse>> {
    const token = await this.authService.refreshToken(body.refreshToken);
    return {
      statusCode: HttpStatus.OK,
      message: 'Làm mới token thành công.',
      item: token,
    };
  }

  @Post('logout')
  @ApiOperation({
    summary: 'Đăng xuất',
    description: 'Đăng xuất khỏi tài khoản',
  })
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            item: { example: null },
          },
        },
      ],
    },
  })
  async logout(@UserId() userId: string, @Token() token: string): Promise<ItemResponse<null>> {
    await this.authService.logout(userId, token);
    return {
      statusCode: HttpStatus.OK,
      message: 'Đăng xuất thành công.',
      item: null,
    };
  }

  @Get('me')
  @ApiOperation({
    summary: 'Lấy thông tin người dùng',
    description: 'Lấy thông tin người dùng hiện tại',
  })
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            item: { $ref: getSchemaPath(User) },
          },
        },
      ],
    },
  })
  async getMe(@UserId() userId: string): Promise<ItemResponse<User>> {
    const user = await this.authService.getMe(userId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Lấy thông tin người dùng thành công.',
      item: user,
    };
  }

  @Put('me')
  @ApiOperation({
    summary: 'Cập nhật thông tin người dùng',
    description: 'Cập nhật thông tin người dùng hiện tại',
  })
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiBody({ type: UpdateProfile })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            item: { $ref: getSchemaPath(User) },
          },
        },
      ],
    },
  })
  async updateProfile(
    @UserId() userId: string,
    @Body() body: UpdateProfile,
  ): Promise<ItemResponse<User>> {
    const user = await this.authService.updateProfile(userId, body);
    return {
      statusCode: HttpStatus.OK,
      message: 'Cập nhật thông tin người dùng thành công.',
      item: user,
    };
  }

  @Post('change-password')
  @ApiOperation({
    summary: 'Thay đổi mật khẩu',
    description: 'Thay đổi mật khẩu của người dùng hiện tại',
  })
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiBody({ type: ChangePasswordDto })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            item: { example: null },
          },
        },
      ],
    },
  })
  async changePassword(
    @UserId() userId: string,
    @Body() body: ChangePasswordDto,
  ): Promise<ItemResponse<null>> {
    await this.authService.changePassword(userId, body);
    return {
      statusCode: HttpStatus.OK,
      message: 'Thay đổi mật khẩu thành công.',
      item: null,
    };
  }

  @Post('reset-password')
  @ApiOperation({
    summary: 'Đặt lại mật khẩu',
    description: 'Đặt lại mật khẩu cho người dùng',
  })
  @ApiBody({ type: ResetPasswordDto })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            item: { example: null },
          },
        },
      ],
    },
  })
  async resetPassword(@Body() body: ResetPasswordDto): Promise<ItemResponse<null>> {
    await this.authService.resetPassword(body);
    return {
      statusCode: HttpStatus.OK,
      message: 'Đặt lại mật khẩu thành công.',
      item: null,
    };
  }

  @Public()
  @Post('google/login')
  @ApiOperation({
    summary: 'Đăng nhập với tài khoản google',
    description:
      'đăng nhập bằng tài khoản google, nếu chưa có thì tạo tài khoản mới và tiếp tục đăng nhập',
  })
  @ApiBody({ type: LoginGoogleDto })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            item: {
              $ref: getSchemaPath(TokenResponse),
            },
          },
        },
      ],
    },
  })
  async loginGoogle(@Body() body: LoginGoogleDto): Promise<ItemResponse<TokenResponse>> {
    const response = await this.authService.loginGoogle(body);

    return {
      statusCode: HttpStatus.OK,
      message: 'Đăng nhập bằng tài khoản Google thành công',
      item: response,
    };
  }
}
