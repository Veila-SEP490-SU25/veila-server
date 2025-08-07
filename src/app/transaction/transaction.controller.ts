import { ItemResponse, ListResponse } from '@/common/base';
import { Controller, Get, HttpStatus, Param, Put, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { transactionDto } from './transaction.dto';
import { TransactionService } from './transaction.service';
import { AuthGuard } from '@/common/guards';
import {
  Filtering,
  FilteringParams,
  Pagination,
  PaginationParams,
  Roles,
  Sorting,
  SortingParams,
} from '@/common/decorators';
import { Transaction, TransactionStatus, UserRole } from '@/common/models';

@Controller('transactions')
@ApiTags('Transaction Controller')
@ApiBearerAuth()
@ApiExtraModels(ItemResponse, ListResponse, transactionDto, Transaction)
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  @UseGuards(AuthGuard)
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
            items: { $ref: getSchemaPath(transactionDto) },
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
  ): Promise<ListResponse<transactionDto>> {
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

  @Get(':walletId/my-transaction')
  @UseGuards(AuthGuard)
  @Roles(UserRole.CUSTOMER, UserRole.SHOP)
  @ApiOperation({
    summary: 'Lấy danh sách giao dịch theo người dùng',
    description: `
            **Hướng dẫn sử dụng:**

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
            items: { $ref: getSchemaPath(transactionDto) },
          },
        },
      ],
    },
  })
  async getTransactionsForUser(
    @Param('walletId') walletId: string,
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
  ): Promise<ListResponse<transactionDto>> {
    const [transactions, totalItems] = await this.transactionService.getTransactionsForUser(
      walletId,
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
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF, UserRole.CUSTOMER, UserRole.SHOP)
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
            items: { $ref: getSchemaPath(transactionDto) },
          },
        },
      ],
    },
  })
  async getOrderById(@Param('id') id: string): Promise<ItemResponse<transactionDto>> {
    const transaction = await this.transactionService.getTransactionById(id);
    return {
      message: 'Đây là thông tin chi tiết của giao dịch',
      statusCode: HttpStatus.OK,
      item: transaction,
    };
  }

  @Put(':id/status')
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
}
