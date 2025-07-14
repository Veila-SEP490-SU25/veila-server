import { ItemResponse, ListResponse } from '@/common/base';
import { Shop, UserRole } from '@/common/models';
import { Body, Controller, Get, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common';
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
import {
  ItemShopDto,
  ListShopDto,
  ListShopForStaffDto,
  RegisterShopDto,
  ResubmitShopDto,
} from '@/app/shop/shop.dto';
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

  @Post('me')
  @UseGuards(AuthGuard)
  @Roles(UserRole.CUSTOMER)
  @ApiOperation({
    summary: 'Đăng ký mở shop',
    description: `**Hướng dẫn sử dụng:**
    - Truyền thông tin shop trong body.
    - Chỉ dành cho người dùng có vai trò CUSTOMER.
    - Nếu đăng ký thành công, sẽ trả về thông báo và mã trạng thái CREATED (201).
    - Nếu có lỗi, sẽ trả về mã trạng thái BAD_REQUEST (400) hoặc CONFLICT (409).
    - Sau khi đăng ký, shop sẽ được xét duyệt bởi admin.`,
  })
  @ApiOkResponse({
    description: 'Đăng ký shop mới',
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
  async registerShop(
    @UserId() userId: string,
    @Body() body: RegisterShopDto,
  ): Promise<ItemResponse<null>> {
    await this.shopService.registerShop(userId, body);
    return {
      message: 'Đơn đăng ký đã được gửi đi thành công, vui lòng chờ xét duyệt',
      statusCode: HttpStatus.CREATED,
      item: null,
    };
  }

  @Put('me')
  @UseGuards(AuthGuard)
  @Roles(UserRole.CUSTOMER)
  @ApiOperation({
    summary: 'Gửi lại đơn đăng ký shop',
    description: `**Hướng dẫn sử dụng:**
    - Truyền thông tin shop trong body.
    - Chỉ dành cho người dùng có vai trò CUSTOMER.
    - Nếu gửi lại thành công, sẽ trả về thông báo và mã trạng thái ACCEPTED (202).
    - Nếu có lỗi, sẽ trả về mã trạng thái BAD_REQUEST (400) hoặc CONFLICT (409).
    - Sau khi gửi lại, shop sẽ được xét duyệt bởi admin.`,
  })
  @ApiOkResponse({
    description: 'Đăng ký shop mới',
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
  async resubmitShop(
    @UserId() userId: string,
    @Body() body: ResubmitShopDto,
  ): Promise<ItemResponse<null>> {
    await this.shopService.resubmitShop(userId, body);
    return {
      message: 'Đơn đăng ký đã được gửi đi thành công, vui lòng chờ xét duyệt',
      statusCode: HttpStatus.ACCEPTED,
      item: null,
    };
  }

  @Get('me')
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
            item: { $ref: getSchemaPath(Shop) },
          },
        },
      ],
    },
  })
  async getShopForOwner(@UserId() userId: string): Promise<ItemResponse<Shop>> {
    const shop = await this.shopService.getShopForOwner(userId);
    return {
      message: 'Đây là thông tin chi tiết của shop',
      statusCode: HttpStatus.OK,
      item: shop,
    };
  }

  @Get('staff')
  @UseGuards(AuthGuard)
  @Roles(UserRole.STAFF, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary: 'Lấy danh sách shop cho nhân viên',
    description: `**Hướng dẫn sử dụng:**
    - Trả về danh sách các shop.
    - Hỗ trợ phân trang, sắp xếp, lọc:
      - \`page\`: Số trang (bắt đầu từ 0)
      - \`size\`: Số lượng mỗi trang
      - \`sort\`: Ví dụ: name:asc
      - \`filter\`: Ví dụ: name:like:veila
    - Chỉ trả về các shop có trạng thái ACTIVE.
    - Page bắt đầu từ 0
    - Sort theo format: [tên_field]:[asc/desc]
    - Các trường đang có thể sort: name
    - Filter theo format: [tên_field]:[eq|neq|gt|gte|lt|lte|like|nlike|in|nin]:[keyword]; hoặc [tên_field]:[isnull|isnotnull]
    - Các trường đang có thể filter: name, status, isVerified
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
            item: { $ref: getSchemaPath(ListShopForStaffDto) },
          },
        },
      ],
    },
  })
  async getShopsForStaff(
    @PaginationParams() { page, size, limit, offset }: Pagination,
    @SortingParams(['name']) sort?: Sorting,
    @FilteringParams(['name', 'status', 'isVerified']) filter?: Filtering,
  ): Promise<ListResponse<ListShopForStaffDto>> {
    const [shops, totalItems] = await this.shopService.getShopsForStaff(
      limit,
      offset,
      sort,
      filter,
    );
    const totalPages = Math.ceil(totalItems / size);
    const dtos = plainToInstance(ListShopForStaffDto, shops, { excludeExtraneousValues: true });
    return {
      message: 'Đây là danh sách các shop',
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
- Page bắt đầu từ 0
- Sort theo format: [tên_field]:[asc/desc]
- Các trường đang có thể sort: name
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
    @PaginationParams() { page, size, limit, offset }: Pagination,
    @SortingParams(['name']) sort?: Sorting,
    @FilteringParams(['name']) filter?: Filtering,
  ): Promise<ListResponse<ListShopDto>> {
    const [shops, totalItems] = await this.shopService.getShopsForCustomer(
      limit,
      offset,
      sort,
      filter,
    );
    const totalPages = Math.ceil(totalItems / size);
    const dtos = plainToInstance(ListShopDto, shops, { excludeExtraneousValues: true });
    return {
      message: 'Đây là danh sách các shop khả dụng',
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
    const dto = plainToInstance(ItemShopDto, shop, { excludeExtraneousValues: true });
    return {
      message: 'Đây là thông tin chi tiết của shop',
      statusCode: HttpStatus.OK,
      item: dto,
    };
  }

  @Get(':id/accessories')
  @ApiOperation({
    summary: 'Lấy danh sách phụ kiện cho khách hàng',
    description: `
**Hướng dẫn sử dụng:**

- **Phân trang:**
  - \`page\`: Số trang (bắt đầu từ 0)
  - \`size\`: Số lượng bản ghi mỗi trang

- **Sắp xếp:**
  - \`sort\`: Định dạng \`[tên_field]:[asc|desc]\`
  - Ví dụ: \`sort=title:asc\`

- **Lọc dữ liệu:**
  - \`filter\`: Định dạng \`[tên_field]:[rule]:[giá trị]\`
  - Ví dụ: \`filter=title:like:veila\`

- Sort theo format: [tên_field]:[asc/desc]
- Các trường đang có thể sort: name, sellPrice, rentalPrice
- Filter theo format: [tên_field]:[eq|neq|gt|gte|lt|lte|like|nlike|in|nin]:[keyword]; hoặc [tên_field]:[isnull|isnotnull]
- Các trường đang có thể filter: name, sellPrice, rentalPrice, isSellable, isRentable
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
    @FilteringParams(['name', 'sellPrice', 'rentalPrice', 'isSellable', 'isRentable'])
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
    @PaginationParams() { page, size, limit, offset }: Pagination,
    @SortingParams(['name', 'sellPrice', 'rentalPrice', 'ratingAverage']) sort?: Sorting,
    @FilteringParams([
      'name',
      'sellPrice',
      'rentalPrice',
      'isSellable',
      'isRentable',
      'ratingAverage',
    ])
    filter?: Filtering,
  ): Promise<ListResponse<ListDressDto>> {
    const [dresses, totalItems] = await this.shopService.getDressesForCustomer(
      id,
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

  @Get(':id/services')
  @ApiOperation({
    summary: 'Lấy danh sách dịch vụ của shop cho khách hàng',
    description: `
**Hướng dẫn sử dụng:**
- Truyền \`id\` của shop trên URL.
- Trả về danh sách dịch vụ khả dụng của shop (trạng thái ACTIVE).
- Hỗ trợ phân trang, sắp xếp, lọc.
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
    @Param('id') id: string,
    @PaginationParams() { page, size, limit, offset }: Pagination,
    @SortingParams(['name', 'ratingAverage']) sort?: Sorting,
    @FilteringParams(['name', 'ratingAverage']) filter?: Filtering,
  ): Promise<ListResponse<ListServiceDto>> {
    const [services, totalItems] = await this.shopService.getServicesForCustomer(
      id,
      limit,
      offset,
      sort,
      filter,
    );
    const totalPages = Math.ceil(totalItems / size);
    const dtos = plainToInstance(ListServiceDto, services, { excludeExtraneousValues: true });
    return {
      message: 'Đây là danh sách dịch vụ khả dụng của cửa hàng',
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

  @Get(':id/blogs')
  @ApiOperation({
    summary: 'Lấy danh sách blog của shop cho khách hàng',
    description: `
**Hướng dẫn sử dụng:**
- Truyền \`id\` của shop trên URL.
- Trả về danh sách blog đã xuất bản (PUBLISHED) của shop.
- Hỗ trợ phân trang, sắp xếp, lọc.
- Page bắt đầu từ 0
- Sort theo format: [tên_field]:[asc/desc]
- Các trường đang có thể sort: title
- Filter theo format: [tên_field]:[eq|neq|gt|gte|lt|lte|like|nlike|in|nin]:[keyword]; hoặc [tên_field]:[isnull|isnotnull]
- Các trường đang có thể filter: title
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
    @PaginationParams() { page, size, limit, offset }: Pagination,
    @SortingParams(['title']) sort?: Sorting,
    @FilteringParams(['title']) filter?: Filtering,
  ): Promise<ListResponse<ListBlogDto>> {
    const [blogs, totalItems] = await this.shopService.getBlogsForCustomer(
      id,
      limit,
      offset,
      sort,
      filter,
    );
    const totalPages = Math.ceil(totalItems / size);
    const dtos = plainToInstance(ListBlogDto, blogs, { excludeExtraneousValues: true });
    return {
      message: 'Đây là danh sách các bài blog khả dụng',
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

  @Get(':id/categories')
  @ApiOperation({
    summary: 'Lấy danh sách danh mục của shop cho khách hàng',
    description: `
**Hướng dẫn sử dụng:**
- Truyền \`id\` của shop trên URL.
- Trả về danh sách danh mục của shop.
- Hỗ trợ phân trang, sắp xếp, lọc.
- Page bắt đầu từ 0
- Sort theo format: [tên_field]:[asc/desc]
- Các trường đang có thể sort: name
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
    @PaginationParams() { page, size, limit, offset }: Pagination,
    @SortingParams(['name']) sort?: Sorting,
    @FilteringParams(['name']) filter?: Filtering,
  ): Promise<ListResponse<ListCategoryDto>> {
    const [categories, totalItems] = await this.shopService.getCategoriesForCustomer(
      id,
      limit,
      offset,
      sort,
      filter,
    );
    const totalPages = Math.ceil(totalItems / size);
    const dtos = plainToInstance(ListCategoryDto, categories, { excludeExtraneousValues: true });
    return {
      message: 'Đây là danh sách mục phân loại category khả dụng của cửa hàng',
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
}
