import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { CategoryService } from '@/app/category/category.service';
import { CUCategoryDto, ItemCategoryDto, ListBlogOfCategoryDto } from '@/app/category/category.dto';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { ItemResponse, ListResponse } from '@/common/base';
import { Category, UserRole } from '@/common/models';
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
import { ListDressDto } from '@/app/dress';
import { ListServiceDto } from '@/app/service';
import { ListAccessoryDto } from '@/app/accessory';
import { plainToInstance } from 'class-transformer';

@Controller('categories')
@ApiTags('Category Controller')
@ApiBearerAuth()
@ApiExtraModels(
  ItemResponse,
  ListResponse,
  Category,
  ItemCategoryDto,
  ListDressDto,
  ListServiceDto,
  ListBlogOfCategoryDto,
  ListAccessoryDto,
)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('me')
  @UseGuards(AuthGuard)
  @Roles(UserRole.SHOP)
  @ApiOperation({
    summary: 'Tạo mới danh mục sản phẩm',
    description: `
**Hướng dẫn sử dụng:**

- Gửi thông tin danh mục cần tạo ở phần Body dưới dạng JSON.
- Danh mục sẽ gắn với tài khoản đang đăng nhập (lấy từ token).
- Các trường bắt buộc: \`name\`, \`type\`
- Trả về thông tin danh mục vừa tạo.
- Category Type: DRESS, ACCESSORY, BLOG, SERVICE
`,
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            item: { $ref: getSchemaPath(Category) },
          },
        },
      ],
    },
  })
  async createCategoryForOwner(
    @UserId() userId: string,
    @Body() categoryDto: CUCategoryDto,
  ): Promise<ItemResponse<Category>> {
    const category = await this.categoryService.createCategoryForOwner(userId, categoryDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Thư mục phân loại đã được tạo',
      item: category,
    };
  }

  @Get('me')
  @UseGuards(AuthGuard)
  @Roles(UserRole.SHOP)
  @ApiOperation({
    summary: 'Lấy danh sách danh mục của người dùng hiện tại',
    description: `
**Hướng dẫn sử dụng:**

- API trả về danh sách các danh mục thuộc về tài khoản đang đăng nhập.
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
            item: { $ref: getSchemaPath(Category) },
          },
        },
      ],
    },
  })
  async findCategoriesForOwner(
    @UserId() userId: string,
    @PaginationParams() { page, size, limit, offset }: Pagination,
    @SortingParams(['name', 'createdAt', 'updatedAt']) sort?: Sorting[],
    @FilteringParams(['name', 'status']) filter?: Filtering[],
  ): Promise<ListResponse<Category>> {
    const [categories, totalItems] = await this.categoryService.findCategoriesForOwner(
      userId,
      limit,
      offset,
      sort,
      filter,
    );
    const totalPages = Math.ceil(totalItems / size);
    return {
      message: 'Đây là danh sách các mục phân loại của bạn',
      statusCode: HttpStatus.OK,
      pageIndex: page,
      pageSize: size,
      totalItems,
      totalPages,
      hasNextPage: page + 1 < totalPages,
      hasPrevPage: 0 < page,
      items: categories,
    };
  }

  @Get(':id/me')
  @UseGuards(AuthGuard)
  @Roles(UserRole.SHOP)
  @ApiOperation({
    summary: 'Lấy chi tiết danh mục của người dùng hiện tại',
    description: `
**Hướng dẫn sử dụng:**

- Truyền \`id\` của danh mục trên URL.
- Chỉ trả về danh mục thuộc về user hiện tại.
- Nếu không tìm thấy sẽ trả về lỗi.
`,
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            item: { $ref: getSchemaPath(Category) },
          },
        },
      ],
    },
  })
  async findCategoryForOwner(
    @UserId() userId: string,
    @Param('id') id: string,
  ): Promise<ItemResponse<Category>> {
    const category = await this.categoryService.findCategoryForOwner(userId, id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Đây thông tin chi tiết của Category',
      item: category,
    };
  }

  @Put(':id/me')
  @UseGuards(AuthGuard)
  @Roles(UserRole.SHOP)
  @ApiOperation({
    summary: 'Cập nhật danh mục',
    description: `
**Hướng dẫn sử dụng:**

- Truyền \`id\` của danh mục trên URL.
- Gửi thông tin cập nhật ở phần Body.
- Chỉ cập nhật danh mục thuộc về user hiện tại.
- Nếu không tìm thấy sẽ trả về lỗi.
- Category Type: DRESS, ACCESSORY, BLOG, SERVICE
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
  async updateCategoryForOwner(
    @UserId() userId: string,
    @Param('id') id: string,
    @Body() body: CUCategoryDto,
  ): Promise<ItemResponse<null>> {
    await this.categoryService.updateCategoryForOwner(userId, id, body);
    return {
      statusCode: HttpStatus.NO_CONTENT,
      message: 'Category đã được cập nhật',
      item: null,
    };
  }

  @Delete(':id/me')
  @UseGuards(AuthGuard)
  @Roles(UserRole.SHOP)
  @ApiOperation({
    summary: 'Xóa mềm danh mục',
    description: `
**Hướng dẫn sử dụng:**

- Truyền \`id\` của danh mục trên URL.
- Chỉ xóa mềm danh mục thuộc về user hiện tại.
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
  async removeCategoryForOwner(
    @UserId() userId: string,
    @Param('id') id: string,
  ): Promise<ItemResponse<null>> {
    await this.categoryService.removeCategoryForOwner(userId, id);
    return {
      statusCode: HttpStatus.NO_CONTENT,
      message: 'Category đã được xóa',
      item: null,
    };
  }

  @Patch(':id/me')
  @UseGuards(AuthGuard)
  @Roles(UserRole.SHOP)
  @ApiOperation({
    summary: 'Khôi phục danh mục đã xóa mềm',
    description: `
**Hướng dẫn sử dụng:**

- Truyền \`id\` của danh mục trên URL.
- Chỉ khôi phục danh mục thuộc về user hiện tại.
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
  async restoreCategoryForOwner(
    @UserId() userId: string,
    @Param('id') id: string,
  ): Promise<ItemResponse<null>> {
    await this.categoryService.restoreCategoryForOwner(userId, id);
    return {
      statusCode: HttpStatus.NO_CONTENT,
      message: 'Category đã khôi phục',
      item: null,
    };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Lấy chi tiết danh mục',
    description: `
**Hướng dẫn sử dụng:**

- Truyền \`id\` của danh mục trên URL.
- Nếu không tìm thấy sẽ trả về lỗi.
`,
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            item: { $ref: getSchemaPath(ItemCategoryDto) },
          },
        },
      ],
    },
  })
  async findCategoryForCustomer(@Param('id') id: string): Promise<ItemResponse<ItemCategoryDto>> {
    const category = await this.categoryService.findCategoryForCustomer(id);
    const dto = plainToInstance(ItemCategoryDto, category, { excludeExtraneousValues: true });
    return {
      statusCode: HttpStatus.OK,
      message: 'Đây thông tin chi tiết của Category',
      item: dto,
    };
  }

  @Get(':id/dresses')
  @ApiOperation({
    summary: 'Lấy danh sách váy cưới/dịch vụ/blog/phụ kiện của danh mục',
    description: `
**Hướng dẫn sử dụng:**

- API trả về danh sách các mục thuộc về danh mục chỉ định.
- Hỗ trợ phân trang, sắp xếp, lọc:
  - \`page\`: Số trang (bắt đầu từ 0)
  - \`size\`: Số lượng mỗi trang
  - \`sort\`: Ví dụ: name:asc
  - \`filter\`: Ví dụ: name:like:áo
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
  async findDressesForCustomer(
    @Param('id') id: string,
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
    const [dresses, totalItems] = await this.categoryService.findDressesForCustomer(
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
    summary: 'Lấy danh sách váy cưới/dịch vụ/blog/phụ kiện của danh mục',
    description: `
**Hướng dẫn sử dụng:**

- API trả về danh sách các mục thuộc về danh mục chỉ định.
- Hỗ trợ phân trang, sắp xếp, lọc:
  - \`page\`: Số trang (bắt đầu từ 0)
  - \`size\`: Số lượng mỗi trang
  - \`sort\`: Ví dụ: name:asc
  - \`filter\`: Ví dụ: name:like:áo
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
  async findServicesForCustomer(
    @Param('id') id: string,
    @PaginationParams() { page, size, limit, offset }: Pagination,
    @SortingParams(['name', 'ratingAverage', 'createdAt', 'updatedAt']) sort?: Sorting[],
    @FilteringParams(['name', 'ratingAverage']) filter?: Filtering[],
  ): Promise<ListResponse<ListServiceDto>> {
    const [services, totalItems] = await this.categoryService.findServicesForCustomer(
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
    summary: 'Lấy danh sách váy cưới/dịch vụ/blog/phụ kiện của danh mục',
    description: `
**Hướng dẫn sử dụng:**

- API trả về danh sách các mục thuộc về danh mục chỉ định.
- Hỗ trợ phân trang, sắp xếp, lọc:
  - \`page\`: Số trang (bắt đầu từ 0)
  - \`size\`: Số lượng mỗi trang
  - \`sort\`: Ví dụ: name:asc
  - \`filter\`: Ví dụ: name:like:áo
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
            item: { $ref: getSchemaPath(ListBlogOfCategoryDto) },
          },
        },
      ],
    },
  })
  async findBlogsForCustomer(
    @Param('id') id: string,
    @PaginationParams() { page, size, limit, offset }: Pagination,
    @SortingParams(['title', 'createdAt', 'updatedAt']) sort?: Sorting[],
    @FilteringParams(['title']) filter?: Filtering[],
  ): Promise<ListResponse<ListBlogOfCategoryDto>> {
    const [blogs, totalItems] = await this.categoryService.findBlogsForCustomer(
      id,
      limit,
      offset,
      sort,
      filter,
    );
    const totalPages = Math.ceil(totalItems / size);
    const dtos = plainToInstance(ListBlogOfCategoryDto, blogs, { excludeExtraneousValues: true });
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

  @Get(':id/accessories')
  @ApiOperation({
    summary: 'Lấy danh sách váy cưới/dịch vụ/blog/phụ kiện của danh mục',
    description: `
**Hướng dẫn sử dụng:**

- API trả về danh sách các mục thuộc về danh mục chỉ định.
- Hỗ trợ phân trang, sắp xếp, lọc:
  - \`page\`: Số trang (bắt đầu từ 0)
  - \`size\`: Số lượng mỗi trang
  - \`sort\`: Ví dụ: name:asc
  - \`filter\`: Ví dụ: name:like:áo

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
    const [accessories, totalItems] = await this.categoryService.getAccessoriesForCustomer(
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
}
