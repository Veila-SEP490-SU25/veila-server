import { MigrationInterface, QueryRunner } from 'typeorm';

export class Appsetting1756652031314 implements MigrationInterface {
  name = 'Appsetting1756652031314';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`app_settings\` (\`id\` varchar(36) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`cancel_penalty\` int NOT NULL DEFAULT '5', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.dropTable(`notifications`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`app_settings\``);
  }
}
