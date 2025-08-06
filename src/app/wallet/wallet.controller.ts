import { ItemResponse, ListResponse } from '@/common/base';
import { Body, Controller, Get, HttpStatus, Post, Put, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { walletDto } from './wallet.dto';
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
import { UserRole, Wallet } from '@/common/models';
import { WalletService } from './wallet.service';
import { AuthGuard } from '@/common/guards';
import { CUTransactionDto } from '../transaction';

@Controller('wallet')
@ApiTags('Wallet Controller')
@ApiBearerAuth()
@ApiExtraModels(ItemResponse, ListResponse, walletDto)
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get()
  @UseGuards(AuthGuard)
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
            items: { $ref: getSchemaPath(walletDto) },
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
  ): Promise<ListResponse<walletDto>> {
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

  @Get('/my-wallet')
  @UseGuards(AuthGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF, UserRole.CUSTOMER, UserRole.SHOP)
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
            items: { $ref: getSchemaPath(walletDto) },
          },
        },
      ],
    },
  })
  async getOrderById(@UserId() userId: string): Promise<ItemResponse<walletDto>> {
    const wallet = await this.walletService.getWalletByUserId(userId);
    return {
      message: 'Đây là thông tin chi tiết của ví điện tử',
      statusCode: HttpStatus.OK,
      item: wallet,
    };
  }

  @Post()
  @UseGuards(AuthGuard)
  @Roles(UserRole.CUSTOMER, UserRole.SHOP)
  @ApiOperation({
    summary: 'Tạo ví điện tử cho người dùng',
    description: `
            **Hướng dẫn sử dụng:**

            - Chỉ người dùng (CUSTOMER, SHOP) mới có thể tạo ví điện tử.
            - Truyền dữ liệu trong đơn hàng dưới dạng JSON.
            - Bắt buộc đầy đủ các trường.
            - Trả về thông tin ví điện tử vùa tạo.
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
  async createWallet(@UserId() userId: string): Promise<ItemResponse<Wallet>> {
    const wallet = await this.walletService.createWallet(userId);
    return {
      message: 'Ví điện tử được tạo thành công',
      statusCode: HttpStatus.CREATED,
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
            item: { example: null, $ref: getSchemaPath(Wallet) },
          },
        },
      ],
    },
  })
  async depositWallet(
    @UserId() userId: string,
    @Body() depositWallet: CUTransactionDto,
  ): Promise<ItemResponse<Wallet>> {
    const wallet = await this.walletService.depositWallet(userId, depositWallet);
    return {
      message: 'Nạp tiền vào ví điện tử thành công',
      statusCode: HttpStatus.OK,
      item: wallet,
    };
  }

  @Put('/withdraw-request')
  @UseGuards(AuthGuard)
  @Roles(UserRole.CUSTOMER, UserRole.SHOP)
  @ApiOperation({
    summary: 'Yêu cầu rút tiền trong ví điện tử',
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
            item: { example: null, $ref: getSchemaPath(String) },
          },
        },
      ],
    },
  })
  async withdrawWalletRequest(
    @UserId() userId: string,
    @Body() withdrawWallet: CUTransactionDto,
  ): Promise<ItemResponse<string>> {
    const wallet = await this.walletService.withdrawWalletRequest(userId, withdrawWallet);
    return {
      message: 'Yêu cầu rút tiền từ ví điện tử thành công',
      statusCode: HttpStatus.OK,
      item: wallet,
    };
  }
}
