import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixNotNullableShopEmail1752467659356 implements MigrationInterface {
  name = 'FixNotNullableShopEmail1752467659356';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`contracts\` CHANGE \`effective_from\` \`effective_from\` timestamp NOT NULL COMMENT 'Ngày bắt đầu hiệu lực của điều khoản'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`shops\` CHANGE \`email\` \`email\` varchar(64) NOT NULL COMMENT 'Email liên hệ'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`shops\` CHANGE \`email\` \`email\` varchar(64) NULL COMMENT 'Email liên hệ'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`contracts\` CHANGE \`effective_from\` \`effective_from\` timestamp NOT NULL COMMENT 'Ngày bắt đầu hiệu lực của điều khoản' DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`,
    );
  }
}
