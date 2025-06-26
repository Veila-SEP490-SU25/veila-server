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
import { CategoryDto } from '@/app/category/category.dto';
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

@Controller('categories')
@UseGuards(AuthGuard)
@Roles(UserRole.SHOP)
@ApiTags('Category Controller')
@ApiBearerAuth()
@ApiExtraModels(ItemResponse, ListResponse, Category)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
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
  async create(
    @UserId() userId: string,
    @Body() categoryDto: CategoryDto,
  ): Promise<ItemResponse<Category>> {
    const category = await this.categoryService.create(userId, categoryDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Thư mục phân loại đã được tạo',
      item: category,
    };
  }

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
  async findAll(
    @UserId() userId: string,
    @PaginationParams() pagination: Pagination,
    @SortingParams(['name']) sort?: Sorting,
    @FilteringParams(['name']) filter?: Filtering,
  ): Promise<ListResponse<Category>> {
    return await this.categoryService.findAll(userId, pagination, sort, filter);
  }

  @Get(':id')
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
  async findOne(
    @UserId() userId: string,
    @Param('id') id: string,
  ): Promise<ItemResponse<Category>> {
    const category = await this.categoryService.findOne(userId, id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Đây thông tin chi tiết của Category',
      item: category,
    };
  }

  @Put(':id')
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
  async update(
    @UserId() userId: string,
    @Param('id') id: string,
    @Body() body: CategoryDto,
  ): Promise<ItemResponse<null>> {
    await this.categoryService.update(userId, id, body);
    return {
      statusCode: HttpStatus.OK,
      message: 'Category đã được cập nhật',
      item: null,
    };
  }

  @Delete(':id')
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
  async remove(@UserId() userId: string, @Param('id') id: string): Promise<ItemResponse<null>> {
    await this.categoryService.remove(userId, id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Category đã được xóa',
      item: null,
    };
  }

  @Patch(':id')
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
  async restore(@UserId() userId: string, @Param('id') id: string): Promise<ItemResponse<null>> {
    await this.categoryService.restore(userId, id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Category đã khôi phục',
      item: null,
    };
  }
}
