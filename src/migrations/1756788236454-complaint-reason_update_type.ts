import { MigrationInterface, QueryRunner } from 'typeorm';

export class ComplaintReasonUpdateType1756788236454 implements MigrationInterface {
  name = 'ComplaintReasonUpdateType1756788236454';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`complaint_reasons\` DROP COLUMN \`complaint_reputation_penalty\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`complaint_reasons\` ADD \`reputation_penalty\` int NOT NULL DEFAULT '10'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`complaint_reasons\` ADD \`type\` enum ('SHOP', 'CUSTOMER') NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`complaint_reasons\` DROP COLUMN \`type\``);
    await queryRunner.query(`ALTER TABLE \`complaint_reasons\` DROP COLUMN \`reputation_penalty\``);
    await queryRunner.query(
      `ALTER TABLE \`complaint_reasons\` ADD \`complaint_reputation_penalty\` int NOT NULL DEFAULT '10'`,
    );
  }
}
