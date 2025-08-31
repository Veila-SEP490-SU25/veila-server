import { AppSetting } from '@/common/models/single/appsetting.model';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AppSettingService {
  constructor(
    @InjectRepository(AppSetting)
    private readonly appSettingRepository: Repository<AppSetting>,
  ) {}

  async getAppSetting(): Promise<AppSetting | null> {
    const settings = await this.appSettingRepository.find();
    return settings[0] || null;
  }

  async getDelayPenalty(): Promise<number> {
    const appSettings = await this.appSettingRepository.find();
    const appSetting = appSettings[0];
    return appSetting?.delayPenalty ?? 0;
  }

  async setDelayPenalty(penalty: number): Promise<void> {
    const appsettings = await this.appSettingRepository.find();
    const appSetting = appsettings[0];
    if (appSetting) {
      appSetting.delayPenalty = penalty;
      await this.appSettingRepository.save(appSetting);
    } else {
      const newSetting = this.appSettingRepository.create({ delayPenalty: penalty });
      await this.appSettingRepository.save(newSetting);
    }
  }

  async getCancelPenalty(): Promise<number> {
    const appSettings = await this.appSettingRepository.find();
    const appSetting = appSettings[0];
    return appSetting?.cancelPenalty ?? 0;
  }

  async setCancelPenalty(penalty: number): Promise<void> {
    const appSettings = await this.appSettingRepository.find();
    const appSetting = appSettings[0];
    if (appSetting) {
      appSetting.cancelPenalty = penalty;
      await this.appSettingRepository.save(appSetting);
    } else {
      const newSetting = this.appSettingRepository.create({ cancelPenalty: penalty });
      await this.appSettingRepository.save(newSetting);
    }
  }
}
