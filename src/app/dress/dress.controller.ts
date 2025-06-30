import { ItemResponse, ListResponse } from '@/common/base';
import { Dress } from '@/common/models';
import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { DressService } from '@/app/dress/dress.service';
import {
  Filtering,
  FilteringParams,
  Pagination,
  PaginationParams,
  Sorting,
  SortingParams,
} from '@/common/decorators';
import { ItemDressDto, ListDressDto } from '@/app/dress/dress.dto';

@Controller('dresses')
@ApiTags('Dress Controller')
@ApiBearerAuth()
@ApiExtraModels(ItemResponse, ListResponse, Dress, ListDressDto, ItemDressDto)
export class DressController {
  constructor(private readonly dressService: DressService) {}

  @Get()
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
    description: 'Sắp xếp theo trường, ví dụ: name:asc',
  })
  @ApiQuery({
    name: 'filter',
    required: false,
    type: String,
    description: 'Lọc theo trường, ví dụ: name:like:áo',
  })
  @ApiOperation({})
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ListResponse) },
        {
          properties: {
            item: { $ref: getSchemaPath(ListDressDto) },
          },
        },
      ],
    },
  })
  async getDressesForCustomer(
    @PaginationParams() pagination: Pagination,
    @SortingParams(['name']) sort?: Sorting,
    @FilteringParams(['name']) filter?: Filtering,
  ): Promise<ListResponse<ListDressDto>> {
    return await this.dressService.getDressesForCustomer(pagination, sort, filter);
  }

  @Get(':id')
  @ApiOperation({})
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            item: { $ref: getSchemaPath(ItemDressDto) },
          },
        },
      ],
    },
  })
  async getDressForCustomer(@Param('id') id: string): Promise<ItemResponse<ItemDressDto>> {
    const dress = await this.dressService.getDressForCustomer(id);
    return {
      message: 'Đây là thông tin chi tiết của Váy cưới',
      statusCode: HttpStatus.OK,
      item: dress,
    };
  }
}
