import { MigrationInterface, QueryRunner } from 'typeorm';

export class MilestoneTemplate1756688506386 implements MigrationInterface {
  name = 'MilestoneTemplate1756688506386';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`milestone_templates\` (\`id\` varchar(36) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`title\` varchar(255) NOT NULL, \`description\` text NULL, \`index\` int NOT NULL, \`timeGap\` int NOT NULL, \`type\` enum ('SELL', 'RENT', 'CUSTOM') NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`milestone_templates\``);
  }
}
