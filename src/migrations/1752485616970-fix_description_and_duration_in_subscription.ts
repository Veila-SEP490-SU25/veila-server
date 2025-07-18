import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixDescriptionAndDurationInSubscription1752485616970 implements MigrationInterface {
  name = 'FixDescriptionAndDurationInSubscription1752485616970';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`subscriptions\` DROP COLUMN \`description\``);
    await queryRunner.query(
      `ALTER TABLE \`subscriptions\` ADD \`description\` text CHARACTER SET "utf8mb4" COLLATE "utf8mb4_unicode_ci" NOT NULL COMMENT 'Mô tả chi tiết gói'`,
    );
    await queryRunner.query(`ALTER TABLE \`subscriptions\` DROP COLUMN \`duration\``);
    await queryRunner.query(
      `ALTER TABLE \`subscriptions\` ADD \`duration\` int UNSIGNED NOT NULL COMMENT 'Thời gian hiệu lực của gói tính bằng ngày' DEFAULT '30'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`subscriptions\` DROP COLUMN \`duration\``);
    await queryRunner.query(
      `ALTER TABLE \`subscriptions\` ADD \`duration\` varchar(255) COLLATE "utf8mb4_unicode_ci" NOT NULL COMMENT 'Thời gian hiệu lực của gói'`,
    );
    await queryRunner.query(`ALTER TABLE \`subscriptions\` DROP COLUMN \`description\``);
    await queryRunner.query(
      `ALTER TABLE \`subscriptions\` ADD \`description\` varchar(100) COLLATE "utf8mb4_unicode_ci" NOT NULL COMMENT 'Mô tả chi tiết gói'`,
    );
  }
}
