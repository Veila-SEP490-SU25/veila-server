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
} from '@/common/decorators';
import { AuthGuard } from '@/common/guards';
import { Complaint, UserRole } from '@/common/models';
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

@Controller('complaints')
@ApiTags('Complaint Controller')
@ApiBearerAuth()
@ApiExtraModels(ListResponse, ItemResponse, Complaint)
export class ComplaintController {
  constructor(private readonly complaintService: ComplaintService) {}

  @Get('staff')
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

  @Get(':id/staff')
  @UseGuards(AuthGuard)
  @Roles(UserRole.STAFF, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({})
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
}
