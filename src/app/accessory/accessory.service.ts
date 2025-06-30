import { Accessory } from '@/common/models';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AccessoryService {
  constructor(
    @InjectRepository(Accessory) private readonly accessoryRepository: Repository<Accessory>,
  ) {}
}
