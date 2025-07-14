import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixEffectiveFromInContract1752484015894 implements MigrationInterface {
  name = 'FixEffectiveFromInContract1752484015894';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`contracts\` DROP COLUMN \`effective_from\``);
    await queryRunner.query(
      `ALTER TABLE \`contracts\` ADD \`effective_from\` datetime NOT NULL COMMENT 'Ngày bắt đầu hiệu lực của điều khoản'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`contracts\` DROP COLUMN \`effective_from\``);
    await queryRunner.query(
      `ALTER TABLE \`contracts\` ADD \`effective_from\` timestamp NOT NULL COMMENT 'Ngày bắt đầu hiệu lực của điều khoản' DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`,
    );
  }
}
