import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixUniquePhoneForUser1752463358301 implements MigrationInterface {
  name = 'FixUniquePhoneForUser1752463358301';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX \`IDX_0c492732befa8082079313f7d3\` ON \`transactions\``);
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD UNIQUE INDEX \`IDX_a000cca60bcf04454e72769949\` (\`phone\`)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`users\` DROP INDEX \`IDX_a000cca60bcf04454e72769949\``);
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_0c492732befa8082079313f7d3\` ON \`transactions\` (\`membership_id\`)`,
    );
  }
}
