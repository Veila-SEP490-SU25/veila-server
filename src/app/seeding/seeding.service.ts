import { PasswordService } from '@/app/password';
import { UserService } from '@/app/user';
import { User, UserRole, UserStatus } from '@/common/models';
import { Faker, faker, vi } from '@faker-js/faker';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SeedingService implements OnModuleInit {
  private readonly logger = new Logger(SeedingService.name, {
    timestamp: true,
  });

  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly passwordService: PasswordService,
  ) {}

  async onModuleInit() {
    this.logger.log('Seeding module initialized. Starting seeding process...');
    await this.seedSystemAccounts();
  }

  private async seedSystemAccounts() {
    const superAdminEmail = this.configService.get<string>(
      'SEED_SUPER_ADMIN_EMAIL',
    );
    const adminEmail = this.configService.get<string>('SEED_ADMIN_EMAIL');
    const systemOperatorEmail = this.configService.get<string>(
      'SEED_SYSTEM_OPERATOR_EMAIL',
    );

    if (!superAdminEmail || !adminEmail || !systemOperatorEmail) {
      this.logger.error(
        'SEED_SUPER_ADMIN_EMAIL, SEED_ADMIN_EMAIL, or SEED_SYSTEM_OPERATOR_EMAIL is not set in the environment variables.',
      );
      throw new Error(
        'SEED_SUPER_ADMIN_EMAIL, SEED_ADMIN_EMAIL, or SEED_SYSTEM_OPERATOR_EMAIL is not set in the environment variables.',
      );
    }

    Promise.all([
      this.seedAccounts(superAdminEmail, UserRole.SuperAdmin),
      this.seedAccounts(adminEmail, UserRole.Admin),
      this.seedAccounts(systemOperatorEmail, UserRole.SystemOperator),
    ]).catch((error) => {
      this.logger.error('Seeding process failed.', error);
      throw new Error('Seeding process failed.');
    }).then(() => {
      this.logger.log('Sedding process completed!!!')
    });
  }

  private async seedAccounts(email: string, role: UserRole) {
    this.logger.log(`Seeding account with email: ${email}`);
    const existingUser = await this.userService.getByEmail(email);
    if (existingUser) {
      this.logger.warn(
        `Account with email ${email} already exists. Stopping seeding.`,
      );
      return;
    } else {
      const defaultPassword = this.configService.get<string>(
        'SEED_ACCOUNT_PASSWORD',
      );
      if (!defaultPassword) {
        this.logger.error(
          'SEED_ACCOUNT_PASSWORD is not set in the environment variables.',
        );
        throw new Error(
          'SEED_ACCOUNT_PASSWORD is not set in the environment variables.',
        );
      }
      const customFaker = new Faker({ locale: vi });
      const fullName = customFaker.person.fullName({sex: 'male'});
      const newUser = {
        email: email,
        password: await this.passwordService.hashPassword(defaultPassword),
        role: role,
        username: role.toString(),
        firstName: fullName.split(' ')[0],
        middleName: fullName.split(' ')[1],
        lastName: fullName.split(' ')[2],
        isVerified: true,
        status: UserStatus.Active,
      } as User;
      await this.userService.createUser(newUser);
      this.logger.log(`Account with email ${email} has been created.`);
    }
  }
}
