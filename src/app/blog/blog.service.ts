import { Blog } from '@/common/models';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class BlogService {
  constructor(@InjectRepository(Blog) private readonly blogRepository: Repository<Blog>) {}
}
