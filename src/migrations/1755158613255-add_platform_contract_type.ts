import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPlatformContractType1755158613255 implements MigrationInterface {
  name = 'AddPlatformContractType1755158613255';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX \`IDX_1f8d1173481678a035b4a81a4e\` ON \`services\``);
    await queryRunner.query(`DROP INDEX \`IDX_421b94f0ef1cdb407654e67c59\` ON \`services\``);
    await queryRunner.query(`DROP INDEX \`IDX_92558c08091598f7a4439586cd\` ON \`wallets\``);
    await queryRunner.query(
      `ALTER TABLE \`contracts\` CHANGE \`contract_type\` \`contract_type\` enum ('SHOP', 'CUSTOMER', 'PLATFORM') NOT NULL COMMENT 'Loại hợp đồng (SHOP hoặc CUSTOMER)'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`contracts\` CHANGE \`contract_type\` \`contract_type\` enum ('SHOP', 'CUSTOMER') NOT NULL COMMENT 'Loại hợp đồng (SHOP hoặc CUSTOMER)'`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_92558c08091598f7a4439586cd\` ON \`wallets\` (\`user_id\`)`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_421b94f0ef1cdb407654e67c59\` ON \`services\` (\`user_id\`)`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_1f8d1173481678a035b4a81a4e\` ON \`services\` (\`category_id\`)`,
    );
  }
}
