import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDaysToComplaint1758098895831 implements MigrationInterface {
  name = 'AddDaysToComplaint1758098895831';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`app_settings\` ADD \`days_to_complaint\` int NOT NULL DEFAULT '3'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`app_settings\` DROP COLUMN \`days_to_complaint\``);
  }
}
