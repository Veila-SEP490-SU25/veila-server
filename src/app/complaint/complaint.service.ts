import { Filtering, getOrder, getWhere, Sorting } from '@/common/decorators';
import { Complaint } from '@/common/models';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ComplaintService {
  constructor(
    @InjectRepository(Complaint)
    private readonly complaintRepository: Repository<Complaint>,
  ) {}

  async getComplaintsForStaff(
    take: number,
    skip: number,
    sort?: Sorting,
    filter?: Filtering,
  ): Promise<[Complaint[], number]> {
    const dynamicFilter = getWhere(filter);
    const where = {
      ...dynamicFilter,
    };
    const order = getOrder(sort);

    return await this.complaintRepository.findAndCount({
      where,
      order,
      take,
      skip,
      withDeleted: true,
      relations: {
        sender: true,
        order: true,
      },
    });
  }

  async getComplaintForStaff(id: string): Promise<Complaint> {
    const complaint = await this.complaintRepository.findOne({
      where: { id },
      relations: {
        sender: true,
        order: true,
      },
      withDeleted: true,
    });
    if (!complaint) throw new NotFoundException('Không tìm thấy khiếu nại nào phù hợp');
    return complaint;
  }
}
