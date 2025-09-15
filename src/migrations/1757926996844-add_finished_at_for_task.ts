import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFinishedAtForTask1757926996844 implements MigrationInterface {
  name = 'AddFinishedAtForTask1757926996844';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`milestones\` ADD \`finished_at\` datetime NULL COMMENT 'Thời gian hoàn thành công việc'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`tasks\` ADD \`finished_at\` datetime NULL COMMENT 'Thời gian hoàn thành công việc'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`tasks\` DROP COLUMN \`finished_at\``);
    await queryRunner.query(`ALTER TABLE \`milestones\` DROP COLUMN \`finished_at\``);
  }
}
