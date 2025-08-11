import { ItemResponse, ListResponse } from '@/common/base';
import { Controller, forwardRef, Get, HttpStatus, Inject, Param, Put, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { TransactionDto } from './transaction.dto';
import { TransactionService } from './transaction.service';
import { AuthGuard, RolesGuard } from '@/common/guards';
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
import { Transaction, TransactionStatus, UserRole } from '@/common/models';
import { WalletService } from '../wallet';

@Controller('transactions')
@ApiTags('Transaction Controller')
@ApiBearerAuth()
@ApiExtraModels(ItemResponse, ListResponse, TransactionDto, Transaction)
export class TransactionController {
  constructor(
    private readonly transactionService: TransactionService,
    @Inject(forwardRef(() => WalletService))
    private readonly walletService: WalletService,
  ) {}

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF)
  @ApiOperation({
    summary: 'Lấy danh sách tất cả giao dịch với phân trang, sắp xếp và lọc',
    description: `
            **Hướng dẫn sử dụng:**

            - Trả về danh sách giao dịch (bao gồm tất cả trạng thái) dưới quyền admin và staff.
            - Hỗ trợ phân trang, sắp xếp và lọc.
            - Page bắt đầu số 0.
            - Sort theo format: [tên_field]:[asc/desc].
            - Các trường có thể sort: wallet_id, order_id, membership_id, from, to, from_type_balance, to_type_balance, amount, type, status, note.
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
    description: 'Sắp xếp theo trường: ví dụ: wallet_id:asc',
  })
  @ApiQuery({
    name: 'filter',
    required: false,
    type: String,
    description: 'Lọc theo trường',
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ListResponse) },
        {
          properties: {
            items: { $ref: getSchemaPath(TransactionDto) },
          },
        },
      ],
    },
  })
  async getAllTransactionsForAdmin(
    @PaginationParams() { page, size, limit, offset }: Pagination,
    @SortingParams([
      'wallet_id',
      'order_id',
      'membership_id',
      'from',
      'to',
      'from_type_balance',
      'to_type_balance',
      'amount',
      'type',
      'status',
      'note',
    ])
    sort?: Sorting,
    @FilteringParams([
      'wallet_id',
      'order_id',
      'membership_id',
      'from',
      'to',
      'from_type_balance',
      'to_type_balance',
      'amount',
      'type',
      'status',
      'note',
    ])
    filter?: Filtering,
  ): Promise<ListResponse<TransactionDto>> {
    const [transactions, totalItems] = await this.transactionService.getTransactionsForAdmin(
      limit,
      offset,
      sort,
      filter,
    );
    const totalPages = Math.ceil(totalItems / limit);

    return {
      message: 'Đây là danh sách tất cả giao dịch',
      statusCode: HttpStatus.OK,
      pageIndex: page,
      pageSize: size,
      totalItems,
      totalPages,
      hasNextPage: page + 1 < totalPages,
      hasPrevPage: 0 > page,
      items: transactions,
    };
  }

  @Get('my-transaction/:walletId')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.CUSTOMER, UserRole.SHOP)
  @ApiOperation({
    summary: 'Lấy danh sách giao dịch theo người dùng',
    description: `
            **Hướng dẫn sử dụng:**

            - Truyền id của ví trên Url
            - Trả về danh sách giao dịch của người dùng hiện tại.
            - Hỗ trợ phân trang, lọc và sắp xếp.
            - Page bắt đầu từ số 0.
            - Sort theo format: [tên_field]:[asc/desc].
            - Các trường có thể sort: wallet_id, order_id, membership_id, from, to, from_type_balance, to_type_balance, amount, type, status, note.
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
    description: 'Sắp xếp theo trường: ví dụ: due_date:asc',
  })
  @ApiQuery({
    name: 'filter',
    required: false,
    type: String,
    description: 'Lọc theo trường: ví dụ: status:PENDING',
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ListResponse) },
        {
          properties: {
            items: { $ref: getSchemaPath(TransactionDto) },
          },
        },
      ],
    },
  })
  async getTransactionsForUser(
    @UserId() userId: string,
    @PaginationParams() { page, size, limit, offset }: Pagination,
    @SortingParams([
      'wallet_id',
      'order_id',
      'membership_id',
      'from',
      'to',
      'from_type_balance',
      'to_type_balance',
      'amount',
      'type',
      'status',
      'note',
    ])
    sort?: Sorting,
    @FilteringParams([
      'wallet_id',
      'order_id',
      'membership_id',
      'from',
      'to',
      'from_type_balance',
      'to_type_balance',
      'amount',
      'type',
      'status',
      'note',
    ])
    filter?: Filtering,
  ): Promise<ListResponse<TransactionDto>> {
    const wallet = await this.walletService.getWalletByUserId(userId);
    const [transactions, totalItems] = await this.transactionService.getTransactionsForUser(
      wallet.id,
      limit,
      offset,
      sort,
      filter,
    );
    const totalPages = Math.ceil(totalItems / limit);
    return {
      message: 'Đây là danh sách tất cả các giao dịch của người dùng',
      statusCode: HttpStatus.OK,
      pageIndex: page,
      pageSize: size,
      totalItems,
      totalPages,
      hasNextPage: page + 1 < totalPages,
      hasPrevPage: 0 > page,
      items: transactions,
    };
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Lấy chi tiết giao dịch',
    description: `
                **Hướng dẫn sử dụng:**
    
                - Truyền \`id\` của giao dịch trên URL.
                - Nếu không tìm thấy sẽ trả về lỗi.
                - Nếu tìm thấy sẽ trả về chi tiết giao dịch.
            `,
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            items: { $ref: getSchemaPath(TransactionDto) },
          },
        },
      ],
    },
  })
  async getOrderById(@Param('id') id: string): Promise<ItemResponse<TransactionDto>> {
    const transaction = await this.transactionService.getTransactionById(id);
    return {
      message: 'Đây là thông tin chi tiết của giao dịch',
      statusCode: HttpStatus.OK,
      item: transaction,
    };
  }

  @Put(':id/:status')
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF)
  @ApiOperation({
    summary: 'Cập nhật trạng thái giao dịch',
    description: `
                **Hướng dẫn sử dụng:**
      
                - Truyền \`id\` của giao dịch trên URL.
                - Truyền trạng thái cập nhật trên URL.
                - Nếu không tìm thấy giao dịch sẽ trả về lỗi.
                - OrderStatus: PENDING, COMPLETED, FAILED, CANCELLED, REFUNDED, DISPUTED.
                - Trả về thông tin chi tiết của giao dịch đã cập nhật.
            `,
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            item: { example: null, $ref: getSchemaPath(Transaction) },
          },
        },
      ],
    },
  })
  async updateTransactionStatus(
    @Param('id') id: string,
    @Param('status') status: TransactionStatus,
  ): Promise<ItemResponse<Transaction>> {
    const transaction = await this.transactionService.updateTransactionStatus(id, status);
    return {
      message: 'Giao dịch đã được cập nhật trạng thái thành công',
      statusCode: HttpStatus.OK,
      item: transaction,
    };
  }

  @Put('approve-withdraw/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF)
  @ApiOperation({
    summary: 'Duyệt yêu cầu rút tiền',
    description: `
            **Hướng dẫn sử dụng:**
      
            - Truyền \`id\` của giao dịch yêu cầu rút tiền trên URL.
            - Nếu không tìm thấy giao dịch sẽ trả về lỗi.
            - Trả về thông tin chi tiết của giao dịch đã cập nhật.
        `,
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            item: { example: null, $ref: getSchemaPath(Transaction) },
          },
        },
      ],
    },
  })
  async approveWithdrawRequest(@Param('id') id: string): Promise<ItemResponse<Transaction>> {
    const transaction = await this.transactionService.approveWithdrawRequest(id);
    return {
      message: 'Yêu cầu rút tiền đã được duyệt thành công',
      statusCode: HttpStatus.OK,
      item: transaction,
    };
  }

  @Put('cancel-withdraw/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF)
  @ApiOperation({
    summary: 'Từ chối yêu cầu rút tiền',
    description: `
            **Hướng dẫn sử dụng:**
      
            - Truyền \`id\` của giao dịch yêu cầu rút tiền trên URL.
            - Nếu không tìm thấy giao dịch sẽ trả về lỗi.
            - Trả về thông tin chi tiết của giao dịch đã cập nhật.
        `,
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            item: { example: null, $ref: getSchemaPath(Transaction) },
          },
        },
      ],
    },
  })
  async cancelWithdrawRequest(@Param('id') id: string): Promise<ItemResponse<Transaction>> {
    const transaction = await this.transactionService.cancelWithdrawRequest(id);
    return {
      message: 'Yêu cầu rút tiền đã bị từ chối',
      statusCode: HttpStatus.OK,
      item: transaction,
    };
  }
}
