import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixRelationshipBetweenTransactionAndMembership1752137093445
  implements MigrationInterface
{
  name = 'FixRelationshipBetweenTransactionAndMembership1752137093445';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`memberships\` DROP FOREIGN KEY \`fk_membership_transaction\``,
    );
    await queryRunner.query(`DROP INDEX \`REL_2a12450268aac7e51ce4f4c031\` ON \`memberships\``);
    await queryRunner.query(`ALTER TABLE \`memberships\` DROP COLUMN \`transaction_id\``);
    await queryRunner.query(`ALTER TABLE \`transactions\` ADD \`membership_id\` varchar(36) NULL`);
    await queryRunner.query(
      `ALTER TABLE \`transactions\` ADD UNIQUE INDEX \`IDX_0c492732befa8082079313f7d3\` (\`membership_id\`)`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`REL_0c492732befa8082079313f7d3\` ON \`transactions\` (\`membership_id\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`transactions\` ADD CONSTRAINT \`fk_membership_transaction\` FOREIGN KEY (\`membership_id\`) REFERENCES \`memberships\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`transactions\` DROP FOREIGN KEY \`fk_membership_transaction\``,
    );
    await queryRunner.query(`DROP INDEX \`REL_0c492732befa8082079313f7d3\` ON \`transactions\``);
    await queryRunner.query(
      `ALTER TABLE \`transactions\` DROP INDEX \`IDX_0c492732befa8082079313f7d3\``,
    );
    await queryRunner.query(`ALTER TABLE \`transactions\` DROP COLUMN \`membership_id\``);
    await queryRunner.query(`ALTER TABLE \`memberships\` ADD \`transaction_id\` varchar(36) NULL`);
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`REL_2a12450268aac7e51ce4f4c031\` ON \`memberships\` (\`transaction_id\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`memberships\` ADD CONSTRAINT \`fk_membership_transaction\` FOREIGN KEY (\`transaction_id\`) REFERENCES \`transactions\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
