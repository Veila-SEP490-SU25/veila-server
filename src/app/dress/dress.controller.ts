import { ItemResponse, ListResponse } from '@/common/base';
import { Dress, UserRole } from '@/common/models';
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
import { DressService } from '@/app/dress/dress.service';
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
import { CUDressDto, ItemDressDto, ListDressDto } from '@/app/dress/dress.dto';
import { AuthGuard, OptionalAuthGuard } from '@/common/guards';
import { plainToInstance } from 'class-transformer';

@Controller('dresses')
@ApiTags('Dress Controller')
@ApiBearerAuth()
@ApiExtraModels(ItemResponse, ListResponse, Dress, ListDressDto, ItemDressDto)
export class DressController {
  constructor(private readonly dressService: DressService) {}

  @Get('favorites')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Lấy danh sách váy cưới yêu thích của khách hàng',
    description: `
**Hướng dẫn sử dụng:**

- Trả về danh sách các váy cưới đang ở trạng thái AVAILABLE.
- Hỗ trợ phân trang, sắp xếp, lọc:
  - \`page\`: Số trang (bắt đầu từ 0)
  - \`size\`: Số lượng mỗi trang
  - \`sort\`: Ví dụ: name:asc
  - \`filter\`: Ví dụ: name:like:áo
- Chỉ trả về váy cưới khả dụng cho khách hàng.
- Page bắt đầu từ 0
- Sort theo format: [tên_field]:[asc/desc]
- Các trường đang có thể sort: name, sellPrice, rentalPrice, ratingAverage
- Filter theo format: [tên_field]:[eq|neq|gt|gte|lt|lte|like|nlike|in|nin]:[keyword]; hoặc [tên_field]:[isnull|isnotnull]
- Các trường đang có thể filter: name, sellPrice, rentalPrice, isSellable, isRentable, ratingAverage
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
    description: 'Lọc theo trường, ví dụ: name:like:áo',
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ListResponse) },
        {
          properties: {
            item: { $ref: getSchemaPath(ListDressDto) },
          },
        },
      ],
    },
  })
  async getFavorite(
    @UserId() userId: string,
    @PaginationParams() { page, size, limit, offset }: Pagination,
    @SortingParams(['name', 'sellPrice', 'rentalPrice', 'ratingAverage', 'createdAt', 'updatedAt'])
    sort?: Sorting[],
    @FilteringParams([
      'name',
      'sellPrice',
      'rentalPrice',
      'ratingAverage',
      'isSellable',
      'isRentable',
    ])
    filter?: Filtering[],
  ): Promise<ListResponse<ListDressDto>> {
    const [dresses, totalItems] = await this.dressService.getFavorite(
      userId,
      limit,
      offset,
      sort,
      filter,
    );
    const totalPages = Math.ceil(totalItems / size);
    const dtos = plainToInstance(ListDressDto, dresses, { excludeExtraneousValues: true });
    return {
      message: 'Đây là danh sách váy cưới yêu thích của bạn',
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

  @Post(':id/favorites')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Thêm váy cưới vào danh sách yêu thích',
    description: `
**Hướng dẫn sử dụng:**

- Truyền \`id\` của váy cưới trên URL.
- Nếu váy cưới không tồn tại hoặc không khả dụng, sẽ trả về lỗi.
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
  async addFavorite(
    @UserId() userId: string,
    @Param('id') id: string,
  ): Promise<ItemResponse<null>> {
    await this.dressService.addFavorite(userId, id);
    return {
      message: 'Đã thêm váy cưới vào danh sách yêu thích',
      statusCode: HttpStatus.OK,
      item: null,
    };
  }

  @Delete(':id/favorites')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Xóa váy cưới khỏi danh sách yêu thích',
    description: `
**Hướng dẫn sử dụng:**

- Truyền \`id\` của váy cưới trên URL.
- Nếu váy cưới không tồn tại hoặc không khả dụng, sẽ trả về lỗi.
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
  async removeFavorite(
    @UserId() userId: string,
    @Param('id') id: string,
  ): Promise<ItemResponse<null>> {
    await this.dressService.removeFavorite(userId, id);
    return {
      message: 'Đã xóa váy cưới khỏi danh sách yêu thích',
      statusCode: HttpStatus.OK,
      item: null,
    };
  }

  @Get('/me')
  @UseGuards(AuthGuard)
  @Roles(UserRole.SHOP)
  @ApiOperation({
    summary: 'Lấy danh sách váy cưới của chủ shop đang đăng nhập',
    description: `
**Hướng dẫn sử dụng:**

- Trả về danh sách váy cưới thuộc về tài khoản shop đang đăng nhập (bao gồm cả đã xóa mềm).
- Hỗ trợ phân trang, sắp xếp, lọc.
- Page bắt đầu từ 0
- Sort theo format: [tên_field]:[asc/desc]
- Các trường đang có thể sort: name, sellPrice, rentalPrice, ratingAverage
- Filter theo format: [tên_field]:[eq|neq|gt|gte|lt|lte|like|nlike|in|nin]:[keyword]; hoặc [tên_field]:[isnull|isnotnull]
- Các trường đang có thể filter: name, sellPrice, rentalPrice, isSellable, isRentable, ratingAverage, status
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
    description: 'Lọc theo trường, ví dụ: name:like:áo',
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ListResponse) },
        {
          properties: {
            item: { $ref: getSchemaPath(Dress) },
          },
        },
      ],
    },
  })
  async getDressesForOwner(
    @UserId() userId: string,
    @PaginationParams() { page, size, limit, offset }: Pagination,
    @SortingParams(['name', 'sellPrice', 'rentalPrice', 'ratingAverage', 'createdAt', 'updatedAt'])
    sort?: Sorting[],
    @FilteringParams([
      'name',
      'sellPrice',
      'rentalPrice',
      'ratingAverage',
      'isSellable',
      'isRentable',
      'status',
    ])
    filter?: Filtering[],
  ): Promise<ListResponse<Dress>> {
    const [dresses, totalItems] = await this.dressService.getDressesForOwner(
      userId,
      limit,
      offset,
      sort,
      filter,
    );
    const totalPages = Math.ceil(totalItems / size);
    return {
      message: 'Đây là danh sách các váy cưới của bạn',
      statusCode: HttpStatus.OK,
      pageIndex: page,
      pageSize: size,
      totalItems,
      totalPages,
      hasNextPage: page + 1 < totalPages,
      hasPrevPage: 0 > page,
      items: dresses,
    };
  }

  @Get(':id/me')
  @UseGuards(AuthGuard)
  @Roles(UserRole.SHOP)
  @ApiOperation({
    summary: 'Lấy chi tiết váy cưới của chủ shop đang đăng nhập',
    description: `
**Hướng dẫn sử dụng:**

- Truyền \`id\` của váy cưới trên URL.
- Chỉ trả về váy cưới thuộc về tài khoản shop đang đăng nhập (bao gồm cả đã xóa mềm).
- Nếu không tìm thấy sẽ trả về lỗi.
`,
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            item: { $ref: getSchemaPath(Dress) },
          },
        },
      ],
    },
  })
  async getDressForOwner(
    @UserId() userId: string,
    @Param('id') id: string,
  ): Promise<ItemResponse<Dress>> {
    const dress = await this.dressService.findDressForOwner(userId, id);
    return {
      message: 'Đây là thông tin chi tiết của váy cưới',
      statusCode: HttpStatus.OK,
      item: dress,
    };
  }

  @Post('/me')
  @UseGuards(AuthGuard)
  @Roles(UserRole.SHOP)
  @ApiOperation({
    summary: 'Tạo mới váy cưới cho chủ shop đang đăng nhập',
    description: `
**Hướng dẫn sử dụng:**

- Gửi thông tin váy cưới cần tạo ở phần Body dưới dạng JSON.
- Váy cưới sẽ gắn với tài khoản shop đang đăng nhập.
- Các trường bắt buộc: \`name\`, \`sellPrice\`, \`status\`, ...
- Trả về thông tin váy cưới vừa tạo.
- DressStatus: AVAILABLE, UNAVAILABLE, OUT_OF_STOCK
`,
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            item: { $ref: getSchemaPath(Dress) },
          },
        },
      ],
    },
  })
  async createDressForOwner(
    @UserId() userId: string,
    @Body() newDress: CUDressDto,
  ): Promise<ItemResponse<Dress>> {
    const dress = await this.dressService.createDressForOwner(userId, newDress);
    return {
      message: 'Tạo thành công váy cưới mới',
      statusCode: HttpStatus.CREATED,
      item: dress,
    };
  }

  @Put(':id/me')
  @UseGuards(AuthGuard)
  @Roles(UserRole.SHOP)
  @ApiOperation({
    summary: 'Cập nhật váy cưới của chủ shop đang đăng nhập',
    description: `
**Hướng dẫn sử dụng:**

- Truyền \`id\` của váy cưới trên URL.
- Gửi thông tin cập nhật ở phần Body.
- Chỉ cập nhật váy cưới thuộc về tài khoản shop đang đăng nhập.
- Nếu không tìm thấy sẽ trả về lỗi.
- DressStatus: AVAILABLE, UNAVAILABLE, OUT_OF_STOCK
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
  async updateDressForOwner(
    @UserId() userId: string,
    @Param('id') id: string,
    @Body() body: CUDressDto,
  ): Promise<ItemResponse<null>> {
    await this.dressService.updateDressForOwner(userId, id, body);
    return {
      message: 'Váy cưới đã được cập nhật',
      statusCode: HttpStatus.NO_CONTENT,
      item: null,
    };
  }

  @Delete(':id/me')
  @UseGuards(AuthGuard)
  @Roles(UserRole.SHOP)
  @ApiOperation({
    summary: 'Xóa mềm váy cưới của chủ shop đang đăng nhập',
    description: `
**Hướng dẫn sử dụng:**

- Truyền \`id\` của váy cưới trên URL.
- Chỉ xóa mềm váy cưới thuộc về tài khoản shop đang đăng nhập.
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
  async removeDressForOwner(
    @UserId() userId: string,
    @Param('id') id: string,
  ): Promise<ItemResponse<null>> {
    await this.dressService.removeDressForOwner(userId, id);
    return {
      message: 'Váy cưới đã được xóa',
      statusCode: HttpStatus.NO_CONTENT,
      item: null,
    };
  }

  @Patch(':id/me')
  @UseGuards(AuthGuard)
  @Roles(UserRole.SHOP)
  @ApiOperation({
    summary: 'Khôi phục váy cưới đã xóa mềm của chủ shop đang đăng nhập',
    description: `
**Hướng dẫn sử dụng:**

- Truyền \`id\` của váy cưới trên URL.
- Chỉ khôi phục váy cưới thuộc về tài khoản shop đang đăng nhập.
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
  async restoreDressForOwner(@UserId() userId: string, @Param('id') id: string) {
    await this.dressService.restoreDressForOwner(userId, id);
    return {
      message: 'Váy cưới đã được khôi phục',
      statusCode: HttpStatus.NO_CONTENT,
      item: null,
    };
  }

  @Get()
  @ApiOperation({
    summary: 'Lấy danh sách váy cưới khả dụng cho khách hàng',
    description: `
**Hướng dẫn sử dụng:**

- Trả về danh sách các váy cưới đang ở trạng thái AVAILABLE.
- Hỗ trợ phân trang, sắp xếp, lọc:
  - \`page\`: Số trang (bắt đầu từ 0)
  - \`size\`: Số lượng mỗi trang
  - \`sort\`: Ví dụ: name:asc
  - \`filter\`: Ví dụ: name:like:áo
- Chỉ trả về váy cưới khả dụng cho khách hàng.
- Page bắt đầu từ 0
- Sort theo format: [tên_field]:[asc/desc]
- Các trường đang có thể sort: name, sellPrice, rentalPrice, ratingAverage
- Filter theo format: [tên_field]:[eq|neq|gt|gte|lt|lte|like|nlike|in|nin]:[keyword]; hoặc [tên_field]:[isnull|isnotnull]
- Các trường đang có thể filter: name, sellPrice, rentalPrice, isSellable, isRentable, ratingAverage
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
    description: 'Lọc theo trường, ví dụ: name:like:áo',
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ListResponse) },
        {
          properties: {
            item: { $ref: getSchemaPath(ListDressDto) },
          },
        },
      ],
    },
  })
  async getDressesForCustomer(
    @PaginationParams() { page, size, limit, offset }: Pagination,
    @SortingParams(['name', 'sellPrice', 'rentalPrice', 'ratingAverage', 'createdAt', 'updatedAt'])
    sort?: Sorting[],
    @FilteringParams([
      'name',
      'sellPrice',
      'rentalPrice',
      'ratingAverage',
      'isSellable',
      'isRentable',
    ])
    filter?: Filtering[],
  ): Promise<ListResponse<ListDressDto>> {
    const [dresses, totalItems] = await this.dressService.getDressesForCustomer(
      limit,
      offset,
      sort,
      filter,
    );
    const totalPages = Math.ceil(totalItems / size);
    const dtos = plainToInstance(ListDressDto, dresses, { excludeExtraneousValues: true });
    return {
      message: 'Đây là danh sách váy cưới khả dụng của cửa hàng',
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
  @UseGuards(OptionalAuthGuard)
  @ApiOperation({
    summary: 'Lấy thông tin chi tiết váy cưới cho khách hàng',
    description: `
**Hướng dẫn sử dụng:**

- Truyền \`id\` của váy cưới trên URL.
- Chỉ trả về váy cưới ở trạng thái AVAILABLE.
- Nếu không tìm thấy sẽ trả về lỗi.
`,
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            item: { $ref: getSchemaPath(ItemDressDto) },
          },
        },
      ],
    },
  })
  async getDressForCustomer(
    @UserId() userId: string,
    @Param('id') id: string,
  ): Promise<ItemResponse<ItemDressDto>> {
    const dress = await this.dressService.getDressForCustomer(userId, id);
    return {
      message: 'Đây là thông tin chi tiết của Váy cưới',
      statusCode: HttpStatus.OK,
      item: dress,
    };
  }
}
