import { Controller, Delete, Get, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { ServiceService } from '@/app/service/service.service';
import { ItemResponse, ListResponse } from '@/common/base';
import { Service, UserRole } from '@/common/models';
import { AuthGuard } from '@/common/guards';
import { Roles } from '@/common/decorators';

@Controller('services')
@ApiTags('Service Controller')
@ApiExtraModels(ItemResponse, ListResponse, Service)
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Get()
  async getServicesForCustomer() {}

  @Get(':id')
  async getServiceForCustomer() {}

  @Get('me')
  @UseGuards(AuthGuard)
  @Roles(UserRole.SHOP)
  async getServicesForOwner() {}

  @Get(':id/me')
  @UseGuards(AuthGuard)
  @Roles(UserRole.SHOP)
  async getServiceForOwner() {}

  @Post('me')
  @UseGuards(AuthGuard)
  @Roles(UserRole.SHOP)
  async createServiceForOwner() {}

  @Put(':id/me')
  @UseGuards(AuthGuard)
  @Roles(UserRole.SHOP)
  async updateServiceForOwner() {}

  @Delete(':id/me')
  @UseGuards(AuthGuard)
  @Roles(UserRole.SHOP)
  async removeServiceForOwner() {}

  @Patch(':id/me')
  @UseGuards(AuthGuard)
  @Roles(UserRole.SHOP)
  async restoreServiceForOwner() {}
}
