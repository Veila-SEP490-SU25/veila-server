import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveQuantityFixRentalAccessory1751446633487 implements MigrationInterface {
  name = 'RemoveQuantityFixRentalAccessory1751446633487';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`accessories\` DROP COLUMN \`quantity\``);
    await queryRunner.query(`ALTER TABLE \`accessories\` DROP COLUMN \`retail_price\``);
    await queryRunner.query(
      `ALTER TABLE \`accessories\` ADD \`rental_price\` decimal(10,2) UNSIGNED NOT NULL COMMENT 'Giá cho thuê của phụ kiện' DEFAULT '0.00'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`accessories\` DROP COLUMN \`rental_price\``);
    await queryRunner.query(
      `ALTER TABLE \`accessories\` ADD \`retail_price\` decimal UNSIGNED NOT NULL COMMENT 'Giá bán lẻ của phụ kiện' DEFAULT '0.00'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`accessories\` ADD \`quantity\` int UNSIGNED NOT NULL COMMENT 'Số lượng phụ kiện có sẵn' DEFAULT '0'`,
    );
  }
}
