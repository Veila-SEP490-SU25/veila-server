import { ItemResponse, ListResponse } from '@/common/base';
import { Blog } from '@/common/models';
import { Controller } from '@nestjs/common';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { BlogService } from './blog.service';

@Controller('blogs')
@ApiTags('Blog Controller')
@ApiExtraModels(ItemResponse, ListResponse, Blog)
export class BlogController {
  constructor(private readonly blogService: BlogService) {}
}
