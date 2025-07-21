import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixLicenseContainImagesOnly1752467284975 implements MigrationInterface {
  name = 'FixLicenseContainImagesOnly1752467284975';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`licenses\` DROP COLUMN \`license_number\``);
    await queryRunner.query(`ALTER TABLE \`licenses\` DROP COLUMN \`title\``);
    await queryRunner.query(`ALTER TABLE \`licenses\` DROP COLUMN \`description\``);
    await queryRunner.query(
      `ALTER TABLE \`contracts\` CHANGE \`effective_from\` \`effective_from\` timestamp NOT NULL COMMENT 'Ngày bắt đầu hiệu lực của điều khoản'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`contracts\` CHANGE \`effective_from\` \`effective_from\` timestamp NOT NULL COMMENT 'Ngày bắt đầu hiệu lực của điều khoản' DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE \`licenses\` ADD \`description\` text COLLATE "utf8mb4_unicode_ci" NULL COMMENT 'Mô tả giấy phép'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`licenses\` ADD \`title\` varchar(200) COLLATE "utf8mb4_unicode_ci" NOT NULL COMMENT 'Tên giấy phép'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`licenses\` ADD \`license_number\` varchar(50) NOT NULL COMMENT 'Số giấy phép kinh doanh'`,
    );
  }
}
