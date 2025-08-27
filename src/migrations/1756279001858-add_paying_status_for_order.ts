import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPayingStatusForOrder1756279001858 implements MigrationInterface {
  name = 'AddPayingStatusForOrder1756279001858';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`orders\` CHANGE \`status\` \`status\` enum ('PENDING', 'PAYING', 'IN_PROCESS', 'COMPLETED', 'CANCELLED') NOT NULL COMMENT 'Trạng thái đơn hàng' DEFAULT 'PENDING'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`orders\` CHANGE \`status\` \`status\` enum ('PENDING', 'IN_PROCESS', 'COMPLETED', 'CANCELLED') NOT NULL COMMENT 'Trạng thái đơn hàng' DEFAULT 'PENDING'`,
    );
  }
}
