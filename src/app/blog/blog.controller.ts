import { ItemResponse, ListResponse } from '@/common/base';
import { Blog, UserRole } from '@/common/models';
import { Controller, Delete, Get, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { BlogService } from './blog.service';
import { AuthGuard } from '@/common/guards';
import { Roles } from '@/common/decorators';

@Controller('blogs')
@ApiTags('Blog Controller')
@ApiExtraModels(ItemResponse, ListResponse, Blog)
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get()
  async getBlogsForCustomer() {}

  @Get(':id')
  async getBlogForCustomer() {}

  @Get('me')
  @UseGuards(AuthGuard)
  @Roles(UserRole.SHOP)
  async getBlogsForOwner() {}

  @Get(':id/me')
  @UseGuards(AuthGuard)
  @Roles(UserRole.SHOP)
  async getBlogForOwner() {}

  @Post('me')
  @UseGuards(AuthGuard)
  @Roles(UserRole.SHOP)
  async createBlogForOwner() {}

  @Put(':id/me')
  @UseGuards(AuthGuard)
  @Roles(UserRole.SHOP)
  async updateBlogForOwner() {}

  @Delete(':id/me')
  @UseGuards(AuthGuard)
  @Roles(UserRole.SHOP)
  async removeBlogForOwner() {}

  @Patch(':id/me')
  @UseGuards(AuthGuard)
  @Roles(UserRole.SHOP)
  async restoreBlogForOwner() {}
}
