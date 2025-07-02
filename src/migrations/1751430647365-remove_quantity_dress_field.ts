import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveQuantityDressField1751430647365 implements MigrationInterface {
  name = 'RemoveQuantityDressField1751430647365';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`dresses\` DROP COLUMN \`quantity\``);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`dresses\` ADD \`quantity\` int UNSIGNED NOT NULL COMMENT 'Số lượng sản phẩm có sẵn' DEFAULT '0'`,
    );
  }
}
