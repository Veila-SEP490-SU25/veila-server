import { MigrationInterface, QueryRunner } from 'typeorm';

export class TransactionTypeAndStatus1754979975411 implements MigrationInterface {
  name = 'TransactionTypeAndStatus1754979975411';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`transactions\` CHANGE \`type\` \`type\` enum ('deposit', 'withdraw', 'transfer', 'receive', 'refund') NOT NULL COMMENT 'Loại giao dịch'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`transactions\` CHANGE \`status\` \`status\` enum ('pending', 'completed', 'failed', 'cancelled', 'refunded') NOT NULL COMMENT 'Trạng thái giao dịch' DEFAULT 'pending'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`transactions\` CHANGE \`status\` \`status\` enum ('pending', 'completed', 'failed', 'cancelled', 'refunded', 'disputed') NOT NULL COMMENT 'Trạng thái giao dịch' DEFAULT 'pending'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`transactions\` CHANGE \`type\` \`type\` enum ('deposit', 'withdraw', 'transfer', 'payment', 'refund', 'other') NOT NULL COMMENT 'Loại giao dịch'`,
    );
  }
}
