import { ItemResponse, ListResponse } from '@/common/base';
import { Shop, ShopStatus, UserRole } from '@/common/models';
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
import { ShopService } from '@/app/shop/shop.service';
import { AuthGuard, OptionalAuthGuard } from '@/common/guards';
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
import {
  ItemShopDto,
  ListBlogOfShopDto,
  ListShopDto,
  RegisterShopDto,
  ResubmitShopDto,
  ReviewShopDto,
  ShopContactDto,
  UpdateShopDto,
} from '@/app/shop/shop.dto';
import { ListDressDto } from '@/app/dress';
import { ListServiceDto } from '@/app/service';
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
  ListCategoryDto,
  ListAccessoryDto,
  ShopContactDto,
  ListBlogOfShopDto,
)
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Get('favorites')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Lấy danh sách shop yêu thích',
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
- Các trường đang có thể sort: name, status, isVerified
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
            item: { $ref: getSchemaPath(ListShopDto) },
          },
        },
      ],
    },
  })
  async getFavorite(
    @UserId() userId: string,
    @PaginationParams() { page, size, limit, offset }: Pagination,
    @SortingParams(['name', 'status', 'isVerified', 'createdAt', 'updatedAt']) sort?: Sorting[],
    @FilteringParams(['name', 'status', 'isVerified']) filter?: Filtering[],
  ): Promise<ListResponse<ListShopDto>> {
    const [shops, totalItems] = await this.shopService.getFavorite(
      userId,
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

  @Post(':id/favorites')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Thêm shop vào danh sách yêu thích',
    description: `
**Hướng dẫn sử dụng:**

- Truyền \`id\` của shop trên URL.
- Nếu shop không tồn tại hoặc không khả dụng, sẽ trả về lỗi.
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
    await this.shopService.addFavorite(userId, id);
    return {
      message: 'Đã thêm shop vào danh sách yêu thích',
      statusCode: HttpStatus.OK,
      item: null,
    };
  }

  @Delete(':id/favorites')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Xóa shop khỏi danh sách yêu thích',
    description: `
**Hướng dẫn sử dụng:**

- Truyền \`id\` của shop trên URL.
- Nếu shop không tồn tại hoặc không khả dụng, sẽ trả về lỗi.
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
    await this.shopService.removeFavorite(userId, id);
    return {
      message: 'Đã xóa shop khỏi danh sách yêu thích',
      statusCode: HttpStatus.OK,
      item: null,
    };
  }

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

  @Patch('me')
  @UseGuards(AuthGuard)
  @Roles(UserRole.SHOP)
  @ApiOperation({
    summary: 'Cập nhật thông tin profile shop',
    description: `**Hướng dẫn sử dụng:**
    - Truyền thông tin shop trong body.
    - Chỉ dành cho người dùng có vai trò SHOP.
    - Nếu cập nhật thành công, sẽ trả về thông báo và mã trạng thái OK (200).
    - Nếu có lỗi, sẽ trả về mã trạng thái BAD_REQUEST (400) hoặc NOT_FOUND (404).
    - Cần đảm bảo các trường bắt buộc được cung cấp.`,
  })
  @ApiOkResponse({
    description: 'Cập nhật thông tin shop thành công',
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
  async updateShopProfile(
    @UserId() userId: string,
    @Body() body: UpdateShopDto,
  ): Promise<ItemResponse<null>> {
    await this.shopService.updateShopProfile(userId, body);
    return {
      message: 'Cập nhật thông tin shop thành công',
      statusCode: HttpStatus.OK,
      item: null,
    };
  }

  @Get('me')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Lấy thông tin chi tiết shop của chủ shop đang đăng nhập',
    description: `
**Hướng dẫn sử dụng:**
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

  @Get(':id/contact-information')
  @UseGuards(AuthGuard)
  @Roles(UserRole.SHOP)
  @ApiOperation({
    summary: 'Lấy thông tin liên lạc, địa chỉ của cửa hàng',
    description: `
      **Hướng dẫn sử dụng:**

      - Trả về địa chỉ, email, số điện thoại của cửa hàng.
    `,
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            items: { $ref: getSchemaPath(ShopContactDto) },
          },
        },
      ],
    },
  })
  async getContactInformation(@UserId() userId: string): Promise<ItemResponse<ShopContactDto>> {
    const shopContactInformation = await this.shopService.getContactInformation(userId);

    return {
      message: 'Đây là thông tin liên lạc của cửa hàng',
      statusCode: HttpStatus.OK,
      item: shopContactInformation,
    };
  }

  @Patch(':id/review')
  @UseGuards(AuthGuard)
  @Roles(UserRole.STAFF, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary: 'Xử lý yêu cầu đăng ký shop của khách hàng',
    description: `**Hướng dẫn sử dụng:**
    - Truyền \`id\` của shop trên URL.
    - Truyền thông tin xử lý trong body.
    - Nếu duyệt thành công, sẽ trả về thông báo và mã trạng thái OK (200).
    - Nếu có lỗi, sẽ trả về mã trạng thái BAD_REQUEST (400) hoặc NOT_FOUND (404).
    - Nếu từ chối, cần cung cấp lý do từ chối trong body.`,
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
  async reviewShopRegister(
    @Param('id') id: string,
    @Body() body: ReviewShopDto,
  ): Promise<ItemResponse<null>> {
    await this.shopService.reviewShopRegister(id, body);
    return {
      message: 'Đã xử lý yêu cầu đăng ký shop',
      statusCode: HttpStatus.OK,
      item: null,
    };
  }

  @Get()
  @UseGuards(OptionalAuthGuard)
  @ApiOperation({
    summary: 'Lấy danh sách shop',
    description: `
**Hướng dẫn sử dụng:**
- Trả về danh sách các shop đang hoạt động (ACTIVE).
- Hỗ trợ phân trang, sắp xếp, lọc:
  - \`page\`: Số trang (bắt đầu từ 0)
  - \`size\`: Số lượng mỗi trang
  - \`sort\`: Ví dụ: name:asc,createdAt:desc (có thể sort nhiều field)
  - \`filter\`: Ví dụ: name:like:veila,status:eq:ACTIVE (có thể filter nhiều field)
- Chỉ trả về các shop có trạng thái ACTIVE.
- Page bắt đầu từ 0
- Sort theo format: [tên_field]:[asc/desc] (có thể phân cách bằng dấu phẩy cho nhiều field)
- Các trường đang có thể sort: name, status, isVerified, createdAt, updatedAt
- Filter theo format: [tên_field]:[eq|neq|gt|gte|lt|lte|like|nlike|in|nin]:[keyword]; hoặc [tên_field]:[isnull|isnotnull] (có thể phân cách bằng dấu phẩy cho nhiều field)
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
            item: { $ref: getSchemaPath(ListShopDto) },
          },
        },
      ],
    },
  })
  async getShops(
    @CurrentRole() currentRole: UserRole,
    @PaginationParams() { page, size, limit, offset }: Pagination,
    @SortingParams(['name', 'status', 'isVerified', 'createdAt', 'updatedAt']) sort?: Sorting[],
    @FilteringParams(['name', 'status', 'isVerified']) filter?: Filtering[],
  ): Promise<ListResponse<ListShopDto>> {
    const [shops, totalItems] = await this.shopService.getShops(
      currentRole,
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
  @UseGuards(OptionalAuthGuard)
  @ApiOperation({
    summary: 'Lấy thông tin chi tiết shop',
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
  async getShop(
    @UserId() userId: string,
    @CurrentRole() currentRole: UserRole,
    @Param('id') id: string,
  ): Promise<ItemResponse<ItemShopDto>> {
    const shop = await this.shopService.getShop(userId, currentRole, id);
    return {
      message: 'Đây là thông tin chi tiết của shop',
      statusCode: HttpStatus.OK,
      item: shop,
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
    @SortingParams(['name', 'sellPrice', 'rentalPrice', 'createdAt', 'updatedAt']) sort?: Sorting[],
    @FilteringParams(['name', 'sellPrice', 'rentalPrice', 'isSellable', 'isRentable'])
    filter?: Filtering[],
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
    @SortingParams(['name', 'sellPrice', 'rentalPrice', 'ratingAverage', 'createdAt', 'updatedAt'])
    sort?: Sorting[],
    @FilteringParams([
      'name',
      'sellPrice',
      'rentalPrice',
      'isSellable',
      'isRentable',
      'ratingAverage',
    ])
    filter?: Filtering[],
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
    @SortingParams(['name', 'ratingAverage', 'createdAt', 'updatedAt']) sort?: Sorting[],
    @FilteringParams(['name', 'ratingAverage']) filter?: Filtering[],
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
            item: { $ref: getSchemaPath(ListBlogOfShopDto) },
          },
        },
      ],
    },
  })
  async getBlogsForCustomer(
    @Param('id') id: string,
    @PaginationParams() { page, size, limit, offset }: Pagination,
    @SortingParams(['title', 'createdAt', 'updatedAt']) sort?: Sorting[],
    @FilteringParams(['title']) filter?: Filtering[],
  ): Promise<ListResponse<ListBlogOfShopDto>> {
    const [blogs, totalItems] = await this.shopService.getBlogsForCustomer(
      id,
      limit,
      offset,
      sort,
      filter,
    );
    const totalPages = Math.ceil(totalItems / size);
    const dtos = plainToInstance(ListBlogOfShopDto, blogs, { excludeExtraneousValues: true });
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
    @SortingParams(['name', 'createdAt', 'updatedAt']) sort?: Sorting[],
    @FilteringParams(['name']) filter?: Filtering[],
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

  @Put(':id/:status')
  @UseGuards(AuthGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: 'Cập nhật trạng thái shop' })
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
  async updateShopStatus(
    @Param('id') id: string,
    @Param('status') status: ShopStatus,
  ): Promise<ItemResponse<null>> {
    await this.shopService.updateShopStatus(id, status);
    return {
      message: 'Cập nhật trạng thái shop thành công',
      statusCode: HttpStatus.OK,
      item: null,
    };
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @Roles(UserRole.STAFF, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Cập nhật thông tin shop cho nhân viên' })
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
  async staffUpdateShopProfile(@Param('id') id: string, @Body() body: UpdateShopDto) {
    await this.shopService.staffUpdateShopProfile(id, body);
    return {
      message: 'Cập nhật thông tin shop thành công',
      statusCode: HttpStatus.OK,
      item: null,
    };
  }
}
