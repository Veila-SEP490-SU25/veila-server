import { CUSubscriptionDto } from '@/app/subscription/subscription.dto';
import { SubscriptionService } from '@/app/subscription/subscription.service';
import { ItemResponse, ListResponse } from '@/common/base';
import {
  CurrentRole,
  Filtering,
  FilteringParams,
  Pagination,
  PaginationParams,
  Roles,
  Sorting,
  SortingParams,
} from '@/common/decorators';
import { AuthGuard, OptionalAuthGuard } from '@/common/guards';
import { Subscription, UserRole } from '@/common/models';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
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

@Controller('subscriptions')
@ApiTags('Subscription Controller')
@ApiBearerAuth()
@ApiExtraModels(ItemResponse, ListResponse, Subscription)
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF)
  @ApiOperation({
    summary: 'Tạo gói thành viên mới',
    description: `**Hướng dẫn sử dụng:**
- Tạo mới một gói thành viên.
- Yêu cầu các trường: name, description, duration, amount, images.
- Trả về gói thành viên đã tạo.
`,
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            item: { $ref: getSchemaPath(Subscription) },
          },
        },
      ],
    },
  })
  async createSubscription(@Body() body: CUSubscriptionDto): Promise<ItemResponse<Subscription>> {
    const subscription = await this.subscriptionService.createSubscription(body);
    return {
      message: 'Gói thành viên đã được tạo thành công',
      statusCode: HttpStatus.CREATED,
      item: subscription,
    };
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF)
  @ApiOperation({
    summary: 'Cập nhật gói thành viên',
    description: `**Hướng dẫn sử dụng:**
- Cập nhật thông tin gói thành viên theo ID.
- Yêu cầu các trường: name, description, duration, amount, images.
- Trả về thông báo thành công nếu cập nhật thành công.
`,
  })
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
  async updateSubscription(
    @Param('id') id: string,
    @Body() body: CUSubscriptionDto,
  ): Promise<ItemResponse<null>> {
    await this.subscriptionService.updateSubscription(id, body);
    return {
      message: 'Gói thành viên đã được cập nhật thành công',
      statusCode: HttpStatus.NO_CONTENT,
      item: null,
    };
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF)
  @ApiOperation({
    summary: 'Xóa gói thành viên',
    description: `**Hướng dẫn sử dụng:**
- Xóa gói thành viên theo ID.
- Trả về thông báo thành công nếu xóa thành công.
`,
  })
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
  async removeSubscription(@Param('id') id: string): Promise<ItemResponse<null>> {
    await this.subscriptionService.removeSubscription(id);
    return {
      message: 'Gói thành viên đã được xóa thành công',
      statusCode: HttpStatus.NO_CONTENT,
      item: null,
    };
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF)
  @ApiOperation({
    summary: 'Khôi phục gói thành viên đã xóa',
    description: `**Hướng dẫn sử dụng:**
- Khôi phục gói thành viên đã xóa theo ID.
- Trả về thông báo thành công nếu khôi phục thành công.
`,
  })
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
  async restoreSubscription(@Param('id') id: string): Promise<ItemResponse<null>> {
    await this.subscriptionService.restoreSubscription(id);
    return {
      message: 'Gói thành viên đã được khôi phục thành công',
      statusCode: HttpStatus.NO_CONTENT,
      item: null,
    };
  }

  @Get()
  @UseGuards(OptionalAuthGuard)
  @ApiOperation({
    summary: 'Lấy danh sách gói thành viên',
    description: `
**Hướng dẫn sử dụng:**
- Trả về danh sách các subscription khả dụng.
- Hỗ trợ phân trang, sắp xếp, lọc:
  - \`page\`: Số trang (bắt đầu từ 0)
  - \`size\`: Số lượng mỗi trang
  - \`sort\`: Ví dụ: name:asc
  - \`filter\`: Ví dụ: name:like:năm
- Trả về các trường: id, name, description, images, duration, amount.
- Chỉ trả về các subscription chưa bị xóa.
- Page bắt đầu từ 0
- Sort theo format: [tên_field]:[asc/desc]
- Các trường đang có thể sort: name, duration, amount
- Filter theo format: [tên_field]:[eq|neq|gt|gte|lt|lte|like|nlike|in|nin]:[keyword]; hoặc [tên_field]:[isnull|isnotnull]
- Các trường đang có thể filter: name
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
    description: 'Sắp xếp theo trường, ví dụ: name:asc',
  })
  @ApiQuery({
    name: 'filter',
    required: false,
    type: String,
    description: 'Lọc theo trường, ví dụ: name:like:năm',
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ListResponse) },
        {
          properties: {
            item: { $ref: getSchemaPath(Subscription) },
          },
        },
      ],
    },
  })
  async getSubscriptions(
    @CurrentRole() currentRole: UserRole,
    @PaginationParams() { page, size, limit, offset }: Pagination,
    @SortingParams(['name', 'duration', 'amount', 'createdAt', 'updatedAt']) sort?: Sorting,
    @FilteringParams(['name']) filter?: Filtering,
  ): Promise<ListResponse<Subscription>> {
    const [subscriptions, totalItems] = await this.subscriptionService.getSubscriptions(
      currentRole,
      limit,
      offset,
      sort,
      filter,
    );
    const totalPages = Math.ceil(totalItems / size);
    return {
      message: 'Danh sách gói thành viên',
      statusCode: HttpStatus.OK,
      pageIndex: page,
      pageSize: size,
      totalItems,
      totalPages,
      hasNextPage: page < totalPages - 1,
      hasPrevPage: page > 0,
      items: subscriptions,
    };
  }

  @Get(':id')
  @UseGuards(OptionalAuthGuard)
  @ApiOperation({
    summary: 'Lấy chi tiết gói thành viên',
    description: `**Hướng dẫn sử dụng:**
- Trả về chi tiết gói thành viên theo ID.
- Trả về các trường: id, name, description, images, duration, amount.
- Nếu không tìm thấy gói thành viên, trả về lỗi 404.
`,
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            item: { $ref: getSchemaPath(Subscription) },
          },
        },
      ],
    },
  })
  async getSubscription(
    @CurrentRole() currentRole: UserRole,
    @Param('id') id: string,
  ): Promise<ItemResponse<Subscription>> {
    const subscription = await this.subscriptionService.getSubscription(currentRole, id);
    return {
      message: 'Chi tiết gói thành viên',
      statusCode: HttpStatus.OK,
      item: subscription,
    };
  }
}
