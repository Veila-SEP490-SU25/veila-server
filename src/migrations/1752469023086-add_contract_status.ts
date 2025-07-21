import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddContractStatus1752469023086 implements MigrationInterface {
  name = 'AddContractStatus1752469023086';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`contracts\` ADD \`status\` enum ('ACTIVE', 'INACTIVE', 'DRAFT') NOT NULL COMMENT 'Trạng thái của điều khoản (ACTIVE, INACTIVE, DRAFT)' DEFAULT 'DRAFT'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`contracts\` CHANGE \`effective_from\` \`effective_from\` timestamp NOT NULL COMMENT 'Ngày bắt đầu hiệu lực của điều khoản'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`contracts\` CHANGE \`effective_from\` \`effective_from\` timestamp NOT NULL COMMENT 'Ngày bắt đầu hiệu lực của điều khoản' DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(`ALTER TABLE \`contracts\` DROP COLUMN \`status\``);
  }
}
