import { CancelPenaltyDto, DelayPenaltyDto } from '@/app/appsetting/appsetting.dto';
import { AppSettingService } from '@/app/appsetting/appsetting.service';
import { CUMilestoneTemplateDto } from '@/app/appsetting/appsetting.dto';
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
import { UserRole } from '@/common/models';
import { ComplaintReason, MilestoneTemplate, MilestoneTemplateType } from '@/common/models/single';
import { AppSetting } from '@/common/models/single/appsetting.model';
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
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { CUComplaintReason } from '@/app/complaint';

@Controller('app-settings')
@UseGuards(AuthGuard)
@ApiTags('App Settings Controller')
@ApiBearerAuth()
@ApiExtraModels(ItemResponse, AppSetting, ListResponse, MilestoneTemplate, Number, ComplaintReason)
@Roles(UserRole.STAFF, UserRole.ADMIN, UserRole.SUPER_ADMIN)
export class AppSettingController {
  constructor(private readonly appSettingService: AppSettingService) {}

  @Get()
  @ApiOperation({ summary: 'Get application settings' })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            item: { $ref: getSchemaPath(AppSetting) },
          },
        },
      ],
    },
  })
  async getAppSettings(): Promise<ItemResponse<AppSetting>> {
    const setting = await this.appSettingService.getAppSetting();
    return {
      message: 'App settings retrieved successfully',
      statusCode: 200,
      item: setting,
    } as ItemResponse<AppSetting>;
  }

  @Get('delay-penalty')
  @ApiOperation({ summary: 'Get delay penalty' })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            item: { $ref: getSchemaPath(Number) },
          },
        },
      ],
    },
  })
  async getDelayPenalty(): Promise<ItemResponse<number>> {
    const penalty = await this.appSettingService.getDelayPenalty();
    return {
      message: 'Delay penalty retrieved successfully',
      statusCode: 200,
      item: penalty,
    } as ItemResponse<number>;
  }

  @Post('delay-penalty')
  @ApiOperation({ summary: 'Set delay penalty' })
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
  async setDelayPenalty(@Body() body: DelayPenaltyDto): Promise<ItemResponse<null>> {
    await this.appSettingService.setDelayPenalty(body.penalty);
    return {
      message: 'Delay penalty updated successfully',
      statusCode: 200,
      item: null,
    } as ItemResponse<null>;
  }

  @Get('cancel-penalty')
  @ApiOperation({ summary: 'Get cancel penalty' })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            item: { $ref: getSchemaPath(Number) },
          },
        },
      ],
    },
  })
  async getCancelPenalty(): Promise<ItemResponse<number>> {
    const penalty = await this.appSettingService.getCancelPenalty();
    return {
      message: 'Cancel penalty retrieved successfully',
      statusCode: 200,
      item: penalty,
    } as ItemResponse<number>;
  }

  @Post('cancel-penalty')
  @ApiOperation({ summary: 'Set cancel penalty' })
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
  async setCancelPenalty(@Body() body: CancelPenaltyDto): Promise<ItemResponse<null>> {
    await this.appSettingService.setCancelPenalty(body.penalty);
    return {
      message: 'Cancel penalty updated successfully',
      statusCode: 200,
      item: null,
    } as ItemResponse<null>;
  }

  @Get('days-to-complaint')
  @ApiOperation({ summary: 'Get days to complaint' })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            item: { $ref: getSchemaPath(Number) },
          },
        },
      ],
    },
  })
  async getDaysToComplaint(): Promise<ItemResponse<number>> {
    const days = await this.appSettingService.getDaysToComplaint();
    return {
      message: 'Days to complaint retrieved successfully',
      statusCode: 200,
      item: days,
    } as ItemResponse<number>;
  }

  @Post('days-to-complaint')
  @ApiOperation({ summary: 'Set days to complaint' })
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
  async setDaysToComplaint(@Body() body: { days: number }): Promise<ItemResponse<null>> {
    await this.appSettingService.setDaysToComplaint(body.days);
    return {
      message: 'Days to complaint updated successfully',
      statusCode: 200,
      item: null,
    } as ItemResponse<null>;
  }

  @Get('days-to-review-update-request')
  @ApiOperation({ summary: 'Get days to review update request' })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            item: { $ref: getSchemaPath(Number) },
          },
        },
      ],
    },
  })
  async getDaysToReviewUpdateRequest(): Promise<ItemResponse<number>> {
    const days = await this.appSettingService.getDaysToReviewUpdateRequest();
    return {
      message: 'Days to review update request retrieved successfully',
      statusCode: 200,
      item: days,
    } as ItemResponse<number>;
  }

  @Post('days-to-review-update-request')
  @ApiOperation({ summary: 'Set days to review update request' })
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
  async setDaysToReviewUpdateRequest(@Body() body: { days: number }): Promise<ItemResponse<null>> {
    await this.appSettingService.setDaysToReviewUpdateRequest(body.days);
    return {
      message: 'Days to review update request updated successfully',
      statusCode: 200,
      item: null,
    } as ItemResponse<null>;
  }

  @Get('milestone-templates/:type')
  @ApiOperation({
    summary: 'Get all milestone templates',
    description: 'Api lẻ',
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            item: {
              type: 'array',
              items: { $ref: getSchemaPath(MilestoneTemplate) },
            },
          },
        },
      ],
    },
  })
  async getMilestoneTemplates(
    @Param('type') type: MilestoneTemplateType,
  ): Promise<ItemResponse<MilestoneTemplate[]>> {
    const templates = await this.appSettingService.getMilestoneTemplatesByType(type);
    return {
      message: 'Get milestone templates successfully',
      statusCode: HttpStatus.OK,
      item: templates,
    };
  }

  @Post('milestone-templates')
  @ApiOperation({
    summary: 'Add a new milestone template',
    description: 'Api lẻ',
  })
  @ApiCreatedResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            item: {
              $ref: getSchemaPath(MilestoneTemplate),
            },
          },
        },
      ],
    },
  })
  async addMilestoneTemplate(
    @Body() body: CUMilestoneTemplateDto,
  ): Promise<ItemResponse<MilestoneTemplate>> {
    const template = await this.appSettingService.addMilestoneTemplate(body);
    return {
      message: 'Add milestone template successfully',
      statusCode: HttpStatus.CREATED,
      item: template,
    };
  }

  @Put('milestone-templates/:id')
  @ApiOperation({
    summary: 'Update a milestone template',
    description: 'Api lẻ',
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            item: {
              example: null,
            },
          },
        },
      ],
    },
  })
  async updateMilestoneTemplate(
    @Param('id') id: string,
    @Body() body: CUMilestoneTemplateDto,
  ): Promise<ItemResponse<null>> {
    await this.appSettingService.updateMilestoneTemplate(id, body);
    return {
      message: 'Update milestone template successfully',
      statusCode: HttpStatus.OK,
      item: null,
    };
  }

  @Delete('milestone-templates/:type')
  @ApiOperation({
    summary: 'Remove a milestone template',
    description: 'Api lẻ',
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            item: {
              example: null,
            },
          },
        },
      ],
    },
  })
  async removeMilestoneTemplate(
    @Param('type') type: MilestoneTemplateType,
  ): Promise<ItemResponse<null>> {
    await this.appSettingService.removeMilestoneTemplate(type);
    return {
      message: 'Remove milestone template successfully',
      statusCode: HttpStatus.OK,
      item: null,
    };
  }

  @Get('complaint-reasons')
  @ApiOperation({
    summary: 'Lấy danh sách lý do khiếu nại',
    description: `
          **Hướng dẫn sử dụng:**
  
          - Sử dụng phân trang với các tham số \`page\`, \`size\`, \`sort\`, \`filter\`.
          - \`page\`: Trang hiện tại (bắt đầu từ 0).
          - \`size\`: Số lượng mục mỗi trang.
          - \`sort\`: Trường sắp xếp, ví dụ: \`createdAt:asc\`.
          - \`filter\`: Điều kiện lọc, ví dụ: \`status:IN_PROGRESS\`.
          - Trả về danh sách lý do khiếu nại với các thông tin như mã, mô tả.
          - Page bắt đầu từ 0
          - Sort theo format: [tên_field]:[asc/desc]
          - Các trường có thể lọc: code
          - Filter theo format: [tên_field]:[isnull|isnotnull]
          - Các trường có thể sắp xếp: createdAt, updatedAt, code
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
            item: { $ref: getSchemaPath(ComplaintReason) },
          },
        },
      ],
    },
  })
  async getComplaintReasons(
    @PaginationParams() { page, size, limit, offset }: Pagination,
    @SortingParams(['createdAt', 'updatedAt', 'code']) sort?: Sorting[],
    @FilteringParams(['code']) filter?: Filtering[],
  ): Promise<ListResponse<ComplaintReason>> {
    const [reasons, totalItems] = await this.appSettingService.getComplaintReasons(
      limit,
      offset,
      sort,
      filter,
    );
    const totalPages = Math.ceil(totalItems / size);
    return {
      message: 'Danh sách lý do khiếu nại',
      statusCode: HttpStatus.OK,
      pageIndex: page,
      pageSize: size,
      totalItems,
      totalPages,
      hasNextPage: page < totalPages - 1,
      hasPrevPage: page > 0,
      items: reasons,
    };
  }

  @Post('complaint-reasons')
  @UseGuards(AuthGuard)
  @Roles(UserRole.STAFF, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary: 'Tạo lý do khiếu nại',
    description: `
          **Hướng dẫn sử dụng:**
  
          - Truyền dữ liệu tạo mới trong body.
          - Các trường bắt buộc: \`code\`, \`description\`.
          - Nếu không tìm thấy lý do khiếu nại sẽ trả về lỗi.
          - Trả về thông tin chi tiết của lý do khiếu nại đã tạo.
      `,
  })
  @ApiCreatedResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            item: { $ref: getSchemaPath(ComplaintReason) },
          },
        },
      ],
    },
  })
  async createComplaintReason(
    @Body() body: CUComplaintReason,
  ): Promise<ItemResponse<ComplaintReason>> {
    const reason = await this.appSettingService.createComplaintReason(body);
    return {
      message: 'Tạo lý do khiếu nại thành công',
      statusCode: HttpStatus.CREATED,
      item: reason,
    };
  }

  @Put('complaint-reasons/:id')
  @UseGuards(AuthGuard)
  @Roles(UserRole.STAFF, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary: 'Cập nhật lý do khiếu nại',
    description: `
          **Hướng dẫn sử dụng:**
  
          - Truyền \`id\` của lý do khiếu nại trên URL.
          - Truyền dữ liệu cập nhật trong body.
          - Các trường bắt buộc: \`code\`, \`description\`.
          - Nếu không tìm thấy lý do khiếu nại sẽ trả về lỗi.
          - Trả về thông tin chi tiết của lý do khiếu nại đã cập nhật.
      `,
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            item: { $ref: getSchemaPath(ComplaintReason) },
          },
        },
      ],
    },
  })
  async updateComplaintReason(
    @Param('id') id: string,
    @Body() body: CUComplaintReason,
  ): Promise<ItemResponse<null>> {
    await this.appSettingService.updateComplaintReason(id, body);
    return {
      message: 'Cập nhật lý do khiếu nại thành công',
      statusCode: HttpStatus.OK,
      item: null,
    };
  }

  @Delete('complaint-reasons/:id')
  @UseGuards(AuthGuard)
  @Roles(UserRole.STAFF, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary: 'Xóa lý do khiếu nại',
    description: `
          **Hướng dẫn sử dụng:**
  
          - Truyền \`id\` của lý do khiếu nại trên URL.
          - Nếu không tìm thấy lý do khiếu nại sẽ trả về lỗi.
          - Trả về thông tin chi tiết của lý do khiếu nại đã xóa.
      `,
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            item: { $ref: getSchemaPath(ComplaintReason) },
          },
        },
      ],
    },
  })
  async deleteComplaintReason(@Param('id') id: string): Promise<ItemResponse<null>> {
    await this.appSettingService.deleteComplaintReason(id);
    return {
      message: 'Xóa lý do khiếu nại thành công',
      statusCode: HttpStatus.OK,
      item: null,
    };
  }
}
