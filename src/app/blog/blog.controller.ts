import { ItemResponse, ListResponse } from '@/common/base';
import { Blog, UserRole } from '@/common/models';
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
import { BlogService } from './blog.service';
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
import { CUBlogDto, ItemBlogDto, ListBlogDto } from '@/app/blog/blog.dto';
import { plainToInstance } from 'class-transformer';

@Controller('blogs')
@ApiTags('Blog Controller')
@ApiBearerAuth()
@ApiExtraModels(ItemResponse, ListResponse, Blog, ListBlogDto, ItemBlogDto)
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get('me')
  @UseGuards(AuthGuard)
  @Roles(UserRole.SHOP)
  @ApiOperation({
    summary: 'Lấy danh sách blog của chủ shop đang đăng nhập',
    description: `
**Hướng dẫn sử dụng:**

- Trả về danh sách blog thuộc về tài khoản shop đang đăng nhập (bao gồm cả đã xóa mềm).
- Hỗ trợ phân trang, sắp xếp, lọc.
- Page bắt đầu từ 0
- Sort theo format: [tên_field]:[asc/desc]
- Các trường đang có thể sort: title
- Filter theo format: [tên_field]:[eq|neq|gt|gte|lt|lte|like|nlike|in|nin]:[keyword]; hoặc [tên_field]:[isnull|isnotnull]
- Các trường đang có thể filter: title, status
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
            item: { $ref: getSchemaPath(Blog) },
          },
        },
      ],
    },
  })
  async getBlogsForOwner(
    @UserId() userId: string,
    @PaginationParams() { page, size, limit, offset }: Pagination,
    @SortingParams(['title']) sort?: Sorting,
    @FilteringParams(['title', 'status']) filter?: Filtering,
  ): Promise<ListResponse<Blog>> {
    const [blogs, totalItems] = await this.blogService.getBlogsForOwner(
      userId,
      limit,
      offset,
      sort,
      filter,
    );
    const totalPages = Math.ceil(totalItems / size);

    return {
      message: 'Đây là danh sách các bài blog của bạn',
      statusCode: HttpStatus.OK,
      pageIndex: page,
      pageSize: size,
      totalItems,
      totalPages,
      hasNextPage: page + 1 < totalPages,
      hasPrevPage: 0 < page,
      items: blogs,
    };
  }

  @Get(':id/me')
  @UseGuards(AuthGuard)
  @Roles(UserRole.SHOP)
  @ApiOperation({
    summary: 'Lấy chi tiết blog của chủ shop đang đăng nhập',
    description: `
**Hướng dẫn sử dụng:**

- Truyền \`id\` của blog trên URL.
- Chỉ trả về blog thuộc về tài khoản shop đang đăng nhập (bao gồm cả đã xóa mềm).
- Nếu không tìm thấy sẽ trả về lỗi.
`,
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            item: { $ref: getSchemaPath(Blog) },
          },
        },
      ],
    },
  })
  async getBlogForOwner(
    @UserId() userId: string,
    @Param('id') id: string,
  ): Promise<ItemResponse<Blog>> {
    const blog = await this.blogService.getBlogForOwner(userId, id);
    return {
      message: 'Đây là thông tin chi tiết của bài blog',
      statusCode: HttpStatus.OK,
      item: blog,
    };
  }

  @Post('me')
  @UseGuards(AuthGuard)
  @Roles(UserRole.SHOP)
  @ApiOperation({
    summary: 'Tạo mới blog cho chủ shop đang đăng nhập',
    description: `
**Hướng dẫn sử dụng:**

- Gửi thông tin blog cần tạo ở phần Body dưới dạng JSON.
- Blog sẽ gắn với tài khoản shop đang đăng nhập.
- Các trường bắt buộc: \`title\`, \`content\`, \`status\`, ...
- Trả về thông tin blog vừa tạo.
- Blog status: DRAFT, PUBLISHED
`,
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            item: { $ref: getSchemaPath(Blog) },
          },
        },
      ],
    },
  })
  async createBlogForOwner(
    @UserId() userId: string,
    @Body() body: CUBlogDto,
  ): Promise<ItemResponse<Blog>> {
    const blog = await this.blogService.createBlogForOwner(userId, body);
    return {
      message: 'Tạo thành công',
      statusCode: HttpStatus.CREATED,
      item: blog,
    };
  }

  @Put(':id/me')
  @UseGuards(AuthGuard)
  @Roles(UserRole.SHOP)
  @ApiOperation({
    summary: 'Cập nhật blog của chủ shop đang đăng nhập',
    description: `
**Hướng dẫn sử dụng:**

- Truyền \`id\` của blog trên URL.
- Gửi thông tin cập nhật ở phần Body.
- Chỉ cập nhật blog thuộc về tài khoản shop đang đăng nhập.
- Nếu không tìm thấy sẽ trả về lỗi.
- Blog status: DRAFT, PUBLISHED
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
  async updateBlogForOwner(
    @UserId() userId: string,
    @Param('id') id: string,
    @Body() body: CUBlogDto,
  ): Promise<ItemResponse<null>> {
    await this.blogService.updateBlogForOwner(userId, id, body);
    return {
      message: 'Cập nhật thành công',
      statusCode: HttpStatus.NO_CONTENT,
      item: null,
    };
  }

  @Delete(':id/me')
  @UseGuards(AuthGuard)
  @Roles(UserRole.SHOP)
  @ApiOperation({
    summary: 'Xóa mềm blog của chủ shop đang đăng nhập',
    description: `
**Hướng dẫn sử dụng:**

- Truyền \`id\` của blog trên URL.
- Chỉ xóa mềm blog thuộc về tài khoản shop đang đăng nhập.
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
  async removeBlogForOwner(
    @UserId() userId: string,
    @Param('id') id: string,
  ): Promise<ItemResponse<null>> {
    await this.blogService.removeBlogForOwner(userId, id);
    return {
      message: 'Xóa thành công',
      statusCode: HttpStatus.NO_CONTENT,
      item: null,
    };
  }

  @Patch(':id/me')
  @UseGuards(AuthGuard)
  @Roles(UserRole.SHOP)
  @ApiOperation({
    summary: 'Khôi phục blog đã xóa mềm của chủ shop đang đăng nhập',
    description: `
**Hướng dẫn sử dụng:**

- Truyền \`id\` của blog trên URL.
- Chỉ khôi phục blog thuộc về tài khoản shop đang đăng nhập.
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
  async restoreBlogForOwner(
    @UserId() userId: string,
    @Param('id') id: string,
  ): Promise<ItemResponse<null>> {
    await this.blogService.restoreBlogForOwner(userId, id);
    return {
      message: 'Khôi phục thành công',
      statusCode: HttpStatus.NO_CONTENT,
      item: null,
    };
  }

  @Get()
  @ApiOperation({
    summary: 'Lấy danh sách blog cho khách hàng',
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

- Chỉ trả về các blog đã xuất bản (PUBLISHED).
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
    @PaginationParams() { page, size, limit, offset }: Pagination,
    @SortingParams(['title']) sort?: Sorting,
    @FilteringParams(['title']) filter?: Filtering,
  ): Promise<ListResponse<ListBlogDto>> {
    const [blogs, totalItems] = await this.blogService.getBlogsForCustomer(
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

  @Get(':id')
  @ApiOperation({
    summary: 'Lấy thông tin chi tiết blog cho khách hàng',
    description: `
**Hướng dẫn sử dụng:**

- Truyền \`id\` của blog trên URL.
- Chỉ trả về blog ở trạng thái PUBLISHED.
- Nếu không tìm thấy sẽ trả về lỗi.
`,
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            item: { $ref: getSchemaPath(ItemBlogDto) },
          },
        },
      ],
    },
  })
  async getBlogForCustomer(@Param('id') id: string): Promise<ItemResponse<ItemBlogDto>> {
    const blog = await this.blogService.getBlogForCustomer(id);
    const dto = plainToInstance(ItemBlogDto, blog, { excludeExtraneousValues: true });
    return {
      message: 'Đây là thông tin chi tiết của bài blog',
      statusCode: HttpStatus.OK,
      item: dto,
    };
  }
}
