import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBalanceSnapshot1756590046573 implements MigrationInterface {
  name = 'AddBalanceSnapshot1756590046573';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`transactions\` ADD \`available_balance_snapshot\` decimal(18,2) UNSIGNED NOT NULL COMMENT 'Số dư khả dụng của ví tại thời điểm giao dịch'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`transactions\` ADD \`locked_balance_snapshot\` decimal(18,2) UNSIGNED NOT NULL COMMENT 'Số dư bị khóa của ví tại thời điểm giao dịch'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`transactions\` DROP COLUMN \`locked_balance_snapshot\``);
    await queryRunner.query(
      `ALTER TABLE \`transactions\` DROP COLUMN \`available_balance_snapshot\``,
    );
  }
}
