import { OrderStatus } from './../../common/models/order/order.model';
import { ItemResponse, ListResponse } from '@/common/base';
import { Milestone, Order, UserRole } from '@/common/models';
import { Body, Controller, Get, HttpStatus, Post, Put, Param, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { OrderService } from '@/app/order/order.service';
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
import { AuthGuard } from '@/common/guards';
import { CreateOrderRequestDto, CUOrderDto, orderDto } from './order.dto';

@Controller('orders')
@ApiTags('Order Controller')
@ApiBearerAuth()
@ApiExtraModels(ItemResponse, ListResponse, orderDto)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF)
  @ApiOperation({
    summary: 'Lấy danh sách đơn hàng với phân trang, sắp xếp và lọc (Super Admin/Admin/Staff)',
    description: `
        **Hướng dẫn sử dụng:**

        - Trả về danh sách đơn hàng (bao gồm cả đã xóa mềm) dưới quyền quản trị/nhân viên.
        - Hỗ trợ phân trang, sắp xếp, lọc.
        - Page bắt đầu từ 0
        - Sort theo format: [tên_field]:[asc/desc]
        - Các trường đang có thể sort: due_date, amount
        - Filter theo format: [tên_field]:[eq|neq|gt|gte|lt|lte|like|nlike|in|nin]:[keyword]; hoặc [tên_field]:[isnull|isnotnull]
        - Các trường đang có thể filter: customer_id, shop_id, phone, email address, due_date, return_date, is_buy_back, amount, type, status`,
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
            items: { $ref: getSchemaPath(orderDto) },
          },
        },
      ],
    },
  })
  async getAllOrdersForAdmin(
    @PaginationParams() { page, size, limit, offset }: Pagination,
    @SortingParams(['due_date', 'amount']) sort?: Sorting,
    @FilteringParams([
      'customer_id',
      'shop_id',
      'phone',
      'email',
      'address',
      'due_date',
      'return_date',
      'is_buy_back',
      'amount',
      'type',
      'status',
    ])
    filter?: Filtering,
  ): Promise<ListResponse<orderDto>> {
    const [orders, totalItems] = await this.orderService.getOrdersForAdmin(
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

  @Get('/customer')
  @UseGuards(AuthGuard)
  @Roles(UserRole.CUSTOMER)
  @ApiOperation({
    summary: 'Lấy danh sách đơn hàng của khách hàng (Customer only)',
    description: `
        **Hướng dẫn sử dụng:**

        - Trả về danh sách đơn hàng của khách hàng hiện tại.
        - Hỗ trợ phân trang, sắp xếp, lọc.
        - Page bắt đầu từ 0
        - Sort theo format: [tên_field]:[asc/desc]
        - Các trường đang có thể sort: due_date, amount
        - Filter theo format: [tên_field]:[eq|neq|gt|gte|lt|lte|like|nlike|in|nin]:[keyword]; hoặc [tên_field]:[isnull|isnotnull]
        - Các trường đang có thể filter: customer_id, shop_id, phone, email address, due_date, return_date, is_buy_back, amount, type, status`,
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
            items: { $ref: getSchemaPath(orderDto) },
          },
        },
      ],
    },
  })
  async getOrdersForCustomer(
    @UserId() userId: string,
    @PaginationParams() { page, size, limit, offset }: Pagination,
    @SortingParams(['due_date', 'amount']) sort?: Sorting,
    @FilteringParams([
      'shop_id',
      'phone',
      'email',
      'address',
      'due_date',
      'return_date',
      'is_buy_back',
      'amount',
      'type',
      'status',
    ])
    filter?: Filtering,
  ): Promise<ListResponse<orderDto>> {
    const [orders, totalItems] = await this.orderService.getOrdersForCustomer(
      userId,
      limit,
      offset,
      sort,
      filter,
    );
    const totalPages = Math.ceil(totalItems / limit);
    return {
      message: 'Đây là danh sách tất cả đơn hàng của khách hàng',
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

  @Get('/shop')
  @UseGuards(AuthGuard)
  @Roles(UserRole.SHOP)
  @ApiOperation({
    summary: 'Lấy danh sách đơn hàng của cửa hàng (Shop only)',
    description: `
        **Hướng dẫn sử dụng:**

        - Trả về danh sách đơn hàng của cửa hàng hiện tại.
        - Hỗ trợ phân trang, sắp xếp, lọc.
        - Page bắt đầu từ 0
        - Sort theo format: [tên_field]:[asc/desc]
        - Các trường đang có thể sort: due_date, amount
        - Filter theo format: [tên_field]:[eq|neq|gt|gte|lt|lte|like|nlike|in|nin]:[keyword]; hoặc [tên_field]:[isnull|isnotnull]
        - Các trường đang có thể filter: customer_id, shop_id, phone, email address, due_date, return_date, is_buy_back, amount, type, status`,
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
            items: { $ref: getSchemaPath(orderDto) },
          },
        },
      ],
    },
  })
  async getOrdersForShop(
    @UserId() userId: string,
    @PaginationParams() { page, size, limit, offset }: Pagination,
    @SortingParams(['due_date', 'amount']) sort?: Sorting,
    @FilteringParams([
      'customer_id',
      'phone',
      'email',
      'address',
      'due_date',
      'return_date',
      'is_buy_back',
      'amount',
      'type',
      'status',
    ])
    filter?: Filtering,
  ): Promise<ListResponse<orderDto>> {
    const [orders, totalItems] = await this.orderService.getOrdersForShop(
      userId,
      limit,
      offset,
      sort,
      filter,
    );
    const totalPages = Math.ceil(totalItems / limit);
    return {
      message: 'Đây là danh sách tất cả đơn hàng của cửa hàng',
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

  @Get(':id')
  @UseGuards(AuthGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF, UserRole.CUSTOMER, UserRole.SHOP)
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
            items: { $ref: getSchemaPath(orderDto) },
          },
        },
      ],
    },
  })
  async getOrderById(@Param('id') id: string): Promise<ItemResponse<orderDto>> {
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
    summary: 'Tạo đơn hàng mới',
    description: `
          **Hướng dẫn sử dụng:**

          - Chỉ người dùng có quyền \`CUSTOMER\` mới có thể tạo đơn hàng.
          - Truyền dữ liệu đơn hàng trong body theo dạng JSON.
          - Các trường bắt buộc: \`customer_id\`, \`shop_id\`, \`address\`, \`due_date\`, \`type\`.
          - Trả về thông tin chi tiết của đơn hàng vừa tạo.
          - OrderStatus: PENDING, IN_PROCESS, COMPLETED, CANCELLED
          - OrderType: SELL, RENT, CUSTOM
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
  async createOrder(
    @UserId() userId: string,
    @Body() body: CreateOrderRequestDto,
  ): Promise<ItemResponse<Order>> {
    const order = await this.orderService.createOrder(userId, body);
    return {
      message: 'Đơn hàng đã được tạo thành công',
      statusCode: HttpStatus.CREATED,
      item: order,
    };
  }

  @Put(':id')
  @UseGuards(AuthGuard)
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
    @Body() updatedOrder: CUOrderDto,
  ): Promise<ItemResponse<Order>> {
    const order = await this.orderService.updateOrder(userId, id, updatedOrder);
    return {
      message: 'Đơn hàng đã được cập nhật thành công',
      statusCode: HttpStatus.OK,
      item: order,
    };
  }

  @Put(':id/milestones')
  @UseGuards(AuthGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF, UserRole.SHOP)
  @ApiOperation({
    summary: 'Cập nhật thông tin milestones của đơn hàng đơn hàng',
    description: `
          **Hướng dẫn sử dụng:**

          - Truyền \`id\` của đơn hàng trên URL.
          - Truyền dữ liệu cập nhật milestone trong body theo dạng JSON.
          - Các trường bắt buộc: \`address\`, \`due_date\`, \`type\`.
          - Nếu không tìm thấy đơn hang sẽ trả về lỗi.
          - OrderStatus: PENDING, IN_PROCESS, COMPLETED, CANCELLED
          - Trả về thông tin chi tiết milestones của đơn hàng đã cập nhật.
      `,
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ListResponse) },
        {
          properties: {
            item: { example: null, $ref: getSchemaPath(Milestone) },
          },
        },
      ],
    },
  })
  async updateOrderMilestone(
    @UserId() userId: string,
    @Param('id') id: string,
    @Body() updatedOrder: CUOrderDto,
  ): Promise<ItemResponse<Order>> {
    const order = await this.orderService.updateOrder(userId, id, updatedOrder);
    return {
      message: 'Đơn hàng đã được cập nhật thành công',
      statusCode: HttpStatus.OK,
      item: order,
    };
  }

  @Put(':id/status')
  @UseGuards(AuthGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF, UserRole.SHOP)
  @ApiOperation({
    summary: 'Cập nhật trạng thái đơn hàng',
    description: `
          **Hướng dẫn sử dụng:**

          - Chỉ người dùng có quyền \`CUSTOMER\` không thể cập nhật trạng thái đơn hàng.
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
