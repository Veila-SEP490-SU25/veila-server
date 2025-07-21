import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixLogicContract1752465063328 implements MigrationInterface {
  name = 'FixLogicContract1752465063328';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`contracts\` DROP FOREIGN KEY \`fk_contract_shop\``);
    await queryRunner.query(
      `CREATE TABLE \`contract_acceptances\` (\`id\` varchar(36) NOT NULL, \`images\` text NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`user_id\` varchar(36) NOT NULL, \`contract_id\` varchar(36) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(`ALTER TABLE \`contracts\` DROP COLUMN \`is_signed\``);
    await queryRunner.query(`ALTER TABLE \`contracts\` DROP COLUMN \`shop_id\``);
    await queryRunner.query(
      `ALTER TABLE \`contracts\` ADD \`contract_type\` enum ('SHOP', 'CUSTOMER') NOT NULL COMMENT 'Loại hợp đồng (SHOP hoặc CUSTOMER)'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`contracts\` ADD \`version\` int NOT NULL COMMENT 'Phiên bản của điều khoản' DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`contracts\` ADD UNIQUE INDEX \`IDX_d25630554850cb7a2ae2bb10d6\` (\`version\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`contracts\` ADD \`effective_from\` timestamp NOT NULL COMMENT 'Ngày bắt đầu hiệu lực của điều khoản'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`contract_acceptances\` ADD CONSTRAINT \`fk_contract_acceptance_user\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`contract_acceptances\` ADD CONSTRAINT \`fk_contract_acceptance_contract\` FOREIGN KEY (\`contract_id\`) REFERENCES \`contracts\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`contract_acceptances\` DROP FOREIGN KEY \`fk_contract_acceptance_contract\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`contract_acceptances\` DROP FOREIGN KEY \`fk_contract_acceptance_user\``,
    );
    await queryRunner.query(`ALTER TABLE \`contracts\` DROP COLUMN \`effective_from\``);
    await queryRunner.query(
      `ALTER TABLE \`contracts\` DROP INDEX \`IDX_d25630554850cb7a2ae2bb10d6\``,
    );
    await queryRunner.query(`ALTER TABLE \`contracts\` DROP COLUMN \`version\``);
    await queryRunner.query(`ALTER TABLE \`contracts\` DROP COLUMN \`contract_type\``);
    await queryRunner.query(`ALTER TABLE \`contracts\` ADD \`shop_id\` varchar(36) NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE \`contracts\` ADD \`is_signed\` tinyint NOT NULL COMMENT 'Xác định xem điều khoản người dùng ký xác nhận hay chưa' DEFAULT '0'`,
    );
    await queryRunner.query(`DROP TABLE \`contract_acceptances\``);
    await queryRunner.query(
      `ALTER TABLE \`contracts\` ADD CONSTRAINT \`fk_contract_shop\` FOREIGN KEY (\`shop_id\`) REFERENCES \`shops\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
