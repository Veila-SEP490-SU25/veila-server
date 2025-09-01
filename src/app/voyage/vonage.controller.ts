import { SendMessageDto } from '@/app/voyage/vonage.dto';
import { VonageService } from '@/app/voyage/vonage.service';
import { ItemResponse } from '@/common/base';
import { UserId } from '@/common/decorators';
import { AuthGuard } from '@/common/guards';
import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';

@Controller('vonage')
@ApiTags('Vonage Controller')
@ApiExtraModels(ItemResponse)
export class VonageController {
  constructor(private readonly vonageService: VonageService) {}

  @Post('send-sms')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Send SMS via Vonage',
    description: 'Sends an SMS message using the Vonage service.',
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            item: { type: 'boolean', example: true },
          },
        },
      ],
    },
  })
  async sendSMS(
    @UserId() userId: string,
    @Body() body: SendMessageDto,
  ): Promise<ItemResponse<boolean>> {
    const res = await this.vonageService.sendSMS(userId, body.to);
    return {
      message: 'Kết quả gửi SMS',
      statusCode: HttpStatus.OK,
      item: res,
    };
  }
}
