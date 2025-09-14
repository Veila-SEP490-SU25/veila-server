import { ItemResponse, ListResponse } from '@/common/base';
import { Accessory, UserRole } from '@/common/models';
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
import { AccessoryService } from '@/app/accessory/accessory.service';
import { CUAccessoryDto, ItemAccessoryDto } from '@/app/accessory/accessory.dto';
import { plainToInstance } from 'class-transformer';
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

@Controller('accessories')
@ApiTags('Accessory Controller')
@ApiBearerAuth()
@ApiExtraModels(ListResponse, ItemResponse, Accessory, ItemAccessoryDto)
export class AccessoryController {
  constructor(private readonly accessoryService: AccessoryService) {}

  @Get('me')
  @UseGuards(AuthGuard)
  @Roles(UserRole.SHOP)
  @ApiOperation({
    summary: 'Lấy danh sách phụ kiện của chủ shop đang đăng nhập',
    description: `
**Hướng dẫn sử dụng:**

- Trả về danh sách phụ kiện thuộc về tài khoản shop đang đăng nhập (bao gồm cả đã xóa mềm).
- Hỗ trợ phân trang, sắp xếp, lọc.
- Page bắt đầu từ 0
- Sort theo format: [tên_field]:[asc/desc]
- Các trường đang có thể sort: name, sellPrice, rentalPrice
- Filter theo format: [tên_field]:[eq|neq|gt|gte|lt|lte|like|nlike|in|nin]:[keyword]; hoặc [tên_field]:[isnull|isnotnull]
- Các trường đang có thể filter: name, sellPrice, rentalPrice, isSellable, isRentable, status
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
    description: 'Lọc theo trường, ví dụ: :like:',
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ListResponse) },
        {
          properties: {
            item: { $ref: getSchemaPath(Accessory) },
          },
        },
      ],
    },
  })
  async getAccessoriesForOwner(
    @UserId() userId: string,
    @PaginationParams() { page, size, limit, offset }: Pagination,
    @SortingParams(['name', 'sellPrice', 'rentalPrice', 'createdAt', 'updatedAt']) sort?: Sorting[],
    @FilteringParams(['name', 'sellPrice', 'rentalPrice', 'isSellable', 'isRentable', 'status'])
    filter?: Filtering[],
  ): Promise<ListResponse<Accessory>> {
    const [accessories, totalItems] = await this.accessoryService.getAccessoriesForOwner(
      userId,
      limit,
      offset,
      sort,
      filter,
    );
    const totalPages = Math.ceil(totalItems / size);
    return {
      message: 'Đây là danh sách phụ kiện của bạn',
      statusCode: HttpStatus.OK,
      pageIndex: page,
      pageSize: size,
      totalItems,
      totalPages,
      hasNextPage: page + 1 < totalPages,
      hasPrevPage: 0 < page,
      items: accessories,
    };
  }

  @Get(':id/me')
  @UseGuards(AuthGuard)
  @Roles(UserRole.SHOP)
  @ApiOperation({
    summary: 'Lấy chi tiết phụ kiện của chủ shop đang đăng nhập',
    description: `
**Hướng dẫn sử dụng:**

- Truyền \`id\` của phụ kiện trên URL.
- Chỉ trả về phụ kiện thuộc về tài khoản shop đang đăng nhập (bao gồm cả đã xóa mềm).
- Nếu không tìm thấy sẽ trả về lỗi.
`,
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            item: { $ref: getSchemaPath(Accessory) },
          },
        },
      ],
    },
  })
  async getAccessoryForOwner(
    @UserId() userId: string,
    @Param('id') id: string,
  ): Promise<ItemResponse<Accessory>> {
    const accessory = await this.accessoryService.getAccessoryForOwner(userId, id);
    return {
      message: 'Đây là thông tin chi tiết của phụ kiện',
      statusCode: HttpStatus.OK,
      item: accessory,
    };
  }

  @Post('me')
  @UseGuards(AuthGuard)
  @Roles(UserRole.SHOP)
  @ApiOperation({
    summary: 'Tạo mới phụ kiện cho chủ shop đang đăng nhập',
    description: `
**Hướng dẫn sử dụng:**

- Gửi thông tin phụ kiện cần tạo ở phần Body dưới dạng JSON.
- Phụ kiện sẽ gắn với tài khoản shop đang đăng nhập.
- Các trường bắt buộc: \`name\`, \`sellPrice\`, \`status\`, ...
- Trả về thông tin phụ kiện vừa tạo.
- Accessory status: AVAILABLE, UNAVAILABLE, OUT_OF_STOCK
`,
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            item: { $ref: getSchemaPath(Accessory) },
          },
        },
      ],
    },
  })
  async createAccessoryForOwner(
    @UserId() userId: string,
    @Body() newAccessory: CUAccessoryDto,
  ): Promise<ItemResponse<Accessory>> {
    const accessory = await this.accessoryService.createAccessoryForOwner(userId, newAccessory);
    return {
      message: 'Tạo thành công phụ kiện mới',
      statusCode: HttpStatus.CREATED,
      item: accessory,
    };
  }

  @Put(':id/me')
  @UseGuards(AuthGuard)
  @Roles(UserRole.SHOP)
  @ApiOperation({
    summary: 'Cập nhật phụ kiện của chủ shop đang đăng nhập',
    description: `
**Hướng dẫn sử dụng:**

- Truyền \`id\` của phụ kiện trên URL.
- Gửi thông tin cập nhật ở phần Body.
- Chỉ cập nhật phụ kiện thuộc về tài khoản shop đang đăng nhập.
- Nếu không tìm thấy sẽ trả về lỗi.
- Accessory status: AVAILABLE, UNAVAILABLE, OUT_OF_STOCK
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
  async updateAccessoryForOwner(
    @UserId() userId: string,
    @Param('id') id: string,
    @Body() body: CUAccessoryDto,
  ): Promise<ItemResponse<null>> {
    await this.accessoryService.updateAccessoryForOwner(userId, id, body);
    return {
      message: 'Phụ kiện đã được cập nhật',
      statusCode: HttpStatus.NO_CONTENT,
      item: null,
    };
  }

  @Delete(':id/me')
  @UseGuards(AuthGuard)
  @Roles(UserRole.SHOP)
  @ApiOperation({
    summary: 'Xóa mềm phụ kiện của chủ shop đang đăng nhập',
    description: `
**Hướng dẫn sử dụng:**

- Truyền \`id\` của phụ kiện trên URL.
- Chỉ xóa mềm phụ kiện thuộc về tài khoản shop đang đăng nhập.
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
  async removeAccessoryForOwner(
    @UserId() userId: string,
    @Param('id') id: string,
  ): Promise<ItemResponse<null>> {
    await this.accessoryService.removeAccessoryForOwner(userId, id);
    return {
      message: 'Phụ kiện đã được xóa',
      statusCode: HttpStatus.NO_CONTENT,
      item: null,
    };
  }

  @Patch(':id/me')
  @UseGuards(AuthGuard)
  @Roles(UserRole.SHOP)
  @ApiOperation({
    summary: 'Khôi phục phụ kiện đã xóa mềm của chủ shop đang đăng nhập',
    description: `
**Hướng dẫn sử dụng:**

- Truyền \`id\` của phụ kiện trên URL.
- Chỉ khôi phục phụ kiện thuộc về tài khoản shop đang đăng nhập.
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
  async restoreAccessoryForOwner(
    @UserId() userId: string,
    @Param('id') id: string,
  ): Promise<ItemResponse<null>> {
    await this.accessoryService.restoreAccessoryForOwner(userId, id);
    return {
      message: 'Phụ kiện đã được khôi phục',
      statusCode: HttpStatus.NO_CONTENT,
      item: null,
    };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Lấy thông tin chi tiết phụ kiện cho khách hàng',
    description: `
**Hướng dẫn sử dụng:**

- Truyền \`id\` của phụ kiện trên URL.
- Chỉ trả về phụ kiện ở trạng thái AVAILABLE.
- Nếu không tìm thấy sẽ trả về lỗi.
`,
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            item: { $ref: getSchemaPath(ItemAccessoryDto) },
          },
        },
      ],
    },
  })
  async getAccessoryForCustomer(@Param('id') id: string): Promise<ItemResponse<ItemAccessoryDto>> {
    const accessory = await this.accessoryService.getAccessoryForCustomer(id);
    const dto = plainToInstance(ItemAccessoryDto, accessory, { excludeExtraneousValues: true });
    return {
      message: 'Đây là thông tin chi tiết của phụ kiện',
      statusCode: HttpStatus.OK,
      item: dto,
    };
  }
}
