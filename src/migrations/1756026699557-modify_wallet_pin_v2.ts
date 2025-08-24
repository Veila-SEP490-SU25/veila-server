import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModifyWalletPinV21756026699557 implements MigrationInterface {
  name = 'ModifyWalletPinV21756026699557';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`wallets\` DROP COLUMN \`pin\``);
    await queryRunner.query(
      `ALTER TABLE \`wallets\` ADD \`pin\` varchar(72) NULL COMMENT 'Mật khẩu đã được mã hóa bằng bcrypt (72 ký tự)'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`wallets\` DROP COLUMN \`pin\``);
    await queryRunner.query(`ALTER TABLE \`wallets\` ADD \`pin\` varchar(6) NULL`);
  }
}
