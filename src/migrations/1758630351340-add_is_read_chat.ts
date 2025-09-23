import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIsReadChat1758630351340 implements MigrationInterface {
  name = 'AddIsReadChat1758630351340';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`messages\` ADD \`is_readed\` tinyint NOT NULL DEFAULT 0`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`messages\` DROP COLUMN \`is_readed\``);
  }
}
