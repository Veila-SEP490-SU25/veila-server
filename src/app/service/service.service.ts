import { Service } from '@/common/models';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ServiceService {
  constructor(@InjectRepository(Service) private readonly serviceRepository: Repository<Service>) {}
}
