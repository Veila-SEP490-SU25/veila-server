import { CUMilestoneTemplateDto, CUSlideDto } from '@/app/single/single.dto';
import { SingleService } from '@/app/single/single.service';
import { ItemResponse, ListResponse } from '@/common/base';
import { MilestoneTemplate, MilestoneTemplateType, Slide } from '@/common/models/single';
import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Put } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';

@Controller('singles')
@ApiTags('Single Controller')
@ApiExtraModels(ListResponse, ItemResponse, Slide, MilestoneTemplate)
export class SingleController {
  constructor(private readonly singleService: SingleService) {}

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
    const templates = await this.singleService.getMilestoneTemplatesByType(type);
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
    const template = await this.singleService.addMilestoneTemplate(body);
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
    await this.singleService.updateMilestoneTemplate(id, body);
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
    await this.singleService.removeMilestoneTemplate(type);
    return {
      message: 'Remove milestone template successfully',
      statusCode: HttpStatus.OK,
      item: null,
    };
  }

  @Get('slides')
  @ApiOperation({
    summary: 'Get all slides',
    description: 'Api lẻ',
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ListResponse) },
        {
          properties: {
            item: {
              $ref: getSchemaPath(Slide),
            },
          },
        },
      ],
    },
  })
  async getSlides(): Promise<ListResponse<Slide>> {
    const slides = await this.singleService.getSlides();
    return {
      message: 'Get all slides successfully',
      statusCode: HttpStatus.OK,
      pageIndex: 1,
      pageSize: slides.length,
      totalItems: slides.length,
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: false,
      items: slides,
    };
  }

  @Get('slides/:id')
  @ApiOperation({
    summary: 'Get slide by id',
    description: 'Api lẻ',
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            item: {
              $ref: getSchemaPath(Slide),
            },
          },
        },
      ],
    },
  })
  async getSlideById(@Param('id') id: string): Promise<ItemResponse<Slide>> {
    const slide = await this.singleService.getSlideById(id);
    return {
      message: 'Get slide by id successfully',
      statusCode: HttpStatus.OK,
      item: slide,
    };
  }

  @Post('slides')
  @ApiOperation({
    summary: 'Create a new slide',
    description: 'Api lẻ',
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            item: {
              $ref: getSchemaPath(Slide),
            },
          },
        },
      ],
    },
  })
  async createSlide(@Body() body: CUSlideDto): Promise<ItemResponse<Slide>> {
    const slide = await this.singleService.createSlide(body);
    return {
      message: 'Create slide successfully',
      statusCode: HttpStatus.CREATED,
      item: slide,
    };
  }

  @Put('slides/:id')
  @ApiOperation({
    summary: 'Update slide by id',
    description: 'Api lẻ',
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            item: {
              type: 'null',
            },
          },
        },
      ],
    },
  })
  async updateSlide(
    @Param('id') id: string,
    @Body() body: CUSlideDto,
  ): Promise<ItemResponse<null>> {
    await this.singleService.updateSlide(id, body);
    return {
      message: 'Update slide successfully',
      statusCode: HttpStatus.NO_CONTENT,
      item: null,
    };
  }

  @Delete('slides/:id')
  @ApiOperation({
    summary: 'Delete slide by id',
    description: 'Api lẻ',
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            item: {
              type: 'null',
            },
          },
        },
      ],
    },
  })
  async deleteSlide(@Param('id') id: string): Promise<ItemResponse<null>> {
    await this.singleService.deleteSlide(id);
    return {
      message: 'Delete slide successfully',
      statusCode: HttpStatus.NO_CONTENT,
      item: null,
    };
  }

  @Patch('slides/:id')
  @ApiOperation({
    summary: 'Restore slide by id',
    description: 'Api lẻ',
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            item: {
              type: 'null',
            },
          },
        },
      ],
    },
  })
  async restoreSlide(@Param('id') id: string): Promise<ItemResponse<null>> {
    await this.singleService.restoreSlide(id);
    return {
      message: 'Restore slide successfully',
      statusCode: HttpStatus.NO_CONTENT,
      item: null,
    };
  }
}
