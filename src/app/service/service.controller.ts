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
import { ServiceService } from '@/app/service/service.service';
import { ItemResponse, ListResponse } from '@/common/base';
import { Service, UserRole } from '@/common/models';
import { AuthGuard } from '@/common/guards';
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
import { CUServiceDto, ItemServiceDto, ListServiceDto } from '@/app/service/service.dto';
import { plainToInstance } from 'class-transformer';

@Controller('services')
@ApiTags('Service Controller')
@ApiBearerAuth()
@ApiExtraModels(ItemResponse, ListResponse, Service, ListServiceDto, ItemServiceDto)
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Get('me')
  @UseGuards(AuthGuard)
  @Roles(UserRole.SHOP)
  @ApiOperation({
    summary: 'Lấy danh sách dịch vụ của chủ shop đang đăng nhập',
    description: `
**Hướng dẫn sử dụng:**

- Trả về danh sách dịch vụ thuộc về tài khoản shop đang đăng nhập (bao gồm cả đã xóa mềm).
- Hỗ trợ phân trang, sắp xếp, lọc.
- Page bắt đầu từ 0
- Sort theo format: [tên_field]:[asc/desc]
- Các trường đang có thể sort: name
- Filter theo format: [tên_field]:[eq|neq|gt|gte|lt|lte|like|nlike|in|nin]:[keyword]; hoặc [tên_field]:[isnull|isnotnull]
- Các trường đang có thể filter: name, status
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
    description: 'Sắp xếp theo trường, ví dụ: :asc',
  })
  @ApiQuery({
    name: 'filter',
    required: false,
    type: String,
    description: 'Lọc theo trường, ví dụ: :like:',
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ListResponse) },
        {
          properties: {
            item: { $ref: getSchemaPath(Service) },
          },
        },
      ],
    },
  })
  async getServicesForOwner(
    @UserId() userId: string,
    @PaginationParams() { page, size, limit, offset }: Pagination,
    @SortingParams(['name', 'createdAt', 'updatedAt']) sort?: Sorting[],
    @FilteringParams(['name', 'status']) filter?: Filtering[],
  ): Promise<ListResponse<Service>> {
    const [services, totalItems] = await this.serviceService.getServicesForOwner(
      userId,
      limit,
      offset,
      sort,
      filter,
    );
    const totalPages = Math.ceil(totalItems / size);

    return {
      message: 'Đây là danh sách các dịch vụ của bạn',
      statusCode: HttpStatus.OK,
      pageIndex: page,
      pageSize: size,
      totalItems,
      totalPages,
      hasNextPage: page + 1 < totalPages,
      hasPrevPage: 0 < page,
      items: services,
    };
  }

  @Get(':id/me')
  @UseGuards(AuthGuard)
  @Roles(UserRole.SHOP)
  @ApiOperation({
    summary: 'Lấy chi tiết dịch vụ của chủ shop đang đăng nhập',
    description: `
**Hướng dẫn sử dụng:**

- Truyền \`id\` của dịch vụ trên URL.
- Chỉ trả về dịch vụ thuộc về tài khoản shop đang đăng nhập (bao gồm cả đã xóa mềm).
- Nếu không tìm thấy sẽ trả về lỗi.
`,
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            item: { $ref: getSchemaPath(Service) },
          },
        },
      ],
    },
  })
  async getServiceForOwner(
    @UserId() userId: string,
    @Param('id') id: string,
  ): Promise<ItemResponse<Service>> {
    const service = await this.serviceService.getServiceForOwner(userId, id);
    return {
      message: 'Đây là thông tin chi tiết của dịch vụ',
      statusCode: HttpStatus.OK,
      item: service,
    };
  }

  @Post('me')
  @UseGuards(AuthGuard)
  @Roles(UserRole.SHOP)
  @ApiOperation({
    summary: 'Tạo mới dịch vụ cho chủ shop đang đăng nhập',
    description: `
**Hướng dẫn sử dụng:**

- Gửi thông tin dịch vụ cần tạo ở phần Body dưới dạng JSON.
- Dịch vụ sẽ gắn với tài khoản shop đang đăng nhập.
- Các trường bắt buộc: \`name\`, \`status\`, ...
- Trả về thông tin dịch vụ vừa tạo.
`,
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            item: { $ref: getSchemaPath(Service) },
          },
        },
      ],
    },
  })
  async createServiceForOwner(
    @UserId() userId: string,
    @Body() body: CUServiceDto,
  ): Promise<ItemResponse<Service>> {
    const service = await this.serviceService.createServiceForOwner(userId, body);
    return {
      message: 'Tạo dịch vụ mới thành công',
      statusCode: HttpStatus.CREATED,
      item: service,
    };
  }

  @Put(':id/me')
  @UseGuards(AuthGuard)
  @Roles(UserRole.SHOP)
  @ApiOperation({
    summary: 'Cập nhật dịch vụ của chủ shop đang đăng nhập',
    description: `
**Hướng dẫn sử dụng:**

- Truyền \`id\` của dịch vụ trên URL.
- Gửi thông tin cập nhật ở phần Body.
- Chỉ cập nhật dịch vụ thuộc về tài khoản shop đang đăng nhập.
- Nếu không tìm thấy sẽ trả về lỗi.
- Status gồm: AVAILABLE, UNAVAILABLE, DRAFT
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
  async updateServiceForOwner(
    @UserId() userId: string,
    @Param('id') id: string,
    @Body() body: CUServiceDto,
  ): Promise<ItemResponse<null>> {
    await this.serviceService.updateServiceForOwner(userId, id, body);
    return {
      message: 'Cập nhật dịch vụ thành công',
      statusCode: HttpStatus.NO_CONTENT,
      item: null,
    };
  }

  @Delete(':id/me')
  @UseGuards(AuthGuard)
  @Roles(UserRole.SHOP)
  @ApiOperation({
    summary: 'Xóa mềm dịch vụ của chủ shop đang đăng nhập',
    description: `
**Hướng dẫn sử dụng:**

- Truyền \`id\` của dịch vụ trên URL.
- Chỉ xóa mềm dịch vụ thuộc về tài khoản shop đang đăng nhập.
- Nếu không tìm thấy sẽ trả về lỗi.
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
  async removeServiceForOwner(
    @UserId() userId: string,
    @Param('id') id: string,
  ): Promise<ItemResponse<null>> {
    await this.serviceService.removeServiceForOwner(userId, id);
    return {
      message: 'Xóa dịch vụ thành công',
      statusCode: HttpStatus.NO_CONTENT,
      item: null,
    };
  }

  @Patch(':id/me')
  @UseGuards(AuthGuard)
  @Roles(UserRole.SHOP)
  @ApiOperation({
    summary: 'Khôi phục dịch vụ đã xóa mềm của chủ shop đang đăng nhập',
    description: `
**Hướng dẫn sử dụng:**

- Truyền \`id\` của dịch vụ trên URL.
- Chỉ khôi phục dịch vụ thuộc về tài khoản shop đang đăng nhập.
- Nếu không tìm thấy sẽ trả về lỗi.
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
  async restoreServiceForOwner(
    @UserId() userId: string,
    @Param('id') id: string,
  ): Promise<ItemResponse<null>> {
    await this.serviceService.restoreServiceForOwner(userId, id);
    return {
      message: 'Khôi phục dịch vụ thành công',
      statusCode: HttpStatus.NO_CONTENT,
      item: null,
    };
  }

  @Get()
  @ApiOperation({
    summary: 'Lấy danh sách dịch vụ cho khách hàng',
    description: `
**Hướng dẫn sử dụng:**

- Trả về danh sách các dịch vụ đang ở trạng thái ACTIVE.
- Hỗ trợ phân trang, sắp xếp, lọc:
  - \`page\`: Số trang (bắt đầu từ 0)
  - \`size\`: Số lượng mỗi trang
  - \`sort\`: Ví dụ: name:asc
  - \`filter\`: Ví dụ: name:like:trang điểm
- Chỉ trả về dịch vụ khả dụng cho khách hàng.
- Page bắt đầu từ 0
- Sort theo format: [tên_field]:[asc/desc]
- Các trường đang có thể sort: name, ratingAverage
- Filter theo format: [tên_field]:[eq|neq|gt|gte|lt|lte|like|nlike|in|nin]:[keyword]; hoặc [tên_field]:[isnull|isnotnull]
- Các trường đang có thể filter: name, ratingAverage
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
    description: 'Sắp xếp theo trường, ví dụ: :asc',
  })
  @ApiQuery({
    name: 'filter',
    required: false,
    type: String,
    description: 'Lọc theo trường, ví dụ: :like:',
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ListResponse) },
        {
          properties: {
            item: { $ref: getSchemaPath(ListServiceDto) },
          },
        },
      ],
    },
  })
  async getServicesForCustomer(
    @PaginationParams() { page, size, limit, offset }: Pagination,
    @SortingParams(['name', 'ratingAverage', 'createdAt', 'updatedAt']) sort?: Sorting[],
    @FilteringParams(['name', 'ratingAverage']) filter?: Filtering[],
  ): Promise<ListResponse<ListServiceDto>> {
    const [services, totalItems] = await this.serviceService.getServicesForCustomer(
      limit,
      offset,
      sort,
      filter,
    );
    const totalPages = Math.ceil(totalItems / size);
    const dtos = plainToInstance(ListServiceDto, services, { excludeExtraneousValues: true });
    return {
      message: 'Đây là danh sách các dịch vụ khả dụng',
      statusCode: HttpStatus.OK,
      pageIndex: page,
      pageSize: size,
      totalItems,
      totalPages,
      hasNextPage: page + 1 < totalPages,
      hasPrevPage: 0 < page,
      items: dtos,
    };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Lấy thông tin chi tiết dịch vụ cho khách hàng',
    description: `
**Hướng dẫn sử dụng:**

- Truyền \`id\` của dịch vụ trên URL.
- Chỉ trả về dịch vụ ở trạng thái ACTIVE.
- Nếu không tìm thấy sẽ trả về lỗi.
`,
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            item: { $ref: getSchemaPath(ItemServiceDto) },
          },
        },
      ],
    },
  })
  async getServiceForCustomer(@Param('id') id: string): Promise<ItemResponse<ItemServiceDto>> {
    const service = await this.serviceService.getServiceForCustomer(id);
    const dto = plainToInstance(ItemServiceDto, service, { excludeExtraneousValues: true });
    return {
      message: 'Đây là thông tin chi tiết của dịch vụ',
      statusCode: HttpStatus.OK,
      item: dto,
    };
  }
}
