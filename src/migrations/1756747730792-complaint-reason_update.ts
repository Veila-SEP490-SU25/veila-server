import { MigrationInterface, QueryRunner } from 'typeorm';

export class ComplaintReasonUpdate1756747730792 implements MigrationInterface {
  name = 'ComplaintReasonUpdate1756747730792';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`app_settings\` DROP COLUMN \`complaint_reputation_penalty\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`complaints\` ADD \`reason\` varchar(200) CHARACTER SET "utf8mb4" COLLATE "utf8mb4_unicode_ci" NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`complaint_reasons\` ADD \`complaint_reputation_penalty\` int NOT NULL DEFAULT '10'`,
    );
    await queryRunner.query(`ALTER TABLE \`complaint_reasons\` DROP COLUMN \`code\``);
    await queryRunner.query(`ALTER TABLE \`complaint_reasons\` ADD \`code\` varchar(255) NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`complaint_reasons\` DROP COLUMN \`code\``);
    await queryRunner.query(`ALTER TABLE \`complaint_reasons\` ADD \`code\` int NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE \`complaint_reasons\` DROP COLUMN \`complaint_reputation_penalty\``,
    );
    await queryRunner.query(`ALTER TABLE \`complaints\` DROP COLUMN \`reason\``);
    await queryRunner.query(
      `ALTER TABLE \`app_settings\` ADD \`complaint_reputation_penalty\` int NOT NULL DEFAULT '10'`,
    );
  }
}
