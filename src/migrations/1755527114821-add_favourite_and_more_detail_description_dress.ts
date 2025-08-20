import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFavouriteAndMoreDetailDescriptionDress1755527114821 implements MigrationInterface {
  name = 'AddFavouriteAndMoreDetailDescriptionDress1755527114821';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD \`fav_dresses\` text NULL COMMENT 'Danh sách ID váy cưới yêu thích của người dùng'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD \`fav_shops\` text NULL COMMENT 'Danh sách ID cửa hàng yêu thích của người dùng'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`dresses\` ADD \`bust\` int UNSIGNED NULL COMMENT 'Vòng ngực'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`dresses\` ADD \`waist\` int UNSIGNED NULL COMMENT 'Vòng eo'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`dresses\` ADD \`hip\` int UNSIGNED NULL COMMENT 'Vòng mông'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`dresses\` ADD \`material\` varchar(50) NULL COMMENT 'Chất liệu'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`dresses\` ADD \`color\` varchar(50) NULL COMMENT 'Màu sắc'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`dresses\` ADD \`length\` varchar(50) NULL COMMENT 'Độ dài'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`dresses\` ADD \`neckline\` varchar(50) NULL COMMENT 'Cổ'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`dresses\` ADD \`sleeve\` varchar(50) NULL COMMENT 'Tay'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`requests\` ADD \`material\` varchar(50) NULL COMMENT 'Chất liệu'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`requests\` ADD \`color\` varchar(50) NULL COMMENT 'Màu sắc'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`requests\` ADD \`length\` varchar(50) NULL COMMENT 'Độ dài'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`requests\` ADD \`neckline\` varchar(50) NULL COMMENT 'Cổ'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`requests\` ADD \`sleeve\` varchar(50) NULL COMMENT 'Tay'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`update_requests\` ADD \`material\` varchar(50) NULL COMMENT 'Chất liệu'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`update_requests\` ADD \`color\` varchar(50) NULL COMMENT 'Màu sắc'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`update_requests\` ADD \`length\` varchar(50) NULL COMMENT 'Độ dài'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`update_requests\` ADD \`neckline\` varchar(50) NULL COMMENT 'Cổ'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`update_requests\` ADD \`sleeve\` varchar(50) NULL COMMENT 'Tay'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`update_requests\` DROP COLUMN \`sleeve\``);
    await queryRunner.query(`ALTER TABLE \`update_requests\` DROP COLUMN \`neckline\``);
    await queryRunner.query(`ALTER TABLE \`update_requests\` DROP COLUMN \`length\``);
    await queryRunner.query(`ALTER TABLE \`update_requests\` DROP COLUMN \`color\``);
    await queryRunner.query(`ALTER TABLE \`update_requests\` DROP COLUMN \`material\``);
    await queryRunner.query(`ALTER TABLE \`requests\` DROP COLUMN \`sleeve\``);
    await queryRunner.query(`ALTER TABLE \`requests\` DROP COLUMN \`neckline\``);
    await queryRunner.query(`ALTER TABLE \`requests\` DROP COLUMN \`length\``);
    await queryRunner.query(`ALTER TABLE \`requests\` DROP COLUMN \`color\``);
    await queryRunner.query(`ALTER TABLE \`requests\` DROP COLUMN \`material\``);
    await queryRunner.query(`ALTER TABLE \`dresses\` DROP COLUMN \`sleeve\``);
    await queryRunner.query(`ALTER TABLE \`dresses\` DROP COLUMN \`neckline\``);
    await queryRunner.query(`ALTER TABLE \`dresses\` DROP COLUMN \`length\``);
    await queryRunner.query(`ALTER TABLE \`dresses\` DROP COLUMN \`color\``);
    await queryRunner.query(`ALTER TABLE \`dresses\` DROP COLUMN \`material\``);
    await queryRunner.query(`ALTER TABLE \`dresses\` DROP COLUMN \`hip\``);
    await queryRunner.query(`ALTER TABLE \`dresses\` DROP COLUMN \`waist\``);
    await queryRunner.query(`ALTER TABLE \`dresses\` DROP COLUMN \`bust\``);
    await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`fav_shops\``);
    await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`fav_dresses\``);
  }
}
