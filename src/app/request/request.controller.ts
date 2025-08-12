import { CURequestDto } from '@/app/request/request.dto';
import { RequestService } from '@/app/request/request.service';
import { ItemResponse, ListResponse } from '@/common/base';
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
import { Request, UserRole } from '@/common/models';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';

@Controller('requests')
@ApiTags('Request Controller')
@ApiBearerAuth()
@ApiExtraModels(ItemResponse, ListResponse, Request)
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @Post('me')
  @UseGuards(AuthGuard)
  @Roles(UserRole.CUSTOMER)
  @ApiOperation({
    summary: 'Khách hàng tạo yêu cầu mới',
    description: `Hướng dẫn:
1. Gửi yêu cầu tạo mới với thông tin chi tiết về yêu cầu.
2. Yêu cầu sẽ được lưu trữ và trả về thông tin chi tiết của yêu cầu đã tạo.
3. Đảm bảo rằng người dùng đã đăng nhập và có role CUSTOMER.
4. Trả về mã trạng thái 201 (Created) nếu tạo thành công.
5. Trả về thông tin yêu cầu đã tạo trong phần thân của phản hồi.
6. Status bao gồm: DRAFT, SUBMIT
`,
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            item: {
              $ref: getSchemaPath(Request),
            },
          },
        },
      ],
    },
  })
  async createRequestForCustomer(
    @UserId() userId: string,
    @Body() body: CURequestDto,
  ): Promise<ItemResponse<Request>> {
    const request = await this.requestService.createRequestForCustomer(userId, body);
    return {
      message: 'Request created successfully',
      statusCode: HttpStatus.CREATED,
      item: request,
    };
  }

  @Get('me')
  @UseGuards(AuthGuard)
  @Roles(UserRole.CUSTOMER)
  @ApiOperation({
    summary: 'Khách hàng lấy danh sách yêu cầu của mình',
    description: `Hướng dẫn:
1. Gửi yêu cầu lấy danh sách yêu cầu của khách hàng.
2. Có thể sử dụng các tham số phân trang, sắp xếp và lọc để tùy chỉnh kết quả.
3. Trả về mã trạng thái 200 (OK) nếu thành công.
4. Trả về danh sách yêu cầu trong phần thân của phản hồi.
5. Page bắt đầu từ 0, size là số lượng yêu cầu mỗi trang.
6. Sort là chuỗi định dạng "trường:thứ tự", ví dụ: "title:asc" hoặc "createdAt:desc".
7. Filter theo format: [tên_field]:[eq|neq|gt|gte|lt|lte|like|nlike|in|nin]:[keyword]; hoặc [tên_field]:[isnull|isnotnull]
8. Các trường có thể lọc bao gồm: title, status.
9. Các trường có thể sắp xếp bao gồm: title, createdAt, status.`,
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
    description: 'Sắp xếp theo trường, ví dụ: title:asc',
  })
  @ApiQuery({
    name: 'filter',
    required: false,
    type: String,
    description: 'Lọc theo trường, ví dụ: title:like:',
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ListResponse) },
        {
          properties: {
            items: {
              type: 'array',
              items: { $ref: getSchemaPath(Request) },
            },
          },
        },
      ],
    },
  })
  async getRequestsForCustomer(
    @UserId() userId: string,
    @PaginationParams() { page, size, limit, offset }: Pagination,
    @SortingParams(['title', 'createdAt', 'status']) sort?: Sorting,
    @FilteringParams(['title', 'status']) filter?: Filtering,
  ): Promise<ListResponse<Request>> {
    const [requests, totalItems] = await this.requestService.getRequestsForCustomer(
      userId,
      limit,
      offset,
      sort,
      filter,
    );
    const totalPages = Math.ceil(totalItems / size);
    return {
      message: 'Requests retrieved successfully',
      statusCode: HttpStatus.OK,
      pageIndex: page,
      pageSize: size,
      totalItems,
      totalPages,
      hasNextPage: page + 1 < totalPages,
      hasPrevPage: page > 0,
      items: requests,
    };
  }

  @Get(':id/me')
  @UseGuards(AuthGuard)
  @Roles(UserRole.CUSTOMER)
  @ApiOperation({
    summary: 'Khách hàng lấy thông tin yêu cầu của mình',
    description: `Hướng dẫn:
1. Gửi yêu cầu lấy thông tin chi tiết của một yêu cầu cụ thể.
2. Cung cấp ID của yêu cầu trong tham số đường dẫn.
3. Trả về mã trạng thái 200 (OK) nếu thành công.
4. Trả về thông tin yêu cầu trong phần thân của phản hồi.
5. Đảm bảo rằng người dùng đã đăng nhập và có role CUSTOMER.`,
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            item: {
              $ref: getSchemaPath(Request),
            },
          },
        },
      ],
    },
  })
  async getRequestForCustomer(
    @UserId() userId: string,
    @Param('id') id: string,
  ): Promise<ItemResponse<Request>> {
    const request = await this.requestService.getRequestForCustomer(userId, id);
    return {
      message: 'Request retrieved successfully',
      statusCode: HttpStatus.OK,
      item: request,
    };
  }

  @Put(':id/me')
  @UseGuards(AuthGuard)
  @Roles(UserRole.CUSTOMER)
  @ApiOperation({
    summary: 'Khách hàng cập nhật yêu cầu của mình',
    description: `Hướng dẫn:
1. Gửi yêu cầu cập nhật với ID của yêu cầu cần cập nhật.
2. Cung cấp thông tin mới trong phần thân của yêu cầu.
3. Trả về mã trạng thái 204 (No Content) nếu cập nhật thành công.
4. Đảm bảo rằng người dùng đã đăng nhập và có role CUSTOMER.
5. Trả về thông báo thành công trong phần thân của phản hồi.`,
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            item: { type: 'null' },
          },
        },
      ],
    },
  })
  async updateRequestForCustomer(
    @UserId() userId: string,
    @Param('id') id: string,
    @Body() body: CURequestDto,
  ): Promise<ItemResponse<null>> {
    await this.requestService.updateRequestForCustomer(userId, id, body);
    return {
      message: 'Request updated successfully',
      statusCode: HttpStatus.NO_CONTENT,
      item: null,
    };
  }

  @Delete(':id/me')
  @UseGuards(AuthGuard)
  @Roles(UserRole.CUSTOMER)
  @ApiOperation({
    summary: 'Khách hàng xóa yêu cầu của mình',
    description: `Hướng dẫn:
1. Gửi yêu cầu xóa với ID của yêu cầu cần xóa.
2. Trả về mã trạng thái 204 (No Content) nếu xóa thành công
3. Đảm bảo rằng người dùng đã đăng nhập và có role CUSTOMER.
4. Trả về thông báo thành công trong phần thân của phản hồi.`,
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            item: { type: 'null' },
          },
        },
      ],
    },
  })
  async deleteRequestForCustomer(
    @UserId() userId: string,
    @Param('id') id: string,
  ): Promise<ItemResponse<null>> {
    await this.requestService.deleteRequestForCustomer(userId, id);
    return {
      message: 'Request deleted successfully',
      statusCode: HttpStatus.NO_CONTENT,
      item: null,
    };
  }

  @Get('shop')
  @UseGuards(AuthGuard)
  @Roles(UserRole.SHOP)
  @ApiOperation({
    summary: 'Shop lấy danh sách yêu cầu',
    description: `Hướng dẫn:
1. Gửi yêu cầu lấy danh sách yêu cầu của shop.
2. Có thể sử dụng các tham số phân trang, sắp xếp và lọc để tùy chỉnh kết quả.
3. Trả về mã trạng thái 200 (OK) nếu thành công.
4. Trả về danh sách yêu cầu trong phần thân của phản hồi.
5. Page bắt đầu từ 0, size là số lượng yêu cầu mỗi trang.
6. Sort là chuỗi định dạng "trường:thứ tự", ví dụ: "title:asc" hoặc "createdAt:desc".
7. Filter theo format: [tên_field]:[eq|neq|gt|gte|lt|lte|like|nlike|in|nin]:[keyword]; hoặc [tên_field]:[isnull|isnotnull]
8. Các trường có thể lọc bao gồm: title, status.
9. Các trường có thể sắp xếp bao gồm: title, createdAt, status.`,
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
    description: 'Sắp xếp theo trường, ví dụ: title:asc',
  })
  @ApiQuery({
    name: 'filter',
    required: false,
    type: String,
    description: 'Lọc theo trường, ví dụ: title:like:',
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ListResponse) },
        {
          properties: {
            items: {
              type: 'array',
              items: { $ref: getSchemaPath(Request) },
            },
          },
        },
      ],
    },
  })
  async getRequestsForShop(
    @PaginationParams() { page, size, limit, offset }: Pagination,
    @SortingParams(['title', 'createdAt', 'status']) sort?: Sorting,
    @FilteringParams(['title', 'status']) filter?: Filtering,
  ): Promise<ListResponse<Request>> {
    const [requests, totalItems] = await this.requestService.getRequestsForShop(
      limit,
      offset,
      sort,
      filter,
    );
    const totalPages = Math.ceil(totalItems / size);
    return {
      message: 'Requests retrieved successfully',
      statusCode: HttpStatus.OK,
      pageIndex: page,
      pageSize: size,
      totalItems,
      totalPages,
      hasNextPage: page + 1 < totalPages,
      hasPrevPage: page > 0,
      items: requests,
    };
  }

  @Get(':id/shop')
  @UseGuards(AuthGuard)
  @Roles(UserRole.SHOP)
  @ApiOperation({
    summary: 'Shop lấy thông tin yêu cầu',
    description: `Hướng dẫn:
1. Gửi yêu cầu lấy thông tin chi tiết của một yêu cầu cụ thể.
2. Cung cấp ID của yêu cầu trong tham số đường dẫn.
3. Trả về mã trạng thái 200 (OK) nếu thành công.
4. Trả về thông tin yêu cầu trong phần thân của phản hồi.
5. Đảm bảo rằng người dùng đã đăng nhập và có role SHOP.`,
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            item: {
              $ref: getSchemaPath(Request),
            },
          },
        },
      ],
    },
  })
  async getRequestForShop(@Param('id') id: string): Promise<ItemResponse<Request>> {
    const request = await this.requestService.getRequestForShop(id);
    return {
      message: 'Request retrieved successfully',
      statusCode: HttpStatus.OK,
      item: request,
    };
  }
}
