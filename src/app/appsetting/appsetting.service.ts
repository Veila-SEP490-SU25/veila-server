import { CUComplaintReason } from '@/app/complaint';
import { CUMilestoneTemplateDto } from '@/app/appsetting/appsetting.dto';
import { Filtering, getOrder, getWhere, Sorting } from '@/common/decorators/paginate.decorator';
import { ComplaintReason, MilestoneTemplate, MilestoneTemplateType } from '@/common/models/single';
import { AppSetting } from '@/common/models/single/appsetting.model';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AppSettingService {
  constructor(
    @InjectRepository(AppSetting)
    private readonly appSettingRepository: Repository<AppSetting>,
    @InjectRepository(ComplaintReason)
    private readonly complaintReasonRepository: Repository<ComplaintReason>,
    @InjectRepository(MilestoneTemplate)
    private readonly milestoneTemplateRepository: Repository<MilestoneTemplate>,
  ) {}

  async getAppSetting(): Promise<AppSetting | null> {
    const settings = await this.appSettingRepository.find();
    return settings[0] || null;
  }

  async createAppSetting(body: AppSetting): Promise<void> {
    await this.appSettingRepository.save(body);
  }

  async getDelayPenalty(): Promise<number> {
    const appSetting = await this.getAppSetting();
    return appSetting?.delayPenalty ?? 0;
  }

  async setDelayPenalty(penalty: number): Promise<void> {
    const appSetting = await this.getAppSetting();
    if (appSetting) {
      appSetting.delayPenalty = penalty;
      await this.appSettingRepository.save(appSetting);
    } else {
      const newSetting = this.appSettingRepository.create({ delayPenalty: penalty });
      await this.appSettingRepository.save(newSetting);
    }
  }

  async getCancelPenalty(): Promise<number> {
    const appSetting = await this.getAppSetting();
    return appSetting?.cancelPenalty ?? 0;
  }

  async setCancelPenalty(penalty: number): Promise<void> {
    const appSetting = await this.getAppSetting();
    if (appSetting) {
      appSetting.cancelPenalty = penalty;
      await this.appSettingRepository.save(appSetting);
    } else {
      const newSetting = this.appSettingRepository.create({ cancelPenalty: penalty });
      await this.appSettingRepository.save(newSetting);
    }
  }

  async getDaysToComplaint(): Promise<number> {
    const appSetting = await this.getAppSetting();
    return appSetting?.daysToComplaint ?? 0;
  }

  async setDaysToComplaint(days: number): Promise<void> {
    const appSetting = await this.getAppSetting();
    if (appSetting) {
      appSetting.daysToComplaint = days;
      await this.appSettingRepository.save(appSetting);
    } else {
      const newSetting = this.appSettingRepository.create({ daysToComplaint: days });
      await this.appSettingRepository.save(newSetting);
    }
  }

  async getDaysToReviewUpdateRequest(): Promise<number> {
    const appSetting = await this.getAppSetting();
    return appSetting?.daysToReviewUpdateRequest ?? 0;
  }

  async setDaysToReviewUpdateRequest(days: number): Promise<void> {
    const appSetting = await this.getAppSetting();
    if (appSetting) {
      appSetting.daysToReviewUpdateRequest = days;
      await this.appSettingRepository.save(appSetting);
    } else {
      const newSetting = this.appSettingRepository.create({ daysToReviewUpdateRequest: days });
      await this.appSettingRepository.save(newSetting);
    }
  }

  async getComplaintReasons(
    take: number,
    skip: number,
    sort?: Sorting[],
    filter?: Filtering[],
  ): Promise<[ComplaintReason[], number]> {
    const dynamicFilter = getWhere(filter);
    const where = {
      ...dynamicFilter,
    };
    const order = getOrder(sort);
    return await this.complaintReasonRepository.findAndCount({
      where,
      order,
      take,
      skip,
    });
  }

  async createComplaintReason(body: CUComplaintReason): Promise<ComplaintReason> {
    return await this.complaintReasonRepository.save(body);
  }

  async updateComplaintReason(id: string, body: CUComplaintReason): Promise<void> {
    const reason = await this.complaintReasonRepository.findOne({ where: { id } });
    if (!reason) throw new NotFoundException('Không tìm thấy lý do khiếu nại nào phù hợp');
    await this.complaintReasonRepository.update(id, body);
  }

  async deleteComplaintReason(id: string): Promise<void> {
    const reason = await this.complaintReasonRepository.findOne({ where: { id } });
    if (!reason) throw new NotFoundException('Không tìm thấy lý do khiếu nại nào phù hợp');
    await this.complaintReasonRepository.delete(id);
  }

  async getComplaintReasonsForSeeding(): Promise<ComplaintReason[]> {
    return await this.complaintReasonRepository.find();
  }

  async createComplaintReasonForSeeding(data: ComplaintReason): Promise<ComplaintReason> {
    return await this.complaintReasonRepository.save(data);
  }

  async getMilestoneTemplatesByType(
    milestoneTemplateType: MilestoneTemplateType,
  ): Promise<MilestoneTemplate[]> {
    return this.milestoneTemplateRepository.find({
      where: { type: milestoneTemplateType },
      order: { index: 'ASC' },
    });
  }

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

  async getMilestoneTemplatesForSeeding(): Promise<MilestoneTemplate[]> {
    return await this.milestoneTemplateRepository.find();
  }

  async createMilestoneTemplateForSeeding(data: MilestoneTemplate): Promise<MilestoneTemplate> {
    return await this.milestoneTemplateRepository.save(data);
  }
}
