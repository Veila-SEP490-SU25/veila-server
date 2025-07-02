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
import { CategoryDto, ItemCategoryDto } from '@/app/category/category.dto';
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
import { ListBlogDto } from '@/app/blog';
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
  ListBlogDto,
  ListAccessoryDto,
)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

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
    return {
      statusCode: HttpStatus.OK,
      message: 'Đây thông tin chi tiết của Category',
      item: category,
    };
  }

  @Get(':id/dresses')
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
  @ApiOperation({
    summary: 'Lấy danh sách danh mục của người dùng hiện tại',
    description: `
**Hướng dẫn sử dụng:**
- API trả về danh sách các danh mục thuộc về tài khoản đang đăng nhập.
- Hỗ trợ phân trang, sắp xếp, lọc:
  - \`page\`: Số trang (bắt đầu từ 0)
  - \`size\`: Số lượng mỗi trang
  - \`sort\`: Ví dụ: name:asc
  - \`filter\`: Ví dụ: :like:
- Chỉ trả về danh mục của user hiện tại.
`,
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
    @PaginationParams() pagination: Pagination,
    @SortingParams(['name', 'ratingAverage', 'isSellable']) sort?: Sorting,
    @FilteringParams(['name', 'ratingAverage', 'isRentable']) filter?: Filtering,
  ): Promise<ListResponse<ListDressDto>> {
    return await this.categoryService.findDressesForCustomer(id, pagination, sort, filter);
  }

  @Get(':id/services')
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
  @ApiOperation({
    summary: 'Lấy danh sách danh mục của người dùng hiện tại',
    description: `
**Hướng dẫn sử dụng:**
- API trả về danh sách các danh mục thuộc về tài khoản đang đăng nhập.
- Hỗ trợ phân trang, sắp xếp, lọc:
  - \`page\`: Số trang (bắt đầu từ 0)
  - \`size\`: Số lượng mỗi trang
  - \`sort\`: Ví dụ: name:asc
  - \`filter\`: Ví dụ: :like:
`,
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
    @PaginationParams() pagination: Pagination,
    @SortingParams(['name', 'ratingAverage']) sort?: Sorting,
    @FilteringParams(['name', 'ratingAverage']) filter?: Filtering,
  ): Promise<ListResponse<ListServiceDto>> {
    return await this.categoryService.findServicesForCustomer(id, pagination, sort, filter);
  }

  @Get(':id/blogs')
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
  @ApiOperation({
    summary: 'Lấy danh sách danh mục của người dùng hiện tại',
    description: `
**Hướng dẫn sử dụng:**
- API trả về danh sách các danh mục thuộc về tài khoản đang đăng nhập.
- Hỗ trợ phân trang, sắp xếp, lọc:
  - \`page\`: Số trang (bắt đầu từ 0)
  - \`size\`: Số lượng mỗi trang
  - \`sort\`: Ví dụ: name:asc
  - \`filter\`: Ví dụ: :like:
- Chỉ trả về danh mục của user hiện tại.
`,
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
  async findBlogsForCustomer(
    @Param('id') id: string,
    @PaginationParams() pagination: Pagination,
    @SortingParams(['title']) sort?: Sorting,
    @FilteringParams(['title']) filter?: Filtering,
  ): Promise<ListResponse<ListBlogDto>> {
    return await this.categoryService.findBlogsForCustomer(id, pagination, sort, filter);
  }

  @Get(':id/accessories')
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

  @Post('me')
  @UseGuards(AuthGuard)
  @Roles(UserRole.SHOP)
  @ApiOperation({
    summary: 'Tạo mới danh mục sản phẩm',
    description: `
**Hướng dẫn sử dụng:**
- Gửi thông tin danh mục cần tạo ở phần Body dưới dạng JSON.
- Danh mục sẽ gắn với tài khoản đang đăng nhập (lấy từ token).
- Các trường bắt buộc:
  - \`name\`: Tên danh mục
  - \`type\`: Loại danh mục (BLOG, DRESS, ACCESSORY, SERVICE)
- Trả về thông tin danh mục vừa tạo.
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
    @Body() categoryDto: CategoryDto,
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
  @ApiOperation({
    summary: 'Lấy danh sách danh mục của người dùng hiện tại',
    description: `
**Hướng dẫn sử dụng:**
- API trả về danh sách các danh mục thuộc về tài khoản đang đăng nhập.
- Hỗ trợ phân trang, sắp xếp, lọc:
  - \`page\`: Số trang (bắt đầu từ 0)
  - \`size\`: Số lượng mỗi trang
  - \`sort\`: Ví dụ: name:asc
  - \`filter\`: Ví dụ: name:like:áo
- Chỉ trả về danh mục của user hiện tại.
`,
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
    @PaginationParams() pagination: Pagination,
    @SortingParams(['name']) sort?: Sorting,
    @FilteringParams(['name']) filter?: Filtering,
  ): Promise<ListResponse<Category>> {
    return await this.categoryService.findCategoriesForOwner(userId, pagination, sort, filter);
  }

  @Get(':id/me')
  @UseGuards(AuthGuard)
  @Roles(UserRole.SHOP)
  @ApiOperation({
    summary: 'Lấy chi tiết danh mục',
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
    @Body() body: CategoryDto,
  ): Promise<ItemResponse<null>> {
    await this.categoryService.updateCategoryForOwner(userId, id, body);
    return {
      statusCode: HttpStatus.OK,
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
      statusCode: HttpStatus.OK,
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
      statusCode: HttpStatus.OK,
      message: 'Category đã khôi phục',
      item: null,
    };
  }
}
