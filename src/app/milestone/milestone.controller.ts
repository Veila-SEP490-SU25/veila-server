import { ItemResponse, ListResponse } from '@/common/base';
import { MilestoneService } from './milestone.service';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
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
import {
  createMilestoneRequestDto,
  CUMilestoneDto,
  milestoneDto as MilestoneDto,
} from './milestone.dto';
import { Milestone, MilestoneStatus, UserRole } from '@/common/models';
import { TaskDto } from '@/app/task';

@Controller('milestones')
@ApiTags('Milestone Controller')
@ApiBearerAuth()
@ApiExtraModels(ItemResponse, ListResponse, MilestoneDto, Milestone, TaskDto)
export class MilestoneController {
  constructor(private readonly milestoneService: MilestoneService) {}

  @Get()
  @UseGuards(AuthGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF, UserRole.SHOP, UserRole.CUSTOMER)
  @ApiOperation({
    summary: 'Lấy danh sách mốc công việc với sắp xếp tăng dần (All role trừ guest)',
    description: `
            **Hướng dẫn sử dụng:**
            
            - Trả về danh sách mốc công việc (tất cả các trạng thái)
            - Hỗ trợ sắp xếp theo index tăng dần
            - Sort theo format (theo trường index): [tên_field]:[asc/desc]
        `,
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    type: String,
    default: 'index:asc',
    description: 'Sắp xếp theo định dạng: tên_trường:asc|desc. Ví dụ: index:asc (mặc định)',
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ListResponse) },
        {
          properties: {
            items: { $ref: getSchemaPath(MilestoneDto) },
          },
        },
      ],
    },
  })
  async getAllMilestonesForOrder(
    @Query('orderId') orderId: string,
    @SortingParams(['index']) sort?: Sorting,
  ): Promise<ListResponse<MilestoneDto>> {
    const milestones = await this.milestoneService.getAllMilestonesForOrder(orderId, sort);
    return {
      message: 'Danh sách milestone đã sắp xếp tăng dần',
      statusCode: HttpStatus.OK,
      items: milestones,
      pageIndex: 1,
      pageSize: milestones.length,
      totalItems: milestones.length,
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: false,
    };
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF, UserRole.SHOP, UserRole.CUSTOMER)
  @ApiOperation({
    summary: 'Lấy chi tiết mốc công việc với sắp xếp tăng dần (All role trừ guest)',
    description: `
            **Hướng dẫn sử dụng:**
            
            - Trả về chi tiết mốc công việc theo id (tất cả các trạng thái)
            - Hỗ trợ sắp xếp theo index tăng dần
            - Sort theo format (theo trường index): [tên_field]:[asc/desc]
        `,
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            items: { $ref: getSchemaPath(MilestoneDto) },
          },
        },
      ],
    },
  })
  async getMilestoneById(@Param('id') id: string): Promise<ItemResponse<MilestoneDto>> {
    const milestone = await this.milestoneService.getMilestoneById(id);
    return {
      message: 'Đây là thông tin chi tiết mốc công việc',
      statusCode: HttpStatus.OK,
      item: milestone,
    };
  }

  @Get(':id/tasks')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Lấy danh sách công việc theo mốc công việc',
    description: `
            **Hướng dẫn sử dụng:**
            
            - Trả về danh sách công việc theo mốc công việc
            - Hỗ trợ phân trang, sắp xếp và lọc
            - Sắp xếp theo định dạng: [tên_trường]:[asc/desc]. Ví dụ: index:asc
            - Hỗ trợ sắp xếp: index
            - Lọc theo định dạng: [tên_trường]:[toán_tử]:[giá_trị]. Ví dụ: status:like:PENDING
            - Hỗ trợ lọc: status
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
    description: 'Sắp xếp theo trường, ví dụ: index:asc',
  })
  @ApiQuery({
    name: 'filter',
    required: false,
    type: String,
    description: 'Lọc theo trường, ví dụ: status:like:PENDING',
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ListResponse) },
        {
          properties: {
            items: { $ref: getSchemaPath(TaskDto) },
          },
        },
      ],
    },
  })
  async getTasksByMilestoneId(
    @Param('id') id: string,
    @PaginationParams() { page, size, limit, offset }: Pagination,
    @SortingParams(['index']) sort?: Sorting,
    @FilteringParams(['status']) filter?: Filtering,
  ): Promise<ListResponse<TaskDto>> {
    const [items, totalItems] = await this.milestoneService.getTasksByMilestonesId(
      id,
      limit,
      offset,
      sort,
      filter,
    );
    const totalPages = Math.ceil(totalItems / size);
    return {
      message: 'Danh sách công việc theo mốc công việc',
      statusCode: HttpStatus.OK,
      pageIndex: page,
      pageSize: size,
      totalItems,
      totalPages,
      hasNextPage: page < totalPages - 1,
      hasPrevPage: page > 0,
      items,
    };
  }

  @Get(':id/tasks/:taskId')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Lấy thông tin chi tiết công việc theo id và mốc công việc',
    description: `
            **Hướng dẫn sử dụng:**

            - Trả về thông tin chi tiết công việc theo id và mốc công việc
        `,
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            item: { $ref: getSchemaPath(TaskDto) },
          },
        },
      ],
    },
  })
  async getTaskByIdAndMilestoneId(
    @Param('id') id: string,
    @Param('taskId') taskId: string,
  ): Promise<ItemResponse<TaskDto>> {
    const task = await this.milestoneService.getTaskByIdAndMilestoneId(id, taskId);
    return {
      message: 'Thông tin chi tiết công việc',
      statusCode: HttpStatus.OK,
      item: task,
    };
  }

  @Post()
  @UseGuards(AuthGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.SHOP)
  @ApiOperation({
    summary: 'Tạo mốc công việc mới',
    description: `
            **Hướng dẫn sử dụng:**

            - Chỉ có \`SHOP\` (không tính Admin) mới có thể tạo mốc công việc.
            -Truyền dữ liệu mốc công việc trong body theo dạng JSON.
            - Các trường bắt buộc: order_id, title, description, index, status,...
            - Trả về thông tin chi tiết của mốc công việc vừa tạo.
            - MilestoneStatus: PENDING, IN_PROGRESS, COMPLETED, CANCELLED.
        `,
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            item: { $ref: getSchemaPath(Milestone) },
          },
        },
      ],
    },
  })
  async createMilestone(
    @UserId() userId: string,
    @Body() body: createMilestoneRequestDto,
  ): Promise<ItemResponse<Milestone>> {
    const milestone = await this.milestoneService.createMilestone(userId, body);
    return {
      message: 'Mốc công việc được tạo thành công',
      statusCode: HttpStatus.CREATED,
      item: milestone,
    };
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF, UserRole.SHOP)
  @ApiOperation({
    summary: 'Cập nhật thông tin mốc công việc',
    description: `
            **Hướng dẫn sử dụng:**

            - Truyền \`id\` của mốc công việc trên URL.
            - Truyền dữ liệu cập nhật trong body theo dạng JSON.
            - Các trường bắt buộc: \`due_date\`....
            - Nếu không tìm thấy mốc công việc sẽ trả về lỗi.
            - OrderStatus: PENDING, IN_PROGRESS, COMPLETED, CANCELLED
            - Trả về thông tin chi tiết của mốc công việc đã cập nhật.
        `,
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            item: { example: null, $ref: getSchemaPath(Milestone) },
          },
        },
      ],
    },
  })
  async updateMilestone(
    @UserId() userId: string,
    @Param('id') id: string,
    @Body() updateMilestone: CUMilestoneDto,
  ): Promise<ItemResponse<Milestone>> {
    const milestone = await this.milestoneService.updateMilestone(userId, id, updateMilestone);
    return {
      message: 'Mốc công việc đã được cập nhật',
      statusCode: HttpStatus.OK,
      item: milestone,
    };
  }

  @Put(':id/:status')
  @UseGuards(AuthGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF, UserRole.SHOP)
  @ApiOperation({
    summary: 'Cập nhật trạng thái mốc công việc',
    description: `
            **Hướng dẫn sử dụng:**

            - Truyền \`id\` của mốc công việc trên URL.
            - Truyền trạng thái cập nhật mốc công việc trên URL.
            - Nếu không tìm thấy mốc công việc sẽ trả về lỗi.
            - OrderStatus: PENDING, IN_PROGRESS, COMPLETED, CANCELLED
            - Trả về thông tin chi tiết của mốc công việc đã cập nhật.
        `,
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            item: { example: null, $ref: getSchemaPath(Milestone) },
          },
        },
      ],
    },
  })
  async updateMilestoneStatus(
    @UserId() userId: string,
    @Param('id') id: string,
    @Param('status') status: MilestoneStatus,
  ): Promise<ItemResponse<Milestone>> {
    const milestone = await this.milestoneService.updateMilestoneStatus(userId, id, status);
    return {
      message: 'Mốc công việc đã được cập nhật trạng thái thành công',
      statusCode: HttpStatus.OK,
      item: milestone,
    };
  }
}
