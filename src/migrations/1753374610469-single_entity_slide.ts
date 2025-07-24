import { MigrationInterface, QueryRunner } from 'typeorm';

export class SingleEntitySlide1753374610469 implements MigrationInterface {
  name = 'SingleEntitySlide1753374610469';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`slides\` (\`id\` varchar(36) NOT NULL, \`images\` text NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`title\` varchar(255) CHARACTER SET "utf8mb4" COLLATE "utf8mb4_unicode_ci" NOT NULL COMMENT 'Tiêu đề của slide', \`description\` text CHARACTER SET "utf8mb4" COLLATE "utf8mb4_unicode_ci" NULL COMMENT 'Mô tả của slide', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`slides\``);
  }
}
