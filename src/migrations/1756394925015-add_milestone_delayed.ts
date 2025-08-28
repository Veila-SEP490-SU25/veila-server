import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMilestoneDelayed1756394925015 implements MigrationInterface {
  name = 'AddMilestoneDelayed1756394925015';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`milestones\` CHANGE \`status\` \`status\` enum ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'DELAYED') NOT NULL COMMENT 'Trạng thái của mốc công việc' DEFAULT 'PENDING'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`milestones\` CHANGE \`status\` \`status\` enum ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED') NOT NULL COMMENT 'Trạng thái của mốc công việc' DEFAULT 'PENDING'`,
    );
  }
}
