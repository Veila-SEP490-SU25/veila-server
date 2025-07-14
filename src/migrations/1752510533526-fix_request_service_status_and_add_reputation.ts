import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixRequestServiceStatusAndAddReputation1752510533526 implements MigrationInterface {
  name = 'FixRequestServiceStatusAndAddReputation1752510533526';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD \`reputation\` int NOT NULL COMMENT 'Điểm uy tín của user (0-100)' DEFAULT '100'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`shops\` ADD \`reputation\` int NOT NULL COMMENT 'Điểm uy tín của shop (0-100)' DEFAULT '100'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`blogs\` CHANGE \`status\` \`status\` enum ('DRAFT', 'PUBLISHED', 'UNPUBLISHED') NOT NULL COMMENT 'Trạng thái của blog' DEFAULT 'DRAFT'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`services\` CHANGE \`status\` \`status\` enum ('AVAILABLE', 'UNAVAILABLE', 'DRAFT') NOT NULL COMMENT 'Trạng thái dịch vụ' DEFAULT 'UNAVAILABLE'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`requests\` CHANGE \`status\` \`status\` enum ('DRAFT', 'SUBMIT', 'ACCEPTED', 'CANCELLED') NOT NULL COMMENT 'Trạng thái yêu cầu' DEFAULT 'DRAFT'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`requests\` CHANGE \`status\` \`status\` enum ('PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED', 'CANCELLED') NOT NULL COMMENT 'Trạng thái yêu cầu' DEFAULT 'PENDING'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`services\` CHANGE \`status\` \`status\` enum ('ACTIVE', 'INACTIVE') NOT NULL COMMENT 'Trạng thái dịch vụ' DEFAULT 'INACTIVE'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`blogs\` CHANGE \`status\` \`status\` enum ('DRAFT', 'PUBLISHED') NOT NULL COMMENT 'Trạng thái của blog' DEFAULT 'DRAFT'`,
    );
    await queryRunner.query(`ALTER TABLE \`shops\` DROP COLUMN \`reputation\``);
    await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`reputation\``);
  }
}
