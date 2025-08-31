import { MigrationInterface, QueryRunner } from 'typeorm';

export class DelayPenalty1756654869865 implements MigrationInterface {
  name = 'DelayPenalty1756654869865';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`notifications\` (\`id\` varchar(36) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`app_settings\` ADD \`delay_penalty\` int NOT NULL DEFAULT '15'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`app_settings\` DROP COLUMN \`delay_penalty\``);
    await queryRunner.query(`DROP TABLE \`notifications\``);
  }
}
