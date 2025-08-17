import { CUComplaintDto, ReviewComplaintDto } from '@/app/complaint/complaint.dto';
import { ComplaintService } from '@/app/complaint/complaint.service';
import { ItemResponse, ListResponse } from '@/common/base';
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
import { AuthGuard } from '@/common/guards';
import { Complaint, UserRole } from '@/common/models';
import { Body, Controller, Get, HttpStatus, Param, Put, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';

@Controller('complaints')
@ApiTags('Complaint Controller')
@ApiBearerAuth()
@ApiExtraModels(ListResponse, ItemResponse, Complaint)
export class ComplaintController {
  constructor(private readonly complaintService: ComplaintService) {}

  @Get()
  @UseGuards(AuthGuard)
  @Roles(UserRole.STAFF, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary: 'Lấy danh sách khiếu nại cho nhân viên',
    description: `
**Hướng dẫn sử dụng:**
- Sử dụng phân trang với các tham số \`page\`, \`size\`, \`sort\`, \`filter\`.
- \`page\`: Trang hiện tại (bắt đầu từ 0).
- \`size\`: Số lượng mục mỗi trang.
- \`sort\`: Trường sắp xếp, ví dụ: \`createdAt:asc\`.
- \`filter\`: Điều kiện lọc, ví dụ: \`status:IN_PROGRESS\`.
- Trả về danh sách khiếu nại với các thông tin như tiêu đề, mô tả, trạng thái, người gửi, đơn hàng liên quan.
- Page bắt đầu từ 0
- Sort theo format: [tên_field]:[asc/desc]
- Các trường có thể lọc: status, createdAt
- Filter theo format: [tên_field]:[eq|neq|gt|gte|lt|lte|like|nlike|in|nin]:[keyword]; hoặc [tên_field]:[isnull|isnotnull]
- Các trường có thể sắp xếp: status
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
            item: { $ref: getSchemaPath(Complaint) },
          },
        },
      ],
    },
  })
  async getComplaintsForStaff(
    @PaginationParams() { page, size, limit, offset }: Pagination,
    @SortingParams(['createdAt', 'status']) sort?: Sorting,
    @FilteringParams(['status']) filter?: Filtering,
  ): Promise<ListResponse<Complaint>> {
    const [complaints, totalItems] = await this.complaintService.getComplaintsForStaff(
      limit,
      offset,
      sort,
      filter,
    );
    const totalPages = Math.ceil(totalItems / size);
    return {
      message: 'Danh sách khiếu nại cho nhân viên',
      statusCode: HttpStatus.OK,
      pageIndex: page,
      pageSize: size,
      totalItems,
      totalPages,
      hasNextPage: page < totalPages - 1,
      hasPrevPage: page > 0,
      items: complaints,
    };
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @Roles(UserRole.STAFF, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary: 'Lấy chi tiết khiếu nại cho nhân viên',
    description: `
        **Hướng dẫn sử dụng:**

        - Truyền \`id\` của khiếu nại trên URL.
        - Trả về thông tin chi tiết của khiếu nại.
    `,
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            item: { $ref: getSchemaPath(Complaint) },
          },
        },
      ],
    },
  })
  async getComplaintForStaff(@Param('id') id: string): Promise<ItemResponse<Complaint>> {
    const complaint = await this.complaintService.getComplaintForStaff(id);
    return {
      message: 'Chi tiết khiếu nại cho nhân viên',
      statusCode: HttpStatus.OK,
      item: complaint,
    };
  }

  @Put(':id/review')
  @UseGuards(AuthGuard)
  @Roles(UserRole.STAFF, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary: 'Cập nhật trạng thái khiếu nại cho nhân viên',
    description: `
        **Hướng dẫn sử dụng:**

        - Truyền \`id\` của khiếu nại trên URL.
        - Truyền dữ liệu cập nhật trong body.
        - Các trường bắt buộc: \`status\`.
        - Nếu không tìm thấy khiếu nại sẽ trả về lỗi.
        - Trả về thông tin chi tiết của khiếu nại đã cập nhật.
        - APPROVED/REJECTED
    `,
  })
  @ApiNoContentResponse({
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
  async updateComplaintForStaff(
    @Param('id') id: string,
    @Body() body: ReviewComplaintDto,
  ): Promise<ItemResponse<null>> {
    await this.complaintService.reviewComplaint(id, body.status);
    return {
      message: 'Khiếu nại đã được cập nhật thành công',
      statusCode: HttpStatus.OK,
      item: null,
    };
  }

  @Get(':id/me')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Lấy chi tiết khiếu nại của bạn',
    description: `
        **Hướng dẫn sử dụng:**

        - Truyền \`id\` của khiếu nại trên URL.
        - Trả về thông tin chi tiết của khiếu nại.
    `,
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            item: { $ref: getSchemaPath(Complaint) },
          },
        },
      ],
    },
  })
  async getOwnerComplaint(
    @Param('id') id: string,
    @UserId() userId: string,
  ): Promise<ItemResponse<Complaint>> {
    const complaint = await this.complaintService.getOwnerComplaintById(userId, id);
    return {
      message: 'Chi tiết khiếu nại của bạn',
      statusCode: HttpStatus.OK,
      item: complaint,
    };
  }

  @Put(':id/me')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Cập nhật khiếu nại của bạn',
    description: `
        **Hướng dẫn sử dụng:**

        - Truyền \`id\` của khiếu nại trên URL.
        - Truyền dữ liệu cập nhật trong body.
        - Các trường bắt buộc: \`status\`.
        - Nếu không tìm thấy khiếu nại sẽ trả về lỗi.
        - Trả về thông tin chi tiết của khiếu nại đã cập nhật.
    `,
  })
  @ApiNoContentResponse({
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
  async updateOwnerComplaint(
    @Param('id') id: string,
    @Body() body: CUComplaintDto,
    @UserId() userId: string,
  ): Promise<ItemResponse<null>> {
    await this.complaintService.updateComplaint(userId, id, body);
    return {
      message: 'Khiếu nại của bạn đã được cập nhật',
      statusCode: HttpStatus.NO_CONTENT,
      item: null,
    };
  }
}
