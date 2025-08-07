import { CUUpdateRequestDto } from '@/app/update-request/update-request.dto';
import { UpdateRequestService } from '@/app/update-request/update-request.service';
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
import { UpdateRequest, UserRole } from '@/common/models';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
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

@Controller('update-requests')
@ApiTags('Update Requests Controller')
@ApiBearerAuth()
@ApiExtraModels(ListResponse, ItemResponse, UpdateRequest)
export class UpdateRequestController {
  constructor(private readonly updateRequestService: UpdateRequestService) {}

  @Post('me')
  @UseGuards(AuthGuard)
  @Roles(UserRole.CUSTOMER)
  @ApiOperation({
    summary: 'Khách hàng tạo yêu cầu cập nhật',
    description: `Hướng dẫn:
        1. Gửi yêu cầu POST đến /update-requests/me với body chứa thông tin yêu cầu cập nhật.
        2. Body yêu cầu phải bao gồm các trường bắt buộc như requestId, title, description và các trường khác nếu cần.
        3. Trả về thông tin yêu cầu cập nhật đã tạo thành công.`,
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            item: {
              $ref: getSchemaPath(UpdateRequest),
            },
          },
        },
      ],
    },
  })
  async createUpdateRequestForCustomer(
    @UserId() userId: string,
    @Body() body: CUUpdateRequestDto,
  ): Promise<ItemResponse<UpdateRequest>> {
    const updateRequest = await this.updateRequestService.createUpdateRequestForCustomer(
      userId,
      body,
    );
    return {
      message: 'Update request created successfully',
      statusCode: HttpStatus.CREATED,
      item: updateRequest,
    };
  }

  @Get(':id/update/me')
  @UseGuards(AuthGuard)
  @Roles(UserRole.CUSTOMER)
  @ApiOperation({
    summary: 'Lấy danh sách yêu cầu cập nhật của khách hàng',
    description: `Hướng dẫn:
        1. Gửi yêu cầu GET đến /update-requests/:id/update/me với id là ID của yêu cầu.
        2. Có thể sử dụng các query params để phân trang, sắp xếp và lọc kết quả.
        3. Trả về danh sách các yêu cầu cập nhật liên quan đến yêu cầu đó.
        4. Page bắt đầu từ 0, size là số lượng mỗi trang
        5. Sort là chuỗi theo định dạng "property:direction", ví dụ: "title:asc" hoặc "createdAt:desc".
        6. Filter là chuỗi theo định dạng "property:rule:value", ví dụ: "title:like:%keyword%"
        7. Các trường có thể sắp xếp bao gồm: title, createdAt, status.
        8. Các trường có thể lọc bao gồm: title, status.`,
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
    description: 'Sắp xếp theo trường, ví dụ: title:asc',
  })
  @ApiQuery({
    name: 'filter',
    required: false,
    type: String,
    description: 'Lọc theo trường, ví dụ: title:like:',
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ListResponse) },
        {
          properties: {
            items: {
              type: 'array',
              items: { $ref: getSchemaPath(UpdateRequest) },
            },
          },
        },
      ],
    },
  })
  async getUpdateRequestsForCustomer(
    @UserId() userId: string,
    @Param('id') requestId: string,
    @PaginationParams() { page, size, limit, offset }: Pagination,
    @SortingParams(['title', 'createdAt', 'status']) sort?: Sorting,
    @FilteringParams(['title', 'status']) filter?: Filtering,
  ): Promise<ListResponse<UpdateRequest>> {
    const [updateRequests, totalItems] =
      await this.updateRequestService.getUpdateRequestsForCustomer(
        userId,
        requestId,
        limit,
        offset,
        sort,
        filter,
      );
    const totalPages = Math.ceil(totalItems / size);
    return {
      message: 'Update requests retrieved successfully',
      statusCode: HttpStatus.OK,
      pageIndex: page,
      pageSize: size,
      totalItems,
      totalPages,
      hasNextPage: page + 1 < totalPages,
      hasPrevPage: page > 0,
      items: updateRequests,
    };
  }

  @Get(':updateId/me')
  @UseGuards(AuthGuard)
  @Roles(UserRole.CUSTOMER)
  @ApiOperation({
    summary: 'Lấy thông tin yêu cầu cập nhật của khách hàng',
    description: `Hướng dẫn:
        1. Gửi yêu cầu GET đến /update-requests/:updateId/me với updateId là ID của yêu cầu cập nhật.
        2. Trả về thông tin chi tiết của yêu cầu cập nhật.`,
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            item: { $ref: getSchemaPath(UpdateRequest) },
          },
        },
      ],
    },
  })
  async getUpdateRequestForCustomer(
    @UserId() userId: string,
    @Param('updateId') id: string,
  ): Promise<ItemResponse<UpdateRequest>> {
    const updateRequest = await this.updateRequestService.getUpdateRequestForCustomer(userId, id);
    return {
      message: 'Update request retrieved successfully',
      statusCode: HttpStatus.OK,
      item: updateRequest,
    };
  }

  @Put(':updateId/me')
  @UseGuards(AuthGuard)
  @Roles(UserRole.CUSTOMER)
  @ApiOperation({
    summary: 'Cập nhật yêu cầu cập nhật của khách hàng',
    description: `Hướng dẫn:
        1. Gửi yêu cầu PUT đến /update-requests/:updateId/me với updateId là ID của yêu cầu cập nhật.
        2. Body yêu cầu phải bao gồm các trường cần cập nhật.
        3. Trả về thông báo thành công.`,
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            item: { $ref: getSchemaPath(UpdateRequest) },
          },
        },
      ],
    },
  })
  async updateUpdateRequestForCustomer(
    @UserId() userId: string,
    @Param('updateId') id: string,
    @Body() body: CUUpdateRequestDto,
  ): Promise<ItemResponse<null>> {
    await this.updateRequestService.updateUpdateRequestForCustomer(userId, id, body);
    return {
      message: 'Update request updated successfully',
      statusCode: HttpStatus.NO_CONTENT,
      item: null,
    };
  }

  @Delete(':updateId/me')
  @UseGuards(AuthGuard)
  @Roles(UserRole.CUSTOMER)
  @ApiOperation({
    summary: 'Xóa yêu cầu cập nhật của khách hàng',
    description: `Hướng dẫn:
        1. Gửi yêu cầu DELETE đến /update-requests/:updateId/me với updateId là ID của yêu cầu cập nhật.
        2. Trả về thông báo thành công.`,
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
  async deleteUpdateRequestForCustomer(
    @UserId() userId: string,
    @Param('updateId') id: string,
  ): Promise<ItemResponse<null>> {
    await this.updateRequestService.deleteUpdateRequestForCustomer(userId, id);
    return {
      message: 'Update request deleted successfully',
      statusCode: HttpStatus.NO_CONTENT,
      item: null,
    };
  }
}
