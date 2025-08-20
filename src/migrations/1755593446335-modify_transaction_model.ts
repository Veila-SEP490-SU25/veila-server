import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModifyTransactionModel1755593446335 implements MigrationInterface {
  name = 'ModifyTransactionModel1755593446335';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`transactions\` CHANGE \`from_type_balance\` \`from_type_balance\` enum ('AVAILABLE', 'LOCKED') NOT NULL COMMENT 'Loại số dư nguồn chuyển (AVAILABLE/LOCKED)'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`transactions\` CHANGE \`to_type_balance\` \`to_type_balance\` enum ('AVAILABLE', 'LOCKED') NOT NULL COMMENT 'Loại số dư nơi nhận (AVAILABLE/LOCKED)'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`transactions\` CHANGE \`type\` \`type\` enum ('DEPOSIT', 'WITHDRAW', 'TRANSFER', 'RECEIVE', 'REFUND') NOT NULL COMMENT 'Loại giao dịch'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`transactions\` CHANGE \`status\` \`status\` enum ('PENDING', 'COMPLETED', 'FAILED', 'CANCELLED', 'REFUNDED') NOT NULL COMMENT 'Trạng thái giao dịch' DEFAULT 'PENDING'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`transactions\` CHANGE \`status\` \`status\` enum ('pending', 'completed', 'failed', 'cancelled', 'refunded') NOT NULL COMMENT 'Trạng thái giao dịch' DEFAULT 'pending'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`transactions\` CHANGE \`type\` \`type\` enum ('deposit', 'withdraw', 'transfer', 'receive', 'refund') NOT NULL COMMENT 'Loại giao dịch'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`transactions\` CHANGE \`to_type_balance\` \`to_type_balance\` enum ('available', 'locked') NOT NULL COMMENT 'Loại số dư nơi nhận (AVAILABLE/LOCKED)'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`transactions\` CHANGE \`from_type_balance\` \`from_type_balance\` enum ('available', 'locked') NOT NULL COMMENT 'Loại số dư nguồn chuyển (AVAILABLE/LOCKED)'`,
    );
  }
}
