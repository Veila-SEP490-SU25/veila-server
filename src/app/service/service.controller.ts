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

  @Get()
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
  @ApiOperation({})
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
    @SortingParams(['name']) sort?: Sorting,
    @FilteringParams(['name', 'status']) filter?: Filtering,
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
  @ApiOperation({})
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
    const feedbacks = (service.feedbacks || []).map((fb) => ({
      username: fb.customer.username,
      content: fb.content,
      rating: fb.rating,
      images: fb.images,
    }));
    const dto = plainToInstance(
      ItemServiceDto,
      { ...service, feedbacks },
      { excludeExtraneousValues: true },
    );
    return {
      message: 'Đây là thông tin chi tiết của dịch vụ',
      statusCode: HttpStatus.OK,
      item: dto,
    };
  }

  @Get('me')
  @UseGuards(AuthGuard)
  @Roles(UserRole.SHOP)
  @ApiOperation({})
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
    @SortingParams(['name']) sort?: Sorting,
    @FilteringParams(['name', 'status']) filter?: Filtering,
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
  @ApiOperation({})
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
  @ApiOperation({})
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
  @ApiOperation({})
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
  @ApiOperation({})
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
  @ApiOperation({})
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
}
