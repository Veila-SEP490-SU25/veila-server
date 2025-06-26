import { MigrationInterface, QueryRunner } from 'typeorm';

export class ConvertStoreStringImages1750751703754 implements MigrationInterface {
  name = 'ConvertStoreStringImages1750751703754';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`users\` ADD \`images\` text NULL`);
    await queryRunner.query(`ALTER TABLE \`identifiers\` ADD \`images\` text NULL`);
    await queryRunner.query(`ALTER TABLE \`shops\` ADD \`images\` text NULL`);
    await queryRunner.query(`ALTER TABLE \`licenses\` ADD \`images\` text NULL`);
    await queryRunner.query(`ALTER TABLE \`policies\` ADD \`images\` text NULL`);
    await queryRunner.query(`ALTER TABLE \`payment_infos\` ADD \`images\` text NULL`);
    await queryRunner.query(`ALTER TABLE \`transactions\` ADD \`images\` text NULL`);
    await queryRunner.query(`ALTER TABLE \`wallets\` ADD \`images\` text NULL`);
    await queryRunner.query(`ALTER TABLE \`categories\` ADD \`images\` text NULL`);
    await queryRunner.query(`ALTER TABLE \`blogs\` ADD \`images\` text NULL`);
    await queryRunner.query(`ALTER TABLE \`dresses\` ADD \`images\` text NULL`);
    await queryRunner.query(`ALTER TABLE \`services\` ADD \`images\` text NULL`);
    await queryRunner.query(`ALTER TABLE \`accessories\` ADD \`images\` text NULL`);
    await queryRunner.query(`ALTER TABLE \`complaints\` ADD \`images\` text NULL`);
    await queryRunner.query(`ALTER TABLE \`feedbacks\` ADD \`images\` text NULL`);
    await queryRunner.query(`ALTER TABLE \`milestones\` ADD \`images\` text NULL`);
    await queryRunner.query(`ALTER TABLE \`orders\` ADD \`images\` text NULL`);
    await queryRunner.query(`ALTER TABLE \`order_dress_details\` ADD \`images\` text NULL`);
    await queryRunner.query(`ALTER TABLE \`order_service_details\` ADD \`images\` text NULL`);
    await queryRunner.query(`ALTER TABLE \`requests\` ADD \`images\` text NULL`);
    await queryRunner.query(`ALTER TABLE \`tasks\` ADD \`images\` text NULL`);
    await queryRunner.query(`ALTER TABLE \`banks\` ADD \`images\` text NULL`);
    await queryRunner.query(
      `ALTER TABLE \`users\` CHANGE \`phone\` \`phone\` varchar(15) NULL COMMENT 'Số điện thoại của người dùng'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`users\` CHANGE \`phone\` \`phone\` varchar(15) NULL COMMENT 'Số điện thoại của người dùng (định dạng E.164)'`,
    );
    await queryRunner.query(`ALTER TABLE \`banks\` DROP COLUMN \`images\``);
    await queryRunner.query(`ALTER TABLE \`tasks\` DROP COLUMN \`images\``);
    await queryRunner.query(`ALTER TABLE \`requests\` DROP COLUMN \`images\``);
    await queryRunner.query(`ALTER TABLE \`order_service_details\` DROP COLUMN \`images\``);
    await queryRunner.query(`ALTER TABLE \`order_dress_details\` DROP COLUMN \`images\``);
    await queryRunner.query(`ALTER TABLE \`orders\` DROP COLUMN \`images\``);
    await queryRunner.query(`ALTER TABLE \`milestones\` DROP COLUMN \`images\``);
    await queryRunner.query(`ALTER TABLE \`feedbacks\` DROP COLUMN \`images\``);
    await queryRunner.query(`ALTER TABLE \`complaints\` DROP COLUMN \`images\``);
    await queryRunner.query(`ALTER TABLE \`accessories\` DROP COLUMN \`images\``);
    await queryRunner.query(`ALTER TABLE \`services\` DROP COLUMN \`images\``);
    await queryRunner.query(`ALTER TABLE \`dresses\` DROP COLUMN \`images\``);
    await queryRunner.query(`ALTER TABLE \`blogs\` DROP COLUMN \`images\``);
    await queryRunner.query(`ALTER TABLE \`categories\` DROP COLUMN \`images\``);
    await queryRunner.query(`ALTER TABLE \`wallets\` DROP COLUMN \`images\``);
    await queryRunner.query(`ALTER TABLE \`transactions\` DROP COLUMN \`images\``);
    await queryRunner.query(`ALTER TABLE \`payment_infos\` DROP COLUMN \`images\``);
    await queryRunner.query(`ALTER TABLE \`policies\` DROP COLUMN \`images\``);
    await queryRunner.query(`ALTER TABLE \`licenses\` DROP COLUMN \`images\``);
    await queryRunner.query(`ALTER TABLE \`shops\` DROP COLUMN \`images\``);
    await queryRunner.query(`ALTER TABLE \`identifiers\` DROP COLUMN \`images\``);
    await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`images\``);
  }
}
