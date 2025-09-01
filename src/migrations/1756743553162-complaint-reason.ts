import { MigrationInterface, QueryRunner } from 'typeorm';

export class ComplaintReason1756743553162 implements MigrationInterface {
  name = 'ComplaintReason1756743553162';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`complaint_reasons\` (\`id\` varchar(36) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`code\` int NOT NULL, \`reason\` text NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`app_settings\` ADD \`complaint_reputation_penalty\` int NOT NULL DEFAULT '10'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`app_settings\` DROP COLUMN \`complaint_reputation_penalty\``,
    );
    await queryRunner.query(`DROP TABLE \`complaint_reasons\``);
  }
}
