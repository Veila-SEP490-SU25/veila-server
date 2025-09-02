import { OrderStatus } from './../../common/models/order/order.model';
import { ItemResponse, ListResponse } from '@/common/base';
import {
  Complaint,
  Milestone,
  Order,
  OrderServiceDetail,
  Transaction,
  UserRole,
} from '@/common/models';
import { Body, Controller, Get, HttpStatus, Post, Put, Param, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { OrderService } from '@/app/order/order.service';
import {
  CurrentRole,
  Filtering,
  FilteringParams,
  Pagination,
  PaginationParams,
  Roles,
  Sorting,
  SortingParams,
  UserId,
} from '@/common/decorators';
import { AuthGuard, RolesGuard } from '@/common/guards';
import {
  CreateOrderForCustom,
  CreateOrderRequestDto,
  OrderDto,
  OtpPaymentDto,
  UOrderDto,
} from './order.dto';
import { CUComplaintDto } from '@/app/complaint';
import { OrderAccessoriesDetailDto } from '../order-accessories-details';
import { OrderDressDetailDto } from '../order-dress-details';

@Controller('orders')
@ApiTags('Order Controller')
@ApiBearerAuth()
@ApiExtraModels(
  ItemResponse,
  ListResponse,
  OrderDto,
  Order,
  Complaint,
  OrderServiceDetail,
  Milestone,
  Transaction,
)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Lấy danh sách đơn hàng với phân trang, sắp xếp và lọc',
    description: `
        **Hướng dẫn sử dụng:**

        - Trả về danh sách đơn hàng (bao gồm cả đã xóa mềm) dưới quyền quản trị/nhân viên.
        - Hỗ trợ phân trang, sắp xếp, lọc.
        - Page bắt đầu từ 0
        - Sort theo format: [tên_field]:[asc/desc]
        - Các trường đang có thể sort: due_date, amount, status
        - Filter theo format: [tên_field]:[eq|neq|gt|gte|lt|lte|like|nlike|in|nin]:[keyword]; hoặc [tên_field]:[isnull|isnotnull]
        - Các trường đang có thể filter: customer_id, shop_id, phone, email address, due_date, return_date, amount, type, status`,
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
            items: { $ref: getSchemaPath(OrderDto) },
          },
        },
      ],
    },
  })
  async getAllOrders(
    @UserId() userId: string,
    @CurrentRole() currentRole: UserRole,
    @PaginationParams() { page, size, limit, offset }: Pagination,
    @SortingParams(['due_date', 'amount', 'status', 'createdAt', 'updatedAt']) sort?: Sorting,
    @FilteringParams([
      'customer_id',
      'shop_id',
      'phone',
      'email',
      'address',
      'due_date',
      'return_date',
      'amount',
      'type',
      'status',
    ])
    filter?: Filtering,
  ): Promise<ListResponse<OrderDto>> {
    const [orders, totalItems] = await this.orderService.getOrders(
      userId,
      currentRole,
      limit,
      offset,
      sort,
      filter,
    );
    const totalPages = Math.ceil(totalItems / limit);
    return {
      message: 'Đây là danh sách tất cả đơn hàng',
      statusCode: HttpStatus.OK,
      pageIndex: page,
      pageSize: size,
      totalItems,
      totalPages,
      hasNextPage: page + 1 < totalPages,
      hasPrevPage: 0 > page,
      items: orders,
    };
  }

  @Get('shops/:shopId')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Lấy danh sách đơn hàng của một cửa hàng với phân trang, sắp xếp và lọc',
    description: `
        **Hướng dẫn sử dụng:**

        - Trả về danh sách đơn hàng (bao gồm cả đã xóa mềm) dưới quyền quản trị/nhân viên.
        - Hỗ trợ phân trang, sắp xếp, lọc.
        - Page bắt đầu từ 0
        - Sort theo format: [tên_field]:[asc/desc]
        - Các trường đang có thể sort: due_date, amount, status
        - Filter theo format: [tên_field]:[eq|neq|gt|gte|lt|lte|like|nlike|in|nin]:[keyword]; hoặc [tên_field]:[isnull|isnotnull]
        - Các trường đang có thể filter: customer_id, shop_id, phone, email address, due_date, return_date, amount, type, status`,
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
            items: { $ref: getSchemaPath(OrderDto) },
          },
        },
      ],
    },
  })
  async getAllOrdersOfShop(
    @Param('shopId') shopId: string,
    @PaginationParams() { page, size, limit, offset }: Pagination,
    @SortingParams(['due_date', 'amount', 'status', 'createdAt', 'updatedAt']) sort?: Sorting,
    @FilteringParams([
      'customer_id',
      'shop_id',
      'phone',
      'email',
      'address',
      'due_date',
      'return_date',
      'amount',
      'type',
      'status',
    ])
    filter?: Filtering,
  ): Promise<ListResponse<OrderDto>> {
    const [orders, totalItems] = await this.orderService.getOrdersForShop(
      shopId,
      limit,
      offset,
      sort,
      filter,
    );
    const totalPages = Math.ceil(totalItems / limit);
    return {
      message: 'Đây là danh sách tất cả đơn hàng',
      statusCode: HttpStatus.OK,
      pageIndex: page,
      pageSize: size,
      totalItems,
      totalPages,
      hasNextPage: page + 1 < totalPages,
      hasPrevPage: 0 > page,
      items: orders,
    };
  }

  @Get('shops/:shopId/income')
  @ApiOperation({
    summary: 'Lấy tổng thu nhập của một cửa hàng',
    description: `
        **Hướng dẫn sử dụng:**

        - Trả về tổng thu nhập của cửa hàng.
        - Nếu không tìm thấy sẽ trả về lỗi.
    `,
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            item: { type: 'number' },
          },
        },
      ],
    },
  })
  async getShopIncome(@Param('shopId') shopId: string): Promise<ItemResponse<number>> {
    const income = await this.orderService.getShopIncome(shopId);
    return {
      message: 'Đây là tổng thu nhập của cửa hàng',
      statusCode: HttpStatus.OK,
      item: income,
    };
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Lấy chi tiết đơn hàng',
    description: `
            **Hướng dẫn sử dụng:**

            - Truyền \`id\` của đơn hàng trên URL.
            - Nếu không tìm thấy sẽ trả về lỗi.
            - Nếu tìm thấy sẽ trả về chi tiết đơn hàng.
        `,
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            items: { $ref: getSchemaPath(OrderDto) },
          },
        },
      ],
    },
  })
  async getOrderById(@Param('id') id: string): Promise<ItemResponse<OrderDto>> {
    const order = await this.orderService.getOrderById(id);
    return {
      message: 'Đây là thông tin chi tiết của đơn hàng',
      statusCode: HttpStatus.OK,
      item: order,
    };
  }

  @Post()
  @UseGuards(AuthGuard)
  @Roles(UserRole.CUSTOMER)
  @ApiOperation({
    summary: 'Tạo đơn hàng mới (for Sell and rent)',
    description: `
          **Hướng dẫn sử dụng:**

          - Chỉ người dùng có quyền \`CUSTOMER\` mới có thể tạo đơn hàng.
          - Truyền dữ liệu đơn hàng trong body theo dạng JSON.
          - Các trường bắt buộc:\`address\`, \`due_date\`,...
          - Trả về thông tin chi tiết của đơn hàng vừa tạo.
          - OrderType: SELL, RENT
      `,
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            item: { $ref: getSchemaPath(Order) },
          },
        },
      ],
    },
  })
  @ApiBody({ type: CreateOrderRequestDto })
  async createOrderForSellAndRent(
    @UserId() userId: string,
    @Body() body: CreateOrderRequestDto,
  ): Promise<ItemResponse<Order>> {
    const order = await this.orderService.createOrderForSellAndRent(userId, body);
    return {
      message: 'Đơn hàng đã được tạo thành công',
      statusCode: HttpStatus.CREATED,
      item: order,
    };
  }

  @Post('custom')
  @UseGuards(AuthGuard)
  @Roles(UserRole.CUSTOMER)
  @ApiOperation({
    summary: 'Tạo đơn hàng đặt may (Custom Order)',
    description: `
          **Hướng dẫn sử dụng:**

          - Chỉ người dùng có quyền \`CUSTOMER\` mới có thể tạo đơn hàng đặt may.
          - Truyền dữ liệu đơn hàng trong body theo dạng JSON.
          - Trả về thông tin chi tiết của đơn hàng vừa tạo.
          - OrderType: CUSTOM
      `,
  })
  @ApiCreatedResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            item: { $ref: getSchemaPath(Order) },
          },
        },
      ],
    },
  })
  async createOrderForCustom(
    @UserId() userId: string,
    @Body() body: CreateOrderForCustom,
  ): Promise<ItemResponse<Order>> {
    const order = await this.orderService.createOrderForCustom(userId, body);
    return {
      message: 'Đơn hàng đã được tạo thành công',
      statusCode: HttpStatus.CREATED,
      item: order,
    };
  }

  @Put(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF, UserRole.CUSTOMER)
  @ApiOperation({
    summary: 'Cập nhật thông tin đơn hàng',
    description: `
          **Hướng dẫn sử dụng:**

          - Truyền \`id\` của đơn hàng trên URL.
          - Truyền dữ liệu cập nhật trong body theo dạng JSON.
          - Các trường bắt buộc: \`address\`, \`due_date\`, \`type\`.
          - Nếu không tìm thấy đơn hang sẽ trả về lỗi.
          - OrderStatus: PENDING, IN_PROCESS, COMPLETED, CANCELLED
          - Trả về thông tin chi tiết của đơn hàng đã cập nhật.
      `,
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            item: { example: null, $ref: getSchemaPath(Order) },
          },
        },
      ],
    },
  })
  async updateOrder(
    @UserId() userId: string,
    @Param('id') id: string,
    @Body() updatedOrder: UOrderDto,
  ): Promise<ItemResponse<Order>> {
    const order = await this.orderService.updateOrder(userId, id, updatedOrder);
    return {
      message: 'Đơn hàng đã được cập nhật thành công',
      statusCode: HttpStatus.OK,
      item: order,
    };
  }

  @Get(':id/order-accessories-details')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Lấy danh sách phụ kiện của đơn hàng',
    description: `
          **Hướng dẫn sử dụng:**

          - Truyền \`id\` của đơn hàng trên URL.
          - Nếu không tìm thấy đơn hàng sẽ trả về lỗi.
          - Trả về danh sách phụ kiện của đơn hàng.
    `,
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ListResponse) },
        {
          properties: {
            items: { type: 'array', items: { $ref: getSchemaPath(OrderAccessoriesDetailDto) } },
          },
        },
      ],
    },
  })
  async getOrderAccessoriesDetails(
    @Param('id') orderId: string,
  ): Promise<ListResponse<OrderAccessoriesDetailDto>> {
    const orderAccessoriesDetails = await this.orderService.getOrderAccessoriesDetails(orderId);
    return {
      message: 'Danh sách phụ kiện của đơn hàng',
      statusCode: HttpStatus.OK,
      pageIndex: 0,
      pageSize: 0,
      totalItems: orderAccessoriesDetails.length,
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: false,
      items: orderAccessoriesDetails,
    };
  }

  @Get(':id/order-accessories-details/:accessoryId')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Lấy chi tiết phụ kiện của đơn hàng',
    description: `
          **Hướng dẫn sử dụng:**

          - Truyền \`id\` của đơn hàng và \`accessoryId\` trên URL.
          - Nếu không tìm thấy phụ kiện sẽ trả về lỗi.
          - Trả về thông tin chi tiết của phụ kiện trong đơn hàng.
        `,
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            item: { $ref: getSchemaPath(OrderAccessoriesDetailDto) },
          },
        },
      ],
    },
  })
  async getOrderAccessoryDetailById(
    @Param('id') orderId: string,
    @Param('accessoryId') accessoryId: string,
  ): Promise<ItemResponse<OrderAccessoriesDetailDto>> {
    const orderAccessoryDetail = await this.orderService.getOrderAccessoryDetailById(
      orderId,
      accessoryId,
    );
    return {
      message: 'Chi tiết phụ kiện trong đơn hàng',
      statusCode: HttpStatus.OK,
      item: orderAccessoryDetail,
    };
  }

  @Get(':id/order-dress-details')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Lấy váy của đơn hàng',
    description: `
          **Hướng dẫn sử dụng:**

          - Truyền \`id\` của đơn hàng trên URL.
          - Nếu không tìm thấy đơn hàng sẽ trả về lỗi.
          - Trả về váy của đơn hàng.
    `,
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ListResponse) },
        {
          properties: {
            items: { type: 'array', items: { $ref: getSchemaPath(OrderDressDetailDto) } },
          },
        },
      ],
    },
  })
  async getOrderDressDetails(
    @Param('id') orderId: string,
  ): Promise<ListResponse<OrderDressDetailDto>> {
    const orderDressDetails = await this.orderService.getOrderDressDetails(orderId);
    return {
      message: 'Danh sách phụ kiện của đơn hàng',
      statusCode: HttpStatus.OK,
      pageIndex: 0,
      pageSize: 0,
      totalItems: orderDressDetails.length,
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: false,
      items: orderDressDetails,
    };
  }

  @Get(':id/order-dress-details/:dressId')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Lấy chi tiết váy của đơn hàng',
    description: `
          **Hướng dẫn sử dụng:**

          - Truyền \`id\` của đơn hàng và \`orderId\` trên URL.
          - Nếu không tìm thấy váy sẽ trả về lỗi.
          - Trả về thông tin chi tiết của váy trong đơn hàng.
        `,
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            item: { $ref: getSchemaPath(OrderDressDetailDto) },
          },
        },
      ],
    },
  })
  async getOrderDressDetailById(
    @Param('id') orderId: string,
    @Param('dressId') dressId: string,
  ): Promise<ItemResponse<OrderDressDetailDto>> {
    const orderDressDetail = await this.orderService.getOrderDressDetailById(orderId, dressId);
    return {
      message: 'Chi tiết váy trong đơn hàng',
      statusCode: HttpStatus.OK,
      item: orderDressDetail,
    };
  }

  @Get(':id/order-service-details')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Lấy chi tiết dịch vụ của đơn hàng',
    description: `
          **Hướng dẫn sử dụng:**

          - Truyền \`id\` của đơn hàng trên URL.
          - Nếu không tìm thấy đơn hàng sẽ trả về lỗi.
          - Trả về chi tiết dịch vụ của đơn hàng.
        `,
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            item: { $ref: getSchemaPath(OrderServiceDetail) },
          },
        },
      ],
    },
  })
  async getOrderServiceDetails(@Param('id') id: string): Promise<ItemResponse<OrderServiceDetail>> {
    const orderServiceDetail = await this.orderService.getOrderServiceDetail(id);
    return {
      message: 'Đây là đơn hàng đặt may của cửa hàng',
      statusCode: HttpStatus.OK,
      item: orderServiceDetail,
    };
  }

  @Get(':id/transactions')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Lấy danh sách giao dịch của đơn hàng',
    description: `
          **Hướng dẫn sử dụng:**

          - Truyền \`id\` của đơn hàng trên URL.
          - Truyền các tham số phân trang, sắp xếp và lọc trong query.
          - Nếu không tìm thấy đơn hàng sẽ trả về lỗi.
          - Trả về danh sách transaction của đơn hàng.
          - Page bắt đầu từ 0
          - Sort theo format: [tên_field]:[asc/desc]
          - Các trường đang có thể sort: index
          - Filter theo format: [tên_field]:[eq|neq|gt|gte|lt|lte|like|nlike|in|nin]:[keyword]; hoặc [tên_field]:[isnull|isnotnull]
          - Các trường đang có thể filter: status, type,...
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
    description: 'Sắp xếp theo trường: ví dụ: index:asc',
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
            items: { type: 'array', items: { $ref: getSchemaPath(Transaction) } },
          },
        },
      ],
    },
  })
  async getOrderTransactions(
    @Param('id') orderId: string,
    @PaginationParams() { page, size, limit, offset }: Pagination,
    @SortingParams(['amount', 'createdAt', 'updatedAt']) sort: Sorting,
    @FilteringParams(['type', 'status']) filter: Filtering,
  ): Promise<ListResponse<Transaction>> {
    const [transactions, totalItems] = await this.orderService.getOrderTransactions(
      orderId,
      limit,
      offset,
      sort,
      filter,
    );
    const totalPages = Math.ceil(totalItems / size);
    return {
      message: 'Danh sách giao dịch của đơn hàng',
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

  @Get(':id/milestones')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Lấy danh sách milestone và các task của đơn hàng',
    description: `
          **Hướng dẫn sử dụng:**

          - Truyền \`id\` của đơn hàng trên URL.
          - Truyền các tham số phân trang, sắp xếp và lọc trong query.
          - Nếu không tìm thấy đơn hàng sẽ trả về lỗi.
          - Trả về danh sách milestone và các task của đơn hàng.
          - Page bắt đầu từ 0
          - Sort theo format: [tên_field]:[asc/desc]
          - Các trường đang có thể sort: index
          - Filter theo format: [tên_field]:[eq|neq|gt|gte|lt|lte|like|nlike|in|nin]:[keyword]; hoặc [tên_field]:[isnull|isnotnull]
          - Các trường đang có thể filter: status
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
    description: 'Sắp xếp theo trường: ví dụ: index:asc',
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
            items: { type: 'array', items: { $ref: getSchemaPath(Milestone) } },
          },
        },
      ],
    },
  })
  async getOrderMilestones(
    @Param('id') orderId: string,
    @PaginationParams() { page, size, limit, offset }: Pagination,
    @SortingParams(['index', 'createdAt', 'updatedAt']) sort: Sorting,
    @FilteringParams(['status']) filter: Filtering,
  ): Promise<ListResponse<Milestone>> {
    const [milestones, totalItems] = await this.orderService.getOrderMilestones(
      orderId,
      limit,
      offset,
      sort,
      filter,
    );
    const totalPages = Math.ceil(totalItems / size);
    return {
      message: 'Danh sách mốc thời gian của đơn hàng',
      statusCode: HttpStatus.OK,
      pageIndex: page,
      pageSize: size,
      totalItems,
      totalPages,
      hasNextPage: page + 1 < totalPages,
      hasPrevPage: 0 > page,
      items: milestones,
    };
  }

  @Get(':id/is-milestone-complaint')
  @ApiOperation({
    summary: 'Kiểm tra xem mốc thời gian có bị khiếu nại hay không',
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            item: { type: 'boolean' },
          },
        },
      ],
    },
  })
  async getIsMilestoneComplaint(@Param('id') id: string): Promise<ItemResponse<boolean>> {
    const isComplaint = await this.orderService.isMilestoneComplaint(id);
    return {
      message: 'Kiểm tra khiếu nại mốc thời gian',
      statusCode: HttpStatus.OK,
      item: isComplaint,
    };
  }

  @Get(':id/complaints/me')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Lấy danh sách khiếu nại của đơn hàng',
    description: `
          **Hướng dẫn sử dụng:**

          - Truyền \`id\` của đơn hàng trên URL.
          - Truyền các tham số phân trang, sắp xếp và lọc trong query.
          - Nếu không tìm thấy đơn hàng sẽ trả về lỗi.
          - Trả về danh sách khiếu nại của đơn hàng.
        - Page bắt đầu từ 0
        - Sort theo format: [tên_field]:[asc/desc]
        - Các trường đang có thể sort: status, createdAt, updatedAt
        - Filter theo format: [tên_field]:[eq|neq|gt|gte|lt|lte|like|nlike|in|nin]:[keyword]; hoặc [tên_field]:[isnull|isnotnull]
        - Các trường đang có thể filter: status`,
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
    description: 'Sắp xếp theo trường: ví dụ: status:asc',
  })
  @ApiQuery({
    name: 'filter',
    required: false,
    type: String,
    description: 'Lọc theo trường: ví dụ: status:DRAFT',
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ListResponse) },
        {
          properties: {
            items: { type: 'array', items: { $ref: getSchemaPath(Complaint) } },
          },
        },
      ],
    },
  })
  async getOwnerComplaints(
    @UserId() userId: string,
    @Param('id') orderId: string,
    @PaginationParams() { page, size, limit, offset }: Pagination,
    @SortingParams(['createdAt', 'updatedAt', 'status', 'createdAt', 'updatedAt']) sort: Sorting,
    @FilteringParams(['status']) filter: Filtering,
  ): Promise<ListResponse<Complaint>> {
    const [complaints, totalItems] = await this.orderService.getOwnerComplaints(
      userId,
      orderId,
      limit,
      offset,
      sort,
      filter,
    );
    const totalPages = Math.ceil(totalItems / limit);
    return {
      message: 'Danh sách khiếu nại của đơn hàng',
      statusCode: HttpStatus.OK,
      pageIndex: page,
      pageSize: size,
      totalItems,
      totalPages,
      hasNextPage: page + 1 < totalPages,
      hasPrevPage: 0 > page,
      items: complaints,
    };
  }

  @Post(':id/complaints/me')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Tạo khiếu nại cho đơn hàng',
    description: `
          **Hướng dẫn sử dụng:**

          - Truyền \`id\` của đơn hàng trên URL.
          - Truyền dữ liệu khiếu nại trong body.
          - Các trường bắt buộc: \`reason\`, \`description\`.
          - Nếu không tìm thấy đơn hàng sẽ trả về lỗi.
          - Trả về thông tin chi tiết của khiếu nại đã tạo.
      `,
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            item: { example: null, $ref: getSchemaPath(Complaint) },
          },
        },
      ],
    },
  })
  async createComplaint(
    @UserId() userId: string,
    @Param('id') orderId: string,
    @Body() body: CUComplaintDto,
  ): Promise<ItemResponse<Complaint>> {
    const complaint = await this.orderService.createComplaint(userId, orderId, body);
    return {
      message: 'Khiếu nại đã được tạo thành công',
      statusCode: HttpStatus.CREATED,
      item: complaint,
    };
  }

  @Put(':id/check-out')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.CUSTOMER)
  @ApiOperation({
    summary: 'Thanh toán đơn hàng bằng ví điện tử',
    description: `
      **Hướng dẫn sử dụng:**

      - Truyền \`id\` của đơn hàng trên URL.
      - Nếu không tìm thấy đơn hàng thì trả về lỗi.
      - Trả về chi tiết đơn hàng sau khi thanh toán xong.
      - Nếu tiền không đủ thì thông báo lỗi để customer đi nạp tiền.
      - Cần thanh toán 150% giá trị đơn hàng cho luồng thuê.
      - Cần thanh toán 100% đơn hàng cho luồng mua.
      - Có thể thanh toán nhiều lần cho luồng custom.
      - Chỉ quan tâm và  truyền \`amount\` trong body khi thanh toán cho luồng custom.
    `,
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            item: { $ref: getSchemaPath(Order) },
          },
        },
      ],
    },
  })
  async checkOutOrder(
    @UserId() userId: string,
    @Param('id') orderId: string,
    @Body() body: OtpPaymentDto,
  ): Promise<ItemResponse<Order>> {
    const order = await this.orderService.checkOutOrder(userId, orderId, body);
    return {
      message: 'Thanh toán đơn hàng thành công',
      statusCode: HttpStatus.OK,
      item: order,
    };
  }

  @Put(':id/cancel')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF, UserRole.CUSTOMER)
  @ApiOperation({
    summary: 'Hủy đơn hàng (dành cho khách hàng, chỉ khi đơn hàng đang ở trạng thái PENDING)',
    description: `
          **Hướng dẫn sử dụng:**

          - Chỉ người dùng có quyền \`CUSTOMER\` có thể hủy đơn hàng (khi đơn đang PENDING).
          - Truyền \`id\` của đơn hàng trên URL.
          - Nếu không tìm thấy đơn hang sẽ trả về lỗi.
          - Trả về thông tin chi tiết của đơn hàng đã hủy.
      `,
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            item: { example: null, $ref: getSchemaPath(Order) },
          },
        },
      ],
    },
  })
  async cancelOrder(
    @UserId() userId: string,
    @Param('id') id: string,
  ): Promise<ItemResponse<Order>> {
    const order = await this.orderService.cancelOrder(userId, id);
    return {
      message: 'Đơn hàng đã được hủy thành công',
      statusCode: HttpStatus.OK,
      item: order,
    };
  }

  @Put(':id/confirm-no-complaint')
  @UseGuards(AuthGuard)
  @Roles(UserRole.CUSTOMER, UserRole.SHOP)
  @ApiOperation({
    summary: 'Xác nhận không khiếu nại',
    description: `
      **Hướng dẫn sử dụng:**

      - Truyền \`id\` của đơn hàng trên URL.
      - Nếu không tìm thấy đơn hàng thì trả về lỗi.
      - Trả về thông tin chi tiết của đơn hàng đã xác nhận không khiếu nại.
    `,
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            item: { example: null, type: 'string' },
          },
        },
      ],
    },
  })
  async confirmNoComplaint(
    @CurrentRole() currentRole: UserRole,
    @Param('id') id: string,
  ): Promise<ItemResponse<string>> {
    const message = await this.orderService.confirmNoComplaint(id, currentRole);
    return {
      message: 'Xác nhận không khiếu nại thành công',
      statusCode: HttpStatus.OK,
      item: message,
    };
  }

  @Put(':id/:status')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF, UserRole.SHOP)
  @ApiOperation({
    summary: 'Cập nhật trạng thái đơn hàng',
    description: `
          **Hướng dẫn sử dụng:**

          - Chỉ người dùng có quyền \`CUSTOMER\` không thể cập nhật trạng thái đơn hàng.
          - Truyền \`id\` của đơn hàng trên URL.
          - Truyền dữ liệu trong body dưới dạng JSON.
          - Truyền dữ liệu cập nhật trên URL.
          - Các trường bắt buộc: \`address\`, \`due_date\`, \`type\`.
          - Nếu không tìm thấy đơn hang sẽ trả về lỗi.
          - OrderStatus: PENDING, IN_PROCESS, COMPLETED, CANCELLED
          - Trả về thông tin chi tiết của đơn hàng đã cập nhật.
      `,
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            item: { example: null, $ref: getSchemaPath(Order) },
          },
        },
      ],
    },
  })
  async updateOrderStatus(
    @UserId() userId: string,
    @Param('id') id: string,
    @Param('status') status: OrderStatus,
  ): Promise<ItemResponse<Order>> {
    const order = await this.orderService.updateOrderStatus(userId, id, status);
    return {
      message: 'Đơn hàng đã được cập nhật trạng thái thành công',
      statusCode: HttpStatus.OK,
      item: order,
    };
  }
}
