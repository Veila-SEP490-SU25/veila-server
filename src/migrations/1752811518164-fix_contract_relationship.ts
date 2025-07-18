import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixContractRelationship1752811518164 implements MigrationInterface {
  name = 'FixContractRelationship1752811518164';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX \`IDX_d25630554850cb7a2ae2bb10d6\` ON \`contracts\``);
    await queryRunner.query(`ALTER TABLE \`contracts\` DROP COLUMN \`version\``);
    await queryRunner.query(`ALTER TABLE \`users\` ADD \`contract_id\` varchar(36) NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD UNIQUE INDEX \`IDX_57eb08734763d0b2fd90f97a57\` (\`contract_id\`)`,
    );
    await queryRunner.query(`ALTER TABLE \`shops\` ADD \`contract_id\` varchar(36) NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE \`shops\` ADD UNIQUE INDEX \`IDX_d42f541459b432b83cf082f740\` (\`contract_id\`)`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`REL_57eb08734763d0b2fd90f97a57\` ON \`users\` (\`contract_id\`)`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`REL_d42f541459b432b83cf082f740\` ON \`shops\` (\`contract_id\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD CONSTRAINT \`fk_user_contract\` FOREIGN KEY (\`contract_id\`) REFERENCES \`contracts\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`shops\` ADD CONSTRAINT \`fk_shop_contract\` FOREIGN KEY (\`contract_id\`) REFERENCES \`contracts\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`shops\` DROP FOREIGN KEY \`fk_shop_contract\``);
    await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`fk_user_contract\``);
    await queryRunner.query(`DROP INDEX \`REL_d42f541459b432b83cf082f740\` ON \`shops\``);
    await queryRunner.query(`DROP INDEX \`REL_57eb08734763d0b2fd90f97a57\` ON \`users\``);
    await queryRunner.query(`ALTER TABLE \`shops\` DROP INDEX \`IDX_d42f541459b432b83cf082f740\``);
    await queryRunner.query(`ALTER TABLE \`shops\` DROP COLUMN \`contract_id\``);
    await queryRunner.query(`ALTER TABLE \`users\` DROP INDEX \`IDX_57eb08734763d0b2fd90f97a57\``);
    await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`contract_id\``);
    await queryRunner.query(
      `ALTER TABLE \`contracts\` ADD \`version\` int NOT NULL COMMENT 'Phiên bản của điều khoản' DEFAULT '1'`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_d25630554850cb7a2ae2bb10d6\` ON \`contracts\` (\`version\`)`,
    );
  }
}
