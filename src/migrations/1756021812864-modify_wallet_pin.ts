import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModifyWalletPin1756021812864 implements MigrationInterface {
  name = 'ModifyWalletPin1756021812864';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`wallets\` ADD \`pin\` varchar(6) NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`wallets\` DROP COLUMN \`pin\``);
  }
}
