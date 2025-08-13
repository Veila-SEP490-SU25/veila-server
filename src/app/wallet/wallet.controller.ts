import { ItemResponse, ListResponse } from '@/common/base';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
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
import { DepositViaPayOSDto, DepositViaPayOSResponse, WalletDto } from './wallet.dto';
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
import { DepositAndWithdrawTransactionDto, TransactionService } from '../transaction';
import { PayosService } from '../payos/payos.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WebhookType } from '@payos/node/lib/type';

@Controller('wallets')
@ApiTags('Wallet Controller')
@ApiBearerAuth()
@ApiExtraModels(ItemResponse, ListResponse, WalletDto, Wallet, DepositViaPayOSResponse)
export class WalletController {
  constructor(
    private readonly walletService: WalletService,
    private readonly payosService: PayosService,
    private readonly transactionService: TransactionService,
    @InjectRepository(Wallet)
    private readonly walletRepo: Repository<Wallet>,
  ) {}

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF)
  @ApiOperation({
    summary: 'Lấy danh sách tất cả các ví điện tử với phân trang, sắp xếp và lọc',
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
    @SortingParams(['available_balance', 'locked_balance']) sort?: Sorting,
    @FilteringParams(['user_id', 'available_balance', 'locked_balance'])
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

  @Get('my-wallet')
  @UseGuards(AuthGuard)
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

  @Put('/deposit')
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

  @Put('/withdraw-request')
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
    @Body() withdrawWallet: DepositAndWithdrawTransactionDto,
  ): Promise<ItemResponse<string>> {
    const wallet = await this.walletService.withdrawWalletRequest(userId, withdrawWallet);
    return {
      message: 'Yêu cầu rút tiền từ ví điện tử thành công',
      statusCode: HttpStatus.OK,
      item: wallet,
    };
  }

  @Post()
  @HttpCode(200)
  @ApiOperation({
    summary: 'Xử lý webhook nạp tiền từ PayOS',
    description: `
    **Hướng dẫn sử dụng**

    - Đây là API để PayOS gọi khi có thay đổi trạng thái thanh toán.
    - FE KHÔNG cần gọi API này trực tiếp (PayOS sẽ POST vào).
    - Tuy nhiên, bạn có thể dùng để test webhook bằng cách gửi body JSON đúng định dạng.

    **Quy trình**
    1. PayOS gửi webhook → Backend nhận → Xác thực chữ ký → Cập nhật trạng thái giao dịch.
    2. Nếu thanh toán thành công (PAID) → cộng tiền vào ví.
    3. Nếu thất bại / hủy → cập nhật trạng thái FAILED / CANCELLED, không cộng tiền.
  `,
  })
  @ApiBody({
    description: 'Payload webhook do PayOS gửi về',
    required: true,
    schema: {
      example: {
        code: '00',
        desc: 'Success',
        success: true,
        data: {
          orderCode: 123456789,
          amount: 100000,
          description: 'Nạp tiền vào ví',
          accountNumber: '1234567890',
          reference: 'Ref12345',
          transactionDateTime: '2025-08-13T14:30:00+07:00',
          currency: 'VND',
          paymentLinkId: 'pl_abc123',
          code: 'PAID',
          desc: 'Thanh toán thành công',
          counterAccountBankId: 'VCB',
          counterAccountBankName: 'Vietcombank',
          counterAccountName: 'Nguyen Van A',
          counterAccountNumber: '0123456789',
        },
        signature: 'abcxyz1234567890',
      },
    },
  })
  async handleWebhook(@Body() body: WebhookType) {
    // Xác thực chữ ký
    const verified = this.payosService.verifyWebhook(body);
    if (!verified) {
      throw new BadRequestException('Invalid signature');
    }

    // Đọc dữ liệu từ PayOS
    const data = body?.data;
    if (!data || typeof data.orderCode === 'undefined') {
      throw new BadRequestException('Missing orderCode');
    }

    const orderCode = Number(data.orderCode);
    const status = String(data.code || '').toUpperCase();

    // Tìm transaction qua orderCode
    const transaction = await this.transactionService.fineTransactionByOrderCode(orderCode);

    // Xử lý theo trạng thái
    if (status === 'PAID') {
      await this.transactionService.updateTransactionByOrderCode(
        orderCode,
        TransactionStatus.COMPLETED,
      );

      // Cộng tiền vào ví
      const wallet = await this.walletRepo.findOne({ where: { id: transaction.wallet.id } });
      if (wallet) {
        wallet.availableBalance = Number(wallet.availableBalance) + Number(transaction.amount);
        await this.walletRepo.save(wallet);
      }
    } else if (status === 'CANCELLED' || status === 'FAILED') {
      await this.transactionService.updateTransactionByOrderCode(
        orderCode,
        status === 'FAILED' ? TransactionStatus.FAILED : TransactionStatus.CANCELLED,
      );
    }

    return { message: 'OK' };
  }
}
