import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDaysToReviewUpdateRequest1758104840167 implements MigrationInterface {
  name = 'AddDaysToReviewUpdateRequest1758104840167';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`app_settings\` ADD \`days_to_review_update_request\` int NOT NULL DEFAULT '2'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`app_settings\` DROP COLUMN \`days_to_review_update_request\``,
    );
  }
}
