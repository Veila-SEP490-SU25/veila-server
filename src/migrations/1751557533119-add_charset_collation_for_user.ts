import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCharsetCollationForUser1751557533119 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`users\`
            MODIFY COLUMN \`first_name\` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Tên của người dùng',
            MODIFY COLUMN \`middle_name\` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT 'Tên đệm của người dùng',
            MODIFY COLUMN \`last_name\` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Họ của người dùng',
            MODIFY COLUMN \`address\` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT 'Địa chỉ của người dùng'
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`users\`
            MODIFY COLUMN \`first_name\` varchar(30) NOT NULL COMMENT 'Tên của người dùng',
            MODIFY COLUMN \`middle_name\` varchar(30) NULL COMMENT 'Tên đệm của người dùng',
            MODIFY COLUMN \`last_name\` varchar(30) NOT NULL COMMENT 'Họ của người dùng',
            MODIFY COLUMN \`address\` varchar(255) NULL COMMENT 'Địa chỉ của người dùng'
        `);
  }
}
