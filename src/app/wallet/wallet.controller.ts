import { ItemResponse, ListResponse } from '@/common/base';
import {
  // BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import {
  DepositViaPayOSDto,
  DepositViaPayOSResponse,
  PINWalletDto,
  UpdateBankDto,
  WalletDto,
  WebhookDto,
} from './wallet.dto';
import {
  Filtering,
  FilteringParams,
  Pagination,
  PaginationParams,
  Roles,
  Sorting,
  SortingParams,
  UserId,
} from '@/common/decorators';
import { TransactionStatus, UserRole, Wallet } from '@/common/models';
import { WalletService } from './wallet.service';
import { AuthGuard, RolesGuard } from '@/common/guards';
import { WithdrawTransactionDto, TransactionService } from '../transaction';

@Controller('wallets')
@ApiTags('Wallet Controller')
@ApiBearerAuth()
@ApiExtraModels(ItemResponse, ListResponse, WalletDto, Wallet, DepositViaPayOSResponse)
export class WalletController {
  constructor(
    private readonly walletService: WalletService,
    private readonly transactionService: TransactionService,
  ) {}

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF)
  @ApiOperation({
    summary:
      'Lấy danh sách tất cả các ví điện tử với phân trang, sắp xếp và lọc (dành cho quản trị viên)',
    description: `
            **Hướng dẫn sử dụng:**

            - Trả về danh sách ví điện tử dưới quyền quản trị/quản lý.
            - Hỗ trợ phân trang, sắp xếp và lọc.
            - Page bắt đầu từ số 0.
            - Sort theo format: [tên field]:[asc/desc].
            - Các trường có thể sort: available_balance, locked_balance.
            - Filter theo format: [tên_field]:[eq|neq|gt|gte|lt|lte|like|nlike|in|nin]:[keyword]; hoặc [tên_field]:[isnull|isnotnull].
        `,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    default: 0,
    description: 'Trang hiện tại (bắt đầu từ 0)',
  })
  @ApiQuery({
    name: 'size',
    required: false,
    type: Number,
    default: 10,
    description: 'Số lượng mỗi trang',
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    type: String,
    description: 'Sắp xếp theo trường: ví dụ: locked_balance:asc',
  })
  @ApiQuery({
    name: 'filter',
    required: false,
    type: String,
    description: 'Lọc theo trường: ví dụ',
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ListResponse) },
        {
          properties: {
            items: { $ref: getSchemaPath(WalletDto) },
          },
        },
      ],
    },
  })
  async getAllWalletsForAdmin(
    @PaginationParams() { page, size, limit, offset }: Pagination,
    @SortingParams(['available_balance', 'locked_balance', 'bin', 'bank_number']) sort?: Sorting,
    @FilteringParams(['user_id', 'available_balance', 'locked_balance', 'bin', 'bank_number'])
    filter?: Filtering,
  ): Promise<ListResponse<WalletDto>> {
    const [wallets, totalItems] = await this.walletService.getWalletsForAdmin(
      limit,
      offset,
      sort,
      filter,
    );
    const totalPages = Math.ceil(totalItems / limit);
    return {
      message: 'Đây là danh sách tất cả ví điện tử',
      statusCode: HttpStatus.OK,
      pageIndex: page,
      pageSize: size,
      totalItems,
      totalPages,
      hasNextPage: page + 1 < totalPages,
      hasPrevPage: 0 > page,
      items: wallets,
    };
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({
    summary: 'Lấy chi tiết của ví điện tử (admin/super admin) only)',
    description: `
      **Hướng dẫn sử dụng:**

      - Truyền \`id\` của ví điện tử trên URL.
      - Nếu không tìm thấy sẽ trả về lỗi.
      - Nếu tìm thấy sẽ trả về chi tiết ví điện tử.
    `,
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            item: { $ref: getSchemaPath(Wallet) },
          },
        },
      ],
    },
  })
  async getWalletById(@Param('id') id: string): Promise<ItemResponse<Wallet>> {
    const wallet = await this.walletService.getWalletById(id);

    return {
      message: 'Đây là thông tin chi tiết của ví điện tử',
      statusCode: HttpStatus.OK,
      item: wallet,
    };
  }

  @Get('my-wallet')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.CUSTOMER, UserRole.SHOP)
  @ApiOperation({
    summary: 'Lấy chi tiết Ví điện tử',
    description: `
                **Hướng dẫn sử dụng:**
    
                - Nếu không tìm thấy sẽ trả về lỗi.
                - Nếu tìm thấy sẽ trả về chi tiết ví điện tử.
            `,
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            items: { $ref: getSchemaPath(WalletDto) },
          },
        },
      ],
    },
  })
  async getOrderById(@UserId() userId: string): Promise<ItemResponse<WalletDto>> {
    const wallet = await this.walletService.getWalletByUserId(userId);
    return {
      message: 'Đây là thông tin chi tiết của ví điện tử',
      statusCode: HttpStatus.OK,
      item: wallet,
    };
  }

  @Put('my-wallet')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.CUSTOMER, UserRole.SHOP)
  @ApiOperation({
    summary: 'Cập nhật PIN cho ví điện tử',
    description: `
      **Hướng dẫn sử dụng:**

      - Nếu không tìm thấy ví thì trả về lỗi.
      - Nếu thành công sẽ trả về chi tiết ví điện tử vừa cập nhật.
    `,
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            items: { $ref: getSchemaPath(Wallet) },
          },
        },
      ],
    },
  })
  async updatePINForWallet(
    @UserId() userId: string,
    @Body() body: PINWalletDto,
  ): Promise<ItemResponse<Wallet>> {
    const wallet = await this.walletService.updatePIN(userId, body);
    return {
      message: 'Đây là thông tin ví điện tử đã cập nhật',
      statusCode: HttpStatus.OK,
      item: wallet,
    };
  }

  @Post('request-smart-otp')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.CUSTOMER, UserRole.SHOP)
  @ApiOperation({
    summary: 'Yêu cầu mã xác thực OTP để thực hiện giao dịch',
    description: `
      **Hướng dẫn sử dụng:**

      - Truyền mã pin trong body dưới dạng JSON.
      - Nếu thành công sẽ lưu otp vào redis, sau đó trả lại otp vừa tạo.
    `,
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            items: { type: 'string' },
          },
        },
      ],
    },
  })
  async requestOtpPayment(
    @UserId() userId: string,
    @Body() body: PINWalletDto,
  ): Promise<ItemResponse<string>> {
    const requestOtp = await this.walletService.requestOtpPayment(userId, body);
    return {
      message: 'Đây là mã OTP giao dịch của bạn',
      statusCode: HttpStatus.CREATED,
      item: requestOtp,
    };
  }

  @Put('deposit')
  @UseGuards(AuthGuard)
  @Roles(UserRole.CUSTOMER, UserRole.SHOP)
  @ApiOperation({
    summary: 'Nạp tiền vào ví điện tử',
    description: `
            **Hướng dẫn sử dụng**
            
            - Truyền id của ví điện tử trên URl.
            - Truyền dữ liệu trong body theo dạng JSON.
            - Nếu không tìm thấy ví thì trả về lỗi.
            - TransactionType: DEPOSIT, WITHDRAW.
            - TransactionStatus: PENDING, COMPLETED, FAILED, CANCELLED, REFUNDED.
            - TypeBalance: available.
            - Trả về thông tin chi tiết đã cập nhật.
        `,
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            item: { example: null, $ref: getSchemaPath(DepositViaPayOSResponse) },
          },
        },
      ],
    },
  })
  async depositWallet(
    @UserId() userId: string,
    @Body() depositWallet: DepositViaPayOSDto,
  ): Promise<ItemResponse<DepositViaPayOSResponse>> {
    const paymentLink = await this.walletService.depositWallet(userId, depositWallet);
    return {
      message: 'Tạo link thanh toán PayOS thành công',
      statusCode: HttpStatus.OK,
      item: paymentLink,
    };
  }

  @Put('withdraw-request')
  @UseGuards(AuthGuard)
  @Roles(UserRole.CUSTOMER, UserRole.SHOP)
  @ApiOperation({
    summary: 'Yêu cầu rút tiền trong ví điện tử',
    description: `
            **Hướng dẫn sử dụng**
            
            - Truyền dữ liệu trong body theo dạng JSON.
            - Nếu không tìm thấy ví thì trả về lỗi.
            - TransactionType: WITHDRAW.
            - Trả về thông tin chi tiết đã cập nhật.
        `,
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            item: { type: 'string' },
          },
        },
      ],
    },
  })
  async withdrawWalletRequest(
    @UserId() userId: string,
    @Body() withdrawWallet: WithdrawTransactionDto,
  ): Promise<ItemResponse<string>> {
    const wallet = await this.walletService.withdrawWalletRequest(userId, withdrawWallet);
    return {
      message: 'Yêu cầu rút tiền từ ví điện tử thành công',
      statusCode: HttpStatus.OK,
      item: wallet,
    };
  }

  @Put('update-bank-information')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.CUSTOMER, UserRole.SHOP)
  @ApiOperation({
    summary: 'Cập nhật thông tin chuyển khoản cho ví điện tử',
    description: `
            **Hướng dẫn sử dụng**
            
            - Truyền dữ liệu trong body theo dạng JSON.
            - Nếu không tìm thấy ví thì trả về lỗi.
            - Trả về thông tin chi tiết của ví điện tử đã cập nhật.
        `,
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            item: { $ref: getSchemaPath(Wallet) },
          },
        },
      ],
    },
  })
  async updateBankInformation(
    @UserId() userId: string,
    @Body() body: UpdateBankDto,
  ): Promise<ItemResponse<Wallet>> {
    const wallet = await this.walletService.updateBankInformation(userId, body);
    return {
      message: 'Cập nhật thông tin ngân hàng cho ví điện tử thành công',
      statusCode: HttpStatus.OK,
      item: wallet,
    };
  }

  @Post('payment/webhook')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Xử lý webhook nạp tiền từ PayOS',
    description: `
    **Hướng dẫn sử dụng**

    - Đây là API để gọi khi có thay đổi trạng thái thanh toán.

    **Quy trình**
    1. PayOS gửi link thành công/thất bại → Frontend nhận → gửi JSON.
    2. Nếu thanh toán thành công (COMPLETED) → cộng tiền vào ví.
    3. Nếu thất bại / hủy → cập nhật trạng thái FAILED / CANCELLED, không cộng tiền.
  `,
  })
  @ApiBody({
    type: WebhookDto,
    description: 'Webhook payload from PayOS',
    required: true,
    examples: {
      completed: {
        summary: 'Payment completed',
        value: {
          transactionId: 'transaction-uuid-123',
          status: 'COMPLETED',
        },
      },
      failed: {
        summary: 'Payment failed',
        value: {
          transactionId: 'transaction-uuid-123',
          status: 'FAILED',
        },
      },
      cancelled: {
        summary: 'Payment cancelled',
        value: {
          transactionId: 'transaction-uuid-123',
          status: 'CANCELLED',
        },
      },
    },
  })
  async handleWebhook(@Body() body: WebhookDto) {
    const updatedTransaction = await this.transactionService.updateTransactionStatus(
      body.transactionId,
      body.status,
    );
    if (body.status === TransactionStatus.COMPLETED) {
      const wallet = await this.walletService.getWalletById(updatedTransaction.wallet.id);
      await this.walletService.saveWalletBalance(wallet, updatedTransaction.amount);
    }
    return { message: 'OK' };
  }
}
