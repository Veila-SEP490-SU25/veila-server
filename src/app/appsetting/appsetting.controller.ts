import { CancelPenaltyDto } from '@/app/appsetting/appsetting.dto';
import { AppSettingService } from '@/app/appsetting/appsetting.service';
import { ItemResponse } from '@/common/base';
import { Roles } from '@/common/decorators';
import { AuthGuard } from '@/common/guards';
import { UserRole } from '@/common/models';
import { AppSetting } from '@/common/models/single/appsetting.model';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';

@Controller('app-settings')
@UseGuards(AuthGuard)
@ApiTags('App Settings Controller')
@ApiBearerAuth()
@ApiExtraModels(ItemResponse, AppSetting)
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
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
}
