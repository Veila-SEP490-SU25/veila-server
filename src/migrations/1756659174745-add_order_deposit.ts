import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOrderDeposit1756659174745 implements MigrationInterface {
  name = 'AddOrderDeposit1756659174745';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`orders\` ADD \`deposit\` decimal(12,2) UNSIGNED NULL COMMENT 'Tổng số tiền cọc của đơn hàng' DEFAULT '0.00'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`orders\` DROP COLUMN \`deposit\``);
  }
}
