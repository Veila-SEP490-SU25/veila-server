import { ContractService } from '@/app/contract/contract.service';
import { ItemResponse } from '@/common/base';
import { Contract, ContractType } from '@/common/models';
import { Controller, Get, HttpStatus } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';

@Controller('contracts')
@ApiTags('Contract Controller')
@ApiExtraModels(ItemResponse, Contract)
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @Get('customer')
  @ApiOperation({
    summary: 'Get Customer Contract',
    description: 'Retrieves the available contract for customers.',
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            item: {
              $ref: getSchemaPath(Contract),
            },
          },
        },
      ],
    },
  })
  async getCustomerContract(): Promise<ItemResponse<Contract>> {
    const contract = await this.contractService.findAvailableContract(ContractType.CUSTOMER);
    return {
      message: 'Customer contract retrieved successfully',
      statusCode: HttpStatus.OK,
      item: contract,
    };
  }

  @Get('shop')
  @ApiOperation({
    summary: 'Get Shop Contract',
    description: 'Retrieves the available contract for shops.',
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            item: {
              $ref: getSchemaPath(Contract),
            },
          },
        },
      ],
    },
  })
  async getShopContract(): Promise<ItemResponse<Contract>> {
    const contract = await this.contractService.findAvailableContract(ContractType.SHOP);
    return {
      message: 'Shop contract retrieved successfully',
      statusCode: HttpStatus.OK,
      item: contract,
    };
  }

  @Get('platform')
  @ApiOperation({
    summary: 'Get Platform Information',
    description: 'Lấy ra thông tin cơ bản của nền tảng',
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            item: {
              $ref: getSchemaPath(Contract),
            },
          },
        },
      ],
    },
  })
  async getPlatformContract(): Promise<ItemResponse<Contract>> {
    const contract = await this.contractService.findAvailableContract(ContractType.PLATFORM);
    return {
      message: 'Lấy thông tin cơ bản của nền tảng thành công',
      statusCode: HttpStatus.OK,
      item: contract,
    };
  }
}
