import { CUMilestoneTemplateDto, CUSlideDto } from '@/app/single/single.dto';
import { ComplaintReason, Slide } from '@/common/models/single';
import {
  MilestoneTemplate,
  MilestoneTemplateType,
} from '@/common/models/single/milestone-template.model';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SingleService {
  constructor(
    @InjectRepository(Slide)
    private readonly slideRepository: Repository<Slide>,
    @InjectRepository(MilestoneTemplate)
    private readonly milestoneTemplateRepository: Repository<MilestoneTemplate>,
    @InjectRepository(ComplaintReason)
    private readonly complaintReasonRepository: Repository<ComplaintReason>,
  ) {}

  async addMilestoneTemplate(data: CUMilestoneTemplateDto): Promise<MilestoneTemplate> {
    const milestones = await this.getMilestoneTemplatesByType(data.type);
    const sorted = milestones.sort((a, b) => a.index - b.index);
    const lastIndex = sorted[sorted.length - 1]?.index || 0;
    const newMilestone = {
      ...data,
      index: lastIndex + 1,
    };
    return await this.milestoneTemplateRepository.save(newMilestone);
  }

  async updateMilestoneTemplate(id: string, data: CUMilestoneTemplateDto): Promise<void> {
    await this.milestoneTemplateRepository.update(id, data);
  }

  async removeMilestoneTemplate(type: MilestoneTemplateType): Promise<void> {
    const milestones = await this.getMilestoneTemplatesByType(type);
    const sorted = milestones.sort((a, b) => a.index - b.index);
    const lastMilestone = sorted[sorted.length - 1];
    await this.milestoneTemplateRepository.delete(lastMilestone.id);
  }

  async createComplaintReason(data: ComplaintReason): Promise<ComplaintReason> {
    return await this.complaintReasonRepository.save(data);
  }

  async getComplaintReasons(): Promise<ComplaintReason[]> {
    return await this.complaintReasonRepository.find();
  }

  async getMilestoneTemplates(): Promise<MilestoneTemplate[]> {
    return await this.milestoneTemplateRepository.find();
  }

  async getMilestoneTemplatesByType(
    milestoneTemplateType: MilestoneTemplateType,
  ): Promise<MilestoneTemplate[]> {
    return this.milestoneTemplateRepository.find({
      where: { type: milestoneTemplateType },
      order: { index: 'ASC' },
    });
  }

  async createMilestoneTemplate(data: MilestoneTemplate): Promise<MilestoneTemplate> {
    return await this.milestoneTemplateRepository.save(data);
  }

  async getSlides(): Promise<Slide[]> {
    return await this.slideRepository.find({
      withDeleted: true,
    });
  }

  async getSlideById(id: string): Promise<Slide> {
    const slide = await this.slideRepository.findOne({
      where: { id },
      withDeleted: true,
    });
    if (!slide) throw new NotFoundException(`Slide with id ${id} not found`);
    return slide;
  }

  async createSlide(body: CUSlideDto): Promise<Slide> {
    return await this.slideRepository.save({ ...body });
  }

  async updateSlide(id: string, body: CUSlideDto): Promise<void> {
    const slide = await this.getSlideById(id);
    await this.slideRepository.update(slide.id, {
      ...body,
    });
  }

  async deleteSlide(id: string): Promise<void> {
    const slide = await this.getSlideById(id);
    await this.slideRepository.softDelete(slide.id);
  }

  async restoreSlide(id: string): Promise<void> {
    const slide = await this.getSlideById(id);
    await this.slideRepository.restore(slide.id);
  }
}
