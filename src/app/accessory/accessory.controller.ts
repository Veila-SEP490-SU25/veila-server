import { ItemResponse, ListResponse } from '@/common/base';
import { Accessory } from '@/common/models';
import { Controller, Delete, Get, Patch, Post, Put } from '@nestjs/common';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { AccessoryService } from '@/app/accessory/accessory.service';

@Controller('accessories')
@ApiTags('Accessory Controller')
@ApiExtraModels(ListResponse, ItemResponse, Accessory)
export class AccessoryController {
  constructor(private readonly accessoryService: AccessoryService) {}

  @Get(':id')
  async getAccessoryForCustomer() {}

  @Get('me')
  async getAccessoriesForOwner() {}

  @Get(':id/me')
  async getAccessoryForOwner() {}

  @Post('me')
  async createAccessoryForOwner() {}

  @Put(':id/me')
  async updateAccessoryForOwner() {}

  @Delete(':id/me')
  async removeAccessoryForOwner() {}

  @Patch(':id/me')
  async restoreAccessoryForOwner() {}
}
