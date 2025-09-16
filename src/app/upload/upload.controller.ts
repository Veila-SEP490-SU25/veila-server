import { UploadService } from '@/app/upload/upload.service';
import { ItemResponse } from '@/common/base';
import {
  BadRequestException,
  Controller,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('upload')
@ApiTags('Upload Controller')
@ApiExtraModels(ItemResponse)
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Tải lên một tệp' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Tệp cần tải lên',
        },
      },
      required: ['file'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Tải lên thành công',
    type: ItemResponse<string>,
  })
  async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<ItemResponse<string>> {
    if (!file) throw new BadRequestException('Không tìm thấy tệp để tải lên');
    const fileUrl = this.uploadService.getFileUrl(file.filename);
    return {
      item: fileUrl,
      message: 'Tải tệp lên thành công',
      statusCode: HttpStatus.OK,
    };
  }
}
