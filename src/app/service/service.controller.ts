import { Controller } from '@nestjs/common';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { ServiceService } from '@/app/service/service.service';
import { ItemResponse, ListResponse } from '@/common/base';
import { Service } from '@/common/models';

@Controller('services')
@ApiTags('Service Controller')
@ApiExtraModels(ItemResponse, ListResponse, Service)
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}
}
