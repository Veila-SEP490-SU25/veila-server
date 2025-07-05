import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCharsetCollation1751608175567 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // transactions
    await queryRunner.query(
      `ALTER TABLE \`transactions\` MODIFY COLUMN \`from\` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Nguồn chuyển tiền (có thể là user, ví, hệ thống, v.v.)'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`transactions\` MODIFY COLUMN \`to\` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Nơi nhận tiền (có thể là user, ví, hệ thống, v.v.)'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`transactions\` MODIFY COLUMN \`note\` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT 'Ghi chú giao dịch (nếu có)'`,
    );

    // payment_infos
    await queryRunner.query(
      `ALTER TABLE \`payment_infos\` MODIFY COLUMN \`account_name\` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Tên chủ tài khoản ngân hàng hoặc ví điện tử'`,
    );

    // banks
    await queryRunner.query(
      `ALTER TABLE \`banks\` MODIFY COLUMN \`name\` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Tên ngân hàng'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`banks\` MODIFY COLUMN \`short_name\` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Tên viết tắt của ngân hàng'`,
    );

    // identifiers
    await queryRunner.query(
      `ALTER TABLE \`identifiers\` MODIFY COLUMN \`reject_reason\` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT 'Lý do từ chối xác thực (nếu có)'`,
    );

    // shops
    await queryRunner.query(
      `ALTER TABLE \`shops\` MODIFY COLUMN \`name\` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Tên shop'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`shops\` MODIFY COLUMN \`address\` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Địa chỉ của người dùng'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`shops\` MODIFY COLUMN \`description\` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT 'Mô tả về shop'`,
    );

    // policies (title, content)
    await queryRunner.query(
      `ALTER TABLE \`policies\` MODIFY COLUMN \`title\` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Tiêu đề của chính sách'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`policies\` MODIFY COLUMN \`content\` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Nội dung chi tiết của chính sách'`,
    );

    // licenses
    await queryRunner.query(
      `ALTER TABLE \`licenses\` MODIFY COLUMN \`title\` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Tên giấy phép'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`licenses\` MODIFY COLUMN \`description\` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT 'Mô tả giấy phép'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`licenses\` MODIFY COLUMN \`reject_reason\` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT 'Lý do từ chối (nếu có)'`,
    );

    // services
    await queryRunner.query(
      `ALTER TABLE \`services\` MODIFY COLUMN \`name\` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Tên của dịch vụ'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`services\` MODIFY COLUMN \`description\` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT 'Mô tả dịch vụ'`,
    );

    // dresses
    await queryRunner.query(
      `ALTER TABLE \`dresses\` MODIFY COLUMN \`name\` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Tên sản phẩm'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`dresses\` MODIFY COLUMN \`description\` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT 'Mô tả sản phẩm'`,
    );

    // categories
    await queryRunner.query(
      `ALTER TABLE \`categories\` MODIFY COLUMN \`name\` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Tên danh mục sản phẩm'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`categories\` MODIFY COLUMN \`description\` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Mô tả ngắn gọn về danh mục sản phẩm'`,
    );

    // blogs
    await queryRunner.query(
      `ALTER TABLE \`blogs\` MODIFY COLUMN \`title\` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Tiêu đề của blog'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`blogs\` MODIFY COLUMN \`content\` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Nội dung của blog'`,
    );

    // accessories
    await queryRunner.query(
      `ALTER TABLE \`accessories\` MODIFY COLUMN \`name\` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Tên của phụ kiện'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`accessories\` MODIFY COLUMN \`description\` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT 'Mô tả chi tiết về phụ kiện'`,
    );

    // tasks
    await queryRunner.query(
      `ALTER TABLE \`tasks\` MODIFY COLUMN \`title\` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Tiêu đề ngắn gọn của công việc'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`tasks\` MODIFY COLUMN \`description\` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT 'Mô tả chi tiết công việc (có thể để trống)'`,
    );

    // requests
    await queryRunner.query(
      `ALTER TABLE \`requests\` MODIFY COLUMN \`title\` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Tiêu đề yêu cầu'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`requests\` MODIFY COLUMN \`description\` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Mô tả chi tiết yêu cầu'`,
    );

    // milestones
    await queryRunner.query(
      `ALTER TABLE \`milestones\` MODIFY COLUMN \`title\` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Tiêu đề ngắn gọn của mốc công việc'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`milestones\` MODIFY COLUMN \`description\` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT 'Mô tả chi tiết mốc công việc (có thể để trống)'`,
    );

    // complaints
    await queryRunner.query(
      `ALTER TABLE \`complaints\` MODIFY COLUMN \`title\` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Tiêu đề khiếu nại'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`complaints\` MODIFY COLUMN \`description\` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Mô tả chi tiết khiếu nại'`,
    );

    // feedbacks
    await queryRunner.query(
      `ALTER TABLE \`feedbacks\` MODIFY COLUMN \`content\` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Nội dung đánh giá'`,
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async down(queryRunner: QueryRunner): Promise<void> {
    // Không rollback charset/collation để tránh mất dữ liệu}
  }
}
