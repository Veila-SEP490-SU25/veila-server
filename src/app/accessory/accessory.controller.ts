import { ItemResponse, ListResponse } from '@/common/base';
import { Accessory, UserRole } from '@/common/models';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
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
import { AccessoryService } from '@/app/accessory/accessory.service';
import { CUAccessoryDto, ItemAccessoryDto } from '@/app/accessory/accessory.dto';
import { plainToInstance } from 'class-transformer';
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

@Controller('accessories')
@ApiTags('Accessory Controller')
@ApiBearerAuth()
@ApiExtraModels(ListResponse, ItemResponse, Accessory, ItemAccessoryDto)
export class AccessoryController {
  constructor(private readonly accessoryService: AccessoryService) {}

  @Get(':id')
  @ApiOperation({})
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            item: { $ref: getSchemaPath(ItemAccessoryDto) },
          },
        },
      ],
    },
  })
  async getAccessoryForCustomer(@Param('id') id: string): Promise<ItemResponse<ItemAccessoryDto>> {
    const accessory = await this.accessoryService.getAccessoryForCustomer(id);
    const dto = plainToInstance(ItemAccessoryDto, accessory);
    return {
      message: 'Đây là thông tin chi tiết của phụ kiện',
      statusCode: HttpStatus.OK,
      item: dto,
    };
  }

  @Get('me')
  @UseGuards(AuthGuard)
  @Roles(UserRole.SHOP)
  @ApiOperation({})
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
            item: { $ref: getSchemaPath(Accessory) },
          },
        },
      ],
    },
  })
  async getAccessoriesForOwner(
    @UserId() userId: string,
    @PaginationParams() { page, size, limit, offset }: Pagination,
    @SortingParams(['name', 'sellPrice', 'rentalPrice']) sort?: Sorting,
    @FilteringParams(['name', 'sellPrice', 'rentalPrice', 'isSellable', 'isRentable', 'status'])
    filter?: Filtering,
  ): Promise<ListResponse<Accessory>> {
    const [accessories, totalItems] = await this.accessoryService.getAccessoriesForOwner(
      userId,
      limit,
      offset,
      sort,
      filter,
    );
    const totalPages = Math.ceil(totalItems / size);
    return {
      message: 'Đây là danh sách phụ kiện của bạn',
      statusCode: HttpStatus.OK,
      pageIndex: page,
      pageSize: size,
      totalItems,
      totalPages,
      hasNextPage: page + 1 < totalPages,
      hasPrevPage: 0 < page,
      items: accessories,
    };
  }

  @Get(':id/me')
  @UseGuards(AuthGuard)
  @Roles(UserRole.SHOP)
  @ApiOperation({})
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            item: { $ref: getSchemaPath(Accessory) },
          },
        },
      ],
    },
  })
  async getAccessoryForOwner(
    @UserId() userId: string,
    @Param('id') id: string,
  ): Promise<ItemResponse<Accessory>> {
    const accessory = await this.accessoryService.getAccessoryForOwner(userId, id);
    return {
      message: 'Đây là thông tin chi tiết của phụ kiện',
      statusCode: HttpStatus.OK,
      item: accessory,
    };
  }

  @Post('me')
  @UseGuards(AuthGuard)
  @Roles(UserRole.SHOP)
  @ApiOperation({})
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            item: { $ref: getSchemaPath(Accessory) },
          },
        },
      ],
    },
  })
  async createAccessoryForOwner(
    @UserId() userId: string,
    @Body() newAccessory: CUAccessoryDto,
  ): Promise<ItemResponse<Accessory>> {
    const accessory = await this.accessoryService.createAccessoryForOwner(userId, newAccessory);
    return {
      message: 'Tạo thành công phụ kiện mới',
      statusCode: HttpStatus.CREATED,
      item: accessory,
    };
  }

  @Put(':id/me')
  @UseGuards(AuthGuard)
  @Roles(UserRole.SHOP)
  @ApiOperation({})
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
  async updateAccessoryForOwner(
    @UserId() userId: string,
    @Param('id') id: string,
    @Body() body: CUAccessoryDto,
  ): Promise<ItemResponse<null>> {
    const result = await this.accessoryService.updateAccessoryForOwner(userId, id, body);
    return result === 1
      ? {
          message: 'Phụ kiện đã được cập nhật',
          statusCode: HttpStatus.NO_CONTENT,
          item: null,
        }
      : {
          message: 'Phụ kiện cập nhật không thành công, kiểm tra log lỗi',
          statusCode: HttpStatus.BAD_REQUEST,
          item: null,
        };
  }

  @Delete(':id/me')
  @UseGuards(AuthGuard)
  @Roles(UserRole.SHOP)
  @ApiOperation({})
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
  async removeAccessoryForOwner(@UserId() userId: string, @Param('id') id: string) {
    const result = await this.accessoryService.removeAccessoryForOwner(userId, id);
    return result === 1
      ? {
          message: 'Phụ kiện đã được xóa',
          statusCode: HttpStatus.NO_CONTENT,
          item: null,
        }
      : {
          message: 'Phụ kiện xóa không thành công, kiểm tra log lỗi',
          statusCode: HttpStatus.BAD_REQUEST,
          item: null,
        };
  }

  @Patch(':id/me')
  @UseGuards(AuthGuard)
  @Roles(UserRole.SHOP)
  @ApiOperation({})
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
  async restoreAccessoryForOwner(@UserId() userId: string, @Param('id') id: string) {
    const result = await this.accessoryService.restoreAccessoryForOwner(userId, id);
    return result === 1
      ? {
          message: 'Phụ kiện đã được khôi phục',
          statusCode: HttpStatus.NO_CONTENT,
          item: null,
        }
      : {
          message: 'Phụ kiện khôi phục không thành công, kiểm tra log lỗi',
          statusCode: HttpStatus.BAD_REQUEST,
          item: null,
        };
  }
}
