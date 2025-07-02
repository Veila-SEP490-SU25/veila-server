import { UserService } from '@/app/user/user.service';
import { ItemResponse, ListResponse } from '@/common/base';
import {
  Filtering,
  FilteringParams,
  Pagination,
  PaginationParams,
  Roles,
  Sorting,
  SortingParams,
} from '@/common/decorators';
import { AuthGuard } from '@/common/guards';
import { User, UserRole } from '@/common/models';
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
  ApiBody,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { CreateUser, UpdateUser } from '@/app/user/user.dto';

@Controller('users')
@UseGuards(AuthGuard)
@ApiTags('User Controller')
@ApiBearerAuth()
@ApiExtraModels(ItemResponse, ListResponse, User)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('super-admin')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary: 'Lấy danh sách tài khoản người dùng (chỉ dành cho Super Admin)',
    description: `
**Hướng dẫn sử dụng:**

- **Phân trang:**
  - \`page\`: Số trang (bắt đầu từ 0)
  - \`size\`: Số lượng bản ghi mỗi trang

- **Sắp xếp:**
  - \`sort\`: Định dạng \`[tên_field]:[asc|desc]\`
  - Ví dụ: \`sort=username:asc\` hoặc \`sort=email:desc\`

- **Lọc dữ liệu:**
  - \`filter\`: Định dạng \`[tên_field]:[rule]:[giá trị]\`
  - Các rule hỗ trợ: \`eq\`, \`neq\`, \`gt\`, \`gte\`, \`lt\`, \`lte\`, \`like\`, \`nlike\`, \`in\`, \`nin\`, \`isnull\`, \`isnotnull\`
  - Ví dụ: \`filter=username:like:admin\` (lọc username chứa 'admin')
  - Ví dụ: \`filter=firstName:eq:John\` (lọc firstName bằng 'John')

- **Lưu ý:** Chỉ trả về các user không phải SUPER_ADMIN.
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
    description: 'Sắp xếp theo trường, ví dụ: username:asc',
  })
  @ApiQuery({
    name: 'filter',
    required: false,
    type: String,
    description: 'Lọc theo trường, ví dụ: username:like:admin',
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ListResponse) },
        {
          properties: {
            item: { $ref: getSchemaPath(User) },
          },
        },
      ],
    },
  })
  async getUsersForSuperAdmin(
    @PaginationParams() pagination: Pagination,
    @SortingParams(['username', 'email']) sort?: Sorting,
    @FilteringParams(['username', 'firstName', 'lastName']) filter?: Filtering,
  ): Promise<ListResponse<User>> {
    return await this.userService.getUsersForSuperAdmin(pagination, sort, filter);
  }

  @Get(':id/super-admin')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary: 'Lấy thông tin chi tiết tài khoản người dùng (chỉ dành cho Super Admin)',
    description: `
**Hướng dẫn sử dụng:**

- Truyền \`id\` của user cần xem chi tiết trên URL.
- API này chỉ dành cho SUPER_ADMIN.
- Kết quả trả về là thông tin chi tiết của user (trừ user có role là SUPER_ADMIN).
- Nếu không tìm thấy user hoặc không có quyền, sẽ trả về lỗi.
`,
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            item: { $ref: getSchemaPath(User) },
          },
        },
      ],
    },
  })
  async getUserForSuperAdmin(@Param('id') id: string): Promise<ItemResponse<User>> {
    const user = await this.userService.getUserForSuperAdmin(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Đây là thông tin chi tiết của User',
      item: user,
    };
  }

  @Post('super-admin')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary: 'Tạo mới tài khoản người dùng (chỉ dành cho Super Admin)',
    description: `
**Hướng dẫn sử dụng:**

- Gửi thông tin user cần tạo ở phần Body dưới dạng JSON.
- **Các trường bắt buộc:**
  - \`username\`: Tên đăng nhập (6-32 ký tự, chỉ chữ cái, số, gạch dưới)
  - \`email\`: Email hợp lệ
  - \`password\`: Mật khẩu mạnh (tối thiểu 8 ký tự, có chữ hoa, chữ thường, số, ký tự đặc biệt)
  - \`firstName\`: Tên
  - \`lastName\`: Họ
  - \`role\`: Vai trò (ADMIN, STAFF, SHOP, CUSTOMER)
  - \`status\`: Trạng thái tài khoản (ACTIVE, INACTIVE, SUSPENDED, BANNED)
  - \`isVerified\`: Đã xác thực email hay chưa (true/false)
  - \`isIdentified\`: Đã xác thực danh tính hay chưa (true/false)
- **Lưu ý:**
  - Không được tạo user có role là SUPER_ADMIN.
  - Nếu \`username\` hoặc \`email\` đã tồn tại, sẽ trả về lỗi.

**Ví dụ Body:**
\`\`\`json
{
  "username": "newuser",
  "email": "newuser@example.com",
  "password": "yourPassword123",
  "firstName": "New",
  "lastName": "User",
  "role": "ADMIN",
  "status": "ACTIVE",
  "isVerified": false,
  "isIdentified": false
}
\`\`\`
`,
  })
  @ApiBody({ type: CreateUser })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            item: { $ref: getSchemaPath(User) },
          },
        },
      ],
    },
  })
  async createUserForSuperAdmin(@Body() body: CreateUser): Promise<ItemResponse<User>> {
    const user = await this.userService.createUserForSuperAdmin(body);
    return {
      message: 'User mới đã tạo thành công',
      statusCode: HttpStatus.CREATED,
      item: user,
    };
  }

  @Put(':id/super-admin')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary: 'Cập nhật tài khoản người dùng (chỉ dành cho Super Admin)',
    description: `
**Hướng dẫn sử dụng:**

- Gửi thông tin user cần cập nhật ở phần Body dưới dạng JSON.
- Truyền \`id\` của user cần cập nhật trên URL.
- **Các trường bắt buộc:**
  - \`username\`: Tên đăng nhập (6-32 ký tự, chỉ chữ cái, số, gạch dưới)
  - \`email\`: Email hợp lệ
  - \`password\`: Mật khẩu mạnh (tối thiểu 8 ký tự, có chữ hoa, chữ thường, số, ký tự đặc biệt)
  - \`firstName\`: Tên
  - \`lastName\`: Họ
  - \`role\`: Vai trò (ADMIN, STAFF, SHOP, CUSTOMER)
  - \`status\`: Trạng thái tài khoản (ACTIVE, INACTIVE, SUSPENDED, BANNED)
  - \`isVerified\`: Đã xác thực email hay chưa (true/false)
  - \`isIdentified\`: Đã xác thực danh tính hay chưa (true/false)
- **Lưu ý:**
  - Không được cập nhật user thành role SUPER_ADMIN.
  - Nếu \`username\` hoặc \`email\` đã tồn tại, sẽ trả về lỗi.

**Ví dụ Body:**
\`\`\`json
{
  "username": "updateduser",
  "email": "updateduser@example.com",
  "password": "NewPassword123",
  "firstName": "Updated",
  "lastName": "User",
  "role": "ADMIN",
  "status": "ACTIVE",
  "isVerified": true,
  "isIdentified": true
}
\`\`\`
`,
  })
  @ApiBody({ type: UpdateUser })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            item: { $ref: getSchemaPath(User) },
          },
        },
      ],
    },
  })
  async updateUserForSuperAdmin(
    @Param('id') id: string,
    @Body() body: UpdateUser,
  ): Promise<ItemResponse<User>> {
    const user = await this.userService.updateUserForSuperAdmin(id, body);
    return {
      message: 'User đã được update thành công',
      statusCode: HttpStatus.OK,
      item: user,
    };
  }

  @Delete(':id/super-admin')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary: 'Xóa mềm tài khoản người dùng (chỉ dành cho Super Admin)',
    description: `
**Hướng dẫn sử dụng:**

- Truyền \`id\` của user cần xóa trên URL.
- Chỉ xóa được user có role là ADMIN, STAFF, SHOP, CUSTOMER.
- Nếu user đã bị xóa hoặc không có quyền, sẽ trả về lỗi.
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
  async deleteUserForSuperAdmin(@Param('id') id: string): Promise<ItemResponse<null>> {
    await this.userService.deleteUserForSuperAdmin(id);
    return {
      statusCode: HttpStatus.NO_CONTENT,
      message: 'User đã xóa thành công',
      item: null,
    };
  }

  @Patch(':id/super-admin')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary: 'Khôi phục tài khoản người dùng đã bị xóa mềm (chỉ dành cho Super Admin)',
    description: `
**Hướng dẫn sử dụng:**

- Truyền \`id\` của user cần khôi phục trên URL.
- Chỉ khôi phục được user có role là ADMIN, STAFF, SHOP, CUSTOMER.
- Nếu user chưa bị xóa hoặc không có quyền, sẽ trả về lỗi.
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
  async recoveryUserForSuperAdmin(@Param('id') id: string): Promise<ItemResponse<null>> {
    await this.userService.restoreUserForSuperAdmin(id);
    return {
      statusCode: HttpStatus.NO_CONTENT,
      message: 'User đã khôi phục thành công',
      item: null,
    };
  }

  @Get('admin')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({
    summary: 'Lấy danh sách tài khoản người dùng',
    description: `
**Hướng dẫn sử dụng:**

- **Phân trang:**
  - \`page\`: Số trang (bắt đầu từ 0)
  - \`size\`: Số lượng bản ghi mỗi trang

- **Sắp xếp:**
  - \`sort\`: Định dạng \`[tên_field]:[asc|desc]\`
  - Ví dụ: \`sort=username:asc\` hoặc \`sort=email:desc\`

- **Lọc dữ liệu:**
  - \`filter\`: Định dạng \`[tên_field]:[rule]:[giá trị]\`
  - Các rule hỗ trợ: \`eq\`, \`neq\`, \`gt\`, \`gte\`, \`lt\`, \`lte\`, \`like\`, \`nlike\`, \`in\`, \`nin\`, \`isnull\`, \`isnotnull\`
  - Ví dụ: \`filter=username:like:admin\` (lọc username chứa 'admin')
  - Ví dụ: \`filter=firstName:eq:John\` (lọc firstName bằng 'John')

- **Lưu ý:** Chỉ trả về các user không phải SUPER_ADMIN và ADMIN.
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
    description: 'Sắp xếp theo trường, ví dụ: username:asc',
  })
  @ApiQuery({
    name: 'filter',
    required: false,
    type: String,
    description: 'Lọc theo trường, ví dụ: username:like:admin',
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ListResponse) },
        {
          properties: {
            item: { $ref: getSchemaPath(User) },
          },
        },
      ],
    },
  })
  async getUsersForAdmin(
    @PaginationParams() pagination: Pagination,
    @SortingParams(['username', 'email']) sort?: Sorting,
    @FilteringParams(['username', 'firstName', 'lastName']) filter?: Filtering,
  ): Promise<ListResponse<User>> {
    return await this.userService.getUsersForAdmin(pagination, sort, filter);
  }

  @Get(':id/admin')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({
    summary: 'Lấy thông tin chi tiết tài khoản người dùng',
    description: `
**Hướng dẫn sử dụng:**

- Truyền \`id\` của user cần xem chi tiết trên URL.
- Kết quả trả về là thông tin chi tiết của user (trừ user có role là SUPER_ADMIN, ADMIN).
- Nếu không tìm thấy user hoặc không có quyền, sẽ trả về lỗi.
`,
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            item: { $ref: getSchemaPath(User) },
          },
        },
      ],
    },
  })
  async getUserForAdmin(@Param('id') id: string): Promise<ItemResponse<User>> {
    const user = await this.userService.getUserForAdmin(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Đây là thông tin chi tiết của User',
      item: user,
    };
  }

  @Post('admin')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({
    summary: 'Tạo mới tài khoản người dùng (chỉ dành cho Admin hoặc Super Admin)',
    description: `
**Hướng dẫn sử dụng:**

- Gửi thông tin user cần tạo ở phần Body dưới dạng JSON.
- **Các trường bắt buộc:**
  - \`username\`: Tên đăng nhập (6-32 ký tự, chỉ chữ cái, số, gạch dưới)
  - \`email\`: Email hợp lệ
  - \`password\`: Mật khẩu mạnh (tối thiểu 8 ký tự, có chữ hoa, chữ thường, số, ký tự đặc biệt)
  - \`firstName\`: Tên
  - \`lastName\`: Họ
  - \`role\`: Vai trò (STAFF, SHOP, CUSTOMER)
  - \`status\`: Trạng thái tài khoản (ACTIVE, INACTIVE, SUSPENDED, BANNED)
  - \`isVerified\`: Đã xác thực email hay chưa (true/false)
  - \`isIdentified\`: Đã xác thực danh tính hay chưa (true/false)
- **Lưu ý:**
  - Không được tạo user có role là SUPER_ADMIN hoặc ADMIN.
  - Nếu \`username\` hoặc \`email\` đã tồn tại, sẽ trả về lỗi.

**Ví dụ Body:**
\`\`\`json
{
  "username": "newuser",
  "email": "newuser@example.com",
  "password": "yourPassword123",
  "firstName": "New",
  "lastName": "User",
  "role": "STAFF",
  "status": "ACTIVE",
  "isVerified": false,
  "isIdentified": false
}
\`\`\`
`,
  })
  @ApiBody({ type: CreateUser })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            item: { $ref: getSchemaPath(User) },
          },
        },
      ],
    },
  })
  async createUserForAdmin(@Body() body: CreateUser): Promise<ItemResponse<User>> {
    const user = await this.userService.createUserForAdmin(body);
    return {
      message: 'User mới đã tạo thành công',
      statusCode: HttpStatus.CREATED,
      item: user,
    };
  }

  @Put(':id/admin')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({
    summary: 'Cập nhật tài khoản người dùng (chỉ dành cho Admin hoặc Super Admin)',
    description: `
**Hướng dẫn sử dụng:**

- Gửi thông tin user cần cập nhật ở phần Body dưới dạng JSON.
- Truyền \`id\` của user cần cập nhật trên URL.
- **Các trường bắt buộc:**
  - \`username\`: Tên đăng nhập (6-32 ký tự, chỉ chữ cái, số, gạch dưới)
  - \`email\`: Email hợp lệ
  - \`password\`: Mật khẩu mạnh (tối thiểu 8 ký tự, có chữ hoa, chữ thường, số, ký tự đặc biệt)
  - \`firstName\`: Tên
  - \`lastName\`: Họ
  - \`role\`: Vai trò (STAFF, SHOP, CUSTOMER)
  - \`status\`: Trạng thái tài khoản (ACTIVE, INACTIVE, SUSPENDED, BANNED)
  - \`isVerified\`: Đã xác thực email hay chưa (true/false)
  - \`isIdentified\`: Đã xác thực danh tính hay chưa (true/false)
- **Lưu ý:**
  - Không được cập nhật user thành role SUPER_ADMIN hoặc ADMIN.
  - Nếu \`username\` hoặc \`email\` đã tồn tại, sẽ trả về lỗi.

**Ví dụ Body:**
\`\`\`json
{
  "username": "updateduser",
  "email": "updateduser@example.com",
  "password": "NewPassword123",
  "firstName": "Updated",
  "lastName": "User",
  "role": "STAFF",
  "status": "ACTIVE",
  "isVerified": true,
  "isIdentified": true
}
\`\`\`
`,
  })
  @ApiBody({ type: UpdateUser })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            item: { $ref: getSchemaPath(User) },
          },
        },
      ],
    },
  })
  async updateUserForAdmin(
    @Param('id') id: string,
    @Body() body: UpdateUser,
  ): Promise<ItemResponse<User>> {
    const user = await this.userService.updateUserForAdmin(id, body);
    return {
      message: 'User đã được update thành công',
      statusCode: HttpStatus.OK,
      item: user,
    };
  }

  @Delete(':id/admin')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({
    summary: 'Xóa mềm tài khoản người dùng',
    description: `
**Hướng dẫn sử dụng:**

- Truyền \`id\` của user cần xóa trên URL.
- Chỉ xóa được user có role là STAFF, SHOP, CUSTOMER.
- Nếu user đã bị xóa hoặc không có quyền, sẽ trả về lỗi.
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
  async deleteUserForAdmin(@Param('id') id: string): Promise<ItemResponse<null>> {
    await this.userService.deleteUserForAdmin(id);
    return {
      statusCode: HttpStatus.NO_CONTENT,
      message: 'User đã xóa thành công',
      item: null,
    };
  }

  @Patch(':id/admin')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({
    summary: 'Khôi phục tài khoản người dùng đã bị xóa mềm',
    description: `
**Hướng dẫn sử dụng:**

- Truyền \`id\` của user cần khôi phục trên URL.
- Chỉ khôi phục được user có role là STAFF, SHOP, CUSTOMER.
- Nếu user chưa bị xóa hoặc không có quyền, sẽ trả về lỗi.
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
  async recoveryUserForAdmin(@Param('id') id: string): Promise<ItemResponse<null>> {
    await this.userService.restoreUserForAdmin(id);
    return {
      statusCode: HttpStatus.NO_CONTENT,
      message: 'User đã khôi phục thành công',
      item: null,
    };
  }
}
