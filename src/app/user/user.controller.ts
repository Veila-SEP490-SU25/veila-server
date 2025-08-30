import { UserService } from '@/app/user/user.service';
import { ItemResponse, ListResponse } from '@/common/base';
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
import {
  CreateUser,
  IdentifyAuthDto,
  UpdateUser,
  UserContactDto,
  UsernameDto,
} from '@/app/user/user.dto';

@Controller('users')
@UseGuards(AuthGuard)
@ApiTags('User Controller')
@ApiBearerAuth()
@ApiExtraModels(ItemResponse, ListResponse, User, UserContactDto)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Put('identify')
  @ApiOperation({
    summary: 'Xác minh số điện thoại người dùng',
    description: 'Cập nhật số điện thoại của người dùng',
  })
  @UseGuards(AuthGuard)
  @Roles(UserRole.CUSTOMER, UserRole.SHOP)
  @ApiBearerAuth()
  @ApiBody({ type: IdentifyAuthDto })
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
  async identifyUser(
    @UserId() userId: string,
    @Body() body: IdentifyAuthDto,
  ): Promise<ItemResponse<null>> {
    await this.userService.identifyUser(userId, body);
    return {
      message: 'Xác minh số điện thoại cho người dùng thành công',
      statusCode: HttpStatus.OK,
      item: null,
    };
  }

  @Put('username')
  @ApiOperation({
    summary: 'Cập nhật username (check unique cho người dùng)',
    description: 'Cập nhật username mới cho người dùng, check unique',
  })
  @UseGuards(AuthGuard)
  @Roles(UserRole.CUSTOMER, UserRole.SHOP)
  @ApiBearerAuth()
  @ApiBody({ type: UsernameDto })
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
  async updateUsername(
    @UserId() userId: string,
    @Body() body: UsernameDto,
  ): Promise<ItemResponse<null>> {
    await this.userService.updateUsername(userId, body);
    return {
      message: 'Cập nhật user name thành công',
      statusCode: HttpStatus.OK,
      item: null,
    };
  }

  @Get()
  @UseGuards(AuthGuard)
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
  async getUsers(
    @CurrentRole() currentRole: UserRole,
    @PaginationParams() pagination: Pagination,
    @SortingParams(['username', 'email', 'createdAt', 'updatedAt']) sort?: Sorting,
    @FilteringParams(['username', 'firstName', 'lastName']) filter?: Filtering,
  ): Promise<ListResponse<User>> {
    return await this.userService.getUsers(currentRole, pagination, sort, filter);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({
    summary: 'Lấy thông tin chi tiết tài khoản người dùng (chỉ dành cho Super Admin)',
    description: `
**Hướng dẫn sử dụng:**

- Truyền \`id\` của user cần xem chi tiết trên URL.
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
  async getUser(
    @CurrentRole() currentRole: UserRole,
    @Param('id') id: string,
  ): Promise<ItemResponse<User>> {
    const user = await this.userService.getUser(currentRole, id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Đây là thông tin chi tiết của User',
      item: user,
    };
  }

  @Post()
  @UseGuards(AuthGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({
    summary: 'Tạo mới tài khoản người dùng',
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
  async createUser(
    @CurrentRole() currentRole: UserRole,
    @Body() body: CreateUser,
  ): Promise<ItemResponse<User>> {
    const user = await this.userService.createUserForApi(currentRole, body);
    return {
      message: 'User mới đã tạo thành công',
      statusCode: HttpStatus.CREATED,
      item: user,
    };
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({
    summary: 'Cập nhật tài khoản người dùng',
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
  async updateUser(
    @CurrentRole() currentRole: UserRole,
    @Param('id') id: string,
    @Body() body: UpdateUser,
  ): Promise<ItemResponse<User>> {
    const user = await this.userService.updateUserForApi(currentRole, id, body);
    return {
      message: 'User đã được update thành công',
      statusCode: HttpStatus.OK,
      item: user,
    };
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
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
  async deleteUser(
    @CurrentRole() currentRole: UserRole,
    @Param('id') id: string,
  ): Promise<ItemResponse<null>> {
    await this.userService.deleteUserForApi(currentRole, id);
    return {
      statusCode: HttpStatus.NO_CONTENT,
      message: 'User đã xóa thành công',
      item: null,
    };
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
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
  async recoveryUser(
    @CurrentRole() currentRole: UserRole,
    @Param('id') id: string,
  ): Promise<ItemResponse<null>> {
    await this.userService.restoreUserForApi(currentRole, id);
    return {
      statusCode: HttpStatus.NO_CONTENT,
      message: 'User đã khôi phục thành công',
      item: null,
    };
  }

  @Get('contact-information')
  @UseGuards(AuthGuard)
  @Roles(UserRole.CUSTOMER)
  @ApiOperation({
    summary: 'Lấy thông tin liên lạc, địa chỉ của người dùng',
    description: `
      **Hướng dẫn sử dụng:**

      - Trả về địa chỉ, email, số điện thoại của người dùng.
    `,
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            items: { $ref: getSchemaPath(UserContactDto) },
          },
        },
      ],
    },
  })
  async getContactInformation(@UserId() userId: string): Promise<ItemResponse<UserContactDto>> {
    const userContactInformation = await this.userService.getContactInformation(userId);

    return {
      message: 'Đây là thông tin liên lạc của người dùng',
      statusCode: HttpStatus.OK,
      item: userContactInformation,
    };
  }
}
