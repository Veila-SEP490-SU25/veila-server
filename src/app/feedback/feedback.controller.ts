import { CUFeedbackDto, ItemFeedbackDto } from '@/app/feedback/feedback.dto';
import { FeedbackService } from '@/app/feedback/feedback.service';
import { ItemResponse, ListResponse } from '@/common/base';
import { Roles, UserId } from '@/common/decorators';
import { AuthGuard } from '@/common/guards';
import { Feedback, UserRole } from '@/common/models';
import { Body, Controller, Get, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

@Controller('feedbacks')
@ApiTags('Feedback Controller')
@ApiBearerAuth()
@ApiExtraModels(ItemResponse, ListResponse, Feedback, ItemFeedbackDto)
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post('me')
  @UseGuards(AuthGuard)
  @Roles(UserRole.CUSTOMER)
  @ApiOperation({
    summary: 'Create feedback for customer',
    description: `**Hướng dẫn sử dụn**
        - Gửi id của order vào orderId
        - Gửi id của sản phẩm (dress, service, accessory) vào productId`,
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        { properties: { item: { $ref: getSchemaPath(Feedback) } } },
      ],
    },
  })
  async createFeedbackForCustomer(
    @UserId() userId: string,
    @Body() body: CUFeedbackDto,
  ): Promise<ItemResponse<Feedback>> {
    const feedback = await this.feedbackService.createFeedbackForCustomer(userId, body);
    return {
      message: 'Feedback created successfully',
      statusCode: HttpStatus.CREATED,
      item: feedback,
    };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get feedback by ID',
    description: `**Hướng dẫn sử dụng**
        - Gửi id của feedback vào param
        - Response bao gồm: 
            + id, content, rating, images, createdAt của feedback
            + id, username, avatar của customer
            + id, name, address, logo, reputation của shop
            + thông tin chi tiết của sản phẩm được đánh giá (dress, service, accessory)`,
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        { properties: { item: { $ref: getSchemaPath(ItemFeedbackDto) } } },
      ],
    },
  })
  async getFeedbackById(@Param('id') id: string): Promise<ItemResponse<ItemFeedbackDto>> {
    const feedback = await this.feedbackService.getFeedbackById(id);
    const dto = await plainToInstance(ItemFeedbackDto, feedback, { excludeExtraneousValues: true });
    return {
      message: 'Feedback retrieved successfully',
      statusCode: HttpStatus.OK,
      item: dto,
    };
  }
}
