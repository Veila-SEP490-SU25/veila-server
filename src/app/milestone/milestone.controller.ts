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
import { Roles, Sorting, SortingParams, UserId } from '@/common/decorators';
import { createMilestoneRequestDto, CUMilestoneDto, milestoneDto as MilestoneDto } from './milestone.dto';
import { Milestone, MilestoneStatus, UserRole } from '@/common/models';

@Controller('milestones')
@ApiTags('Milestone Controller')
@ApiBearerAuth()
@ApiExtraModels(ItemResponse, ListResponse, MilestoneDto, Milestone)
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

  @Put(':id/status')
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
