import { Shop } from '@/common/models';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ShopService {
  constructor(@InjectRepository(Shop) private readonly shopRepository: Repository<Shop>) {}
}
