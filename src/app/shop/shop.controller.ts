import { ItemResponse, ListResponse } from '@/common/base';
import { Shop, UserRole } from '@/common/models';
import { Controller, Get, HttpStatus, Param, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { ShopService } from '@/app/shop/shop.service';
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
import { ItemShopDto, ListShopDto } from '@/app/shop/shop.dto';
import { ListDressDto } from '@/app/dress';
import { ListServiceDto } from '@/app/service';
import { ListBlogDto } from '@/app/blog';
import { ListCategoryDto } from '@/app/category';
import { ListAccessoryDto } from '@/app/accessory';
import { plainToInstance } from 'class-transformer';

@Controller('shops')
@ApiTags('Shop Controller')
@ApiBearerAuth()
@ApiExtraModels(
  ItemResponse,
  ListResponse,
  Shop,
  ItemShopDto,
  ListShopDto,
  ListDressDto,
  ListServiceDto,
  ListBlogDto,
  ListCategoryDto,
  ListAccessoryDto,
)
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Get()
  @ApiOperation({
    summary: 'Lấy danh sách shop khả dụng cho khách hàng',
    description: `
**Hướng dẫn sử dụng:**
- Trả về danh sách các shop đang hoạt động (ACTIVE).
- Hỗ trợ phân trang, sắp xếp, lọc:
  - \`page\`: Số trang (bắt đầu từ 0)
  - \`size\`: Số lượng mỗi trang
  - \`sort\`: Ví dụ: name:asc
  - \`filter\`: Ví dụ: name:like:veila
- Chỉ trả về các shop có trạng thái ACTIVE.
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
    description: 'Lọc theo trường, ví dụ: name:like:veila',
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ListResponse) },
        {
          properties: {
            item: { $ref: getSchemaPath(ListShopDto) },
          },
        },
      ],
    },
  })
  async getShopsForCustomer(
    @PaginationParams() pagination: Pagination,
    @SortingParams([]) sort?: Sorting,
    @FilteringParams([]) filter?: Filtering,
  ): Promise<ListResponse<ListShopDto>> {
    return await this.shopService.getShopsForCustomer(pagination, sort, filter);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Lấy thông tin chi tiết shop cho khách hàng',
    description: `
**Hướng dẫn sử dụng:**
- Truyền \`id\` của shop trên URL.
- Trả về thông tin chi tiết của shop nếu shop đang hoạt động (ACTIVE).
- Nếu không tìm thấy sẽ trả về lỗi.
`,
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            item: { $ref: getSchemaPath(ItemShopDto) },
          },
        },
      ],
    },
  })
  async getShopForCustomer(@Param('id') id: string): Promise<ItemResponse<ItemShopDto>> {
    const shop = await this.shopService.getShopForCustomer(id);
    return {
      message: 'Đây là thông tin chi tiết của shop',
      statusCode: HttpStatus.OK,
      item: shop,
    };
  }

  @Get(':id/accessories')
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
            item: { $ref: getSchemaPath(ListAccessoryDto) },
          },
        },
      ],
    },
  })
  async getAccessoriesForCustomer(
    @Param('id') id: string,
    @PaginationParams() { page, size, limit, offset }: Pagination,
    @SortingParams(['name', 'sellPrice', 'rentalPrice']) sort?: Sorting,
    @FilteringParams(['name', 'sellPrice', 'rentalPrice', 'isSellable', 'isRentable', 'status'])
    filter?: Filtering,
  ): Promise<ListResponse<ListAccessoryDto>> {
    const [accessories, totalItems] = await this.shopService.getAccessoriesForCustomer(
      id,
      limit,
      offset,
      sort,
      filter,
    );
    const dto = plainToInstance(ListAccessoryDto, accessories, { excludeExtraneousValues: true });
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
      items: dto,
    };
  }

  @Get(':id/dresses')
  @ApiOperation({
    summary: 'Lấy danh sách váy cưới của shop cho khách hàng',
    description: `
**Hướng dẫn sử dụng:**
- Truyền \`id\` của shop trên URL.
- Trả về danh sách váy cưới khả dụng của shop (trạng thái AVAILABLE).
- Hỗ trợ phân trang, sắp xếp, lọc.
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
            item: { $ref: getSchemaPath(ListDressDto) },
          },
        },
      ],
    },
  })
  async getDressesForCustomer(
    @Param('id') id: string,
    @PaginationParams() pagination: Pagination,
    @SortingParams([]) sort?: Sorting,
    @FilteringParams([]) filter?: Filtering,
  ): Promise<ListResponse<ListDressDto>> {
    return await this.shopService.getDressesForCustomer(id, pagination, sort, filter);
  }

  @Get(':id/services')
  @ApiOperation({
    summary: 'Lấy danh sách dịch vụ của shop cho khách hàng',
    description: `
**Hướng dẫn sử dụng:**
- Truyền \`id\` của shop trên URL.
- Trả về danh sách dịch vụ khả dụng của shop (trạng thái ACTIVE).
- Hỗ trợ phân trang, sắp xếp, lọc.
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
    @Param('id') id: string,
    @PaginationParams() pagination: Pagination,
    @SortingParams([]) sort?: Sorting,
    @FilteringParams([]) filter?: Filtering,
  ): Promise<ListResponse<ListServiceDto>> {
    return await this.shopService.getServicesForCustomer(id, pagination, sort, filter);
  }

  @Get(':id/blogs')
  @ApiOperation({
    summary: 'Lấy danh sách blog của shop cho khách hàng',
    description: `
**Hướng dẫn sử dụng:**
- Truyền \`id\` của shop trên URL.
- Trả về danh sách blog đã xuất bản (PUBLISHED) của shop.
- Hỗ trợ phân trang, sắp xếp, lọc.
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
            item: { $ref: getSchemaPath(ListBlogDto) },
          },
        },
      ],
    },
  })
  async getBlogsForCustomer(
    @Param('id') id: string,
    @PaginationParams() pagination: Pagination,
    @SortingParams([]) sort?: Sorting,
    @FilteringParams([]) filter?: Filtering,
  ): Promise<ListResponse<ListBlogDto>> {
    return await this.shopService.getBlogsForCustomer(id, pagination, sort, filter);
  }

  @Get(':id/categories')
  @ApiOperation({
    summary: 'Lấy danh sách danh mục của shop cho khách hàng',
    description: `
**Hướng dẫn sử dụng:**
- Truyền \`id\` của shop trên URL.
- Trả về danh sách danh mục của shop.
- Hỗ trợ phân trang, sắp xếp, lọc.
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
            item: { $ref: getSchemaPath(ListCategoryDto) },
          },
        },
      ],
    },
  })
  async getCategoriesForCustomer(
    @Param('id') id: string,
    @PaginationParams() pagination: Pagination,
    @SortingParams([]) sort?: Sorting,
    @FilteringParams([]) filter?: Filtering,
  ): Promise<ListResponse<ListCategoryDto>> {
    return await this.shopService.getCategoriesForCustomer(id, pagination, sort, filter);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  @Roles(UserRole.SHOP)
  @ApiOperation({
    summary: 'Lấy danh sách shop của chủ shop đang đăng nhập',
    description: `
**Hướng dẫn sử dụng:**
- Trả về danh sách shop thuộc về tài khoản đang đăng nhập.
- Hỗ trợ phân trang, sắp xếp, lọc.
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
            item: { $ref: getSchemaPath(Shop) },
          },
        },
      ],
    },
  })
  async getShopsForOwner(
    @UserId() userId: string,
    @PaginationParams() pagination: Pagination,
    @SortingParams([]) sort?: Sorting,
    @FilteringParams([]) filter?: Filtering,
  ): Promise<ListResponse<Shop>> {
    return await this.shopService.getShopsForOwner(userId, pagination, sort, filter);
  }

  @Get(':id/me')
  @UseGuards(AuthGuard)
  @Roles(UserRole.SHOP)
  @ApiOperation({
    summary: 'Lấy thông tin chi tiết shop của chủ shop đang đăng nhập',
    description: `
**Hướng dẫn sử dụng:**
- Truyền \`id\` của shop trên URL.
- Chỉ trả về shop thuộc về tài khoản đang đăng nhập.
- Nếu không tìm thấy sẽ trả về lỗi.
`,
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            item: { $ref: getSchemaPath(ItemShopDto) },
          },
        },
      ],
    },
  })
  async getShopForOwner(
    @UserId() userId: string,
    @Param('id') id: string,
  ): Promise<ItemResponse<ItemShopDto>> {
    const shop = await this.shopService.getShopForOwner(userId, id);
    return {
      message: 'Đây là thông tin chi tiết của shop',
      statusCode: HttpStatus.OK,
      item: shop,
    };
  }
}
