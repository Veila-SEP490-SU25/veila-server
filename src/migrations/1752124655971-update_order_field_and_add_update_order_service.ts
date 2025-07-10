import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateOrderFieldAndAddUpdateOrderService1752124655971 implements MigrationInterface {
  name = 'UpdateOrderFieldAndAddUpdateOrderService1752124655971';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX \`IDX_bb9c758dcc60137e56f6fee72f\` ON \`shops\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_a18aeabef54c39a7a5a4b4d9aa\` ON \`order_dress_details\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_e89260419bc2817dd3edc4cc25\` ON \`order_service_details\``,
    );
    await queryRunner.query(
      `CREATE TABLE \`update_requests\` (\`id\` varchar(36) NOT NULL, \`images\` text NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`title\` varchar(200) NOT NULL COMMENT 'Tiêu đề yêu cầu', \`description\` text NOT NULL COMMENT 'Mô tả chi tiết yêu cầu', \`status\` enum ('PENDING', 'ACCEPTED', 'REJECTED') NOT NULL COMMENT 'Trạng thái yêu cầu' DEFAULT 'PENDING', \`request_id\` varchar(36) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`update_order_service_details\` (\`id\` varchar(36) NOT NULL, \`images\` text NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`high\` int UNSIGNED NULL COMMENT 'Chiều cao của cô dâu', \`weight\` int UNSIGNED NULL COMMENT 'Cân nặng', \`bust\` int UNSIGNED NULL COMMENT 'Vòng ngực', \`waist\` int UNSIGNED NULL COMMENT 'Vòng eo', \`hip\` int UNSIGNED NULL COMMENT 'Vòng mông', \`armpit\` int UNSIGNED NULL COMMENT 'Vòng nách', \`bicep\` int UNSIGNED NULL COMMENT 'Vòng bắp tay', \`neck\` int UNSIGNED NULL COMMENT 'Vòng cổ', \`shoulderWidth\` int UNSIGNED NULL COMMENT 'Chiều rộng vai', \`sleeveLength\` int UNSIGNED NULL COMMENT 'Chiều dài tay', \`backLength\` int UNSIGNED NULL COMMENT 'Chiều dài lưng, từ chân cổ đến eo', \`lowerWaist\` int UNSIGNED NULL COMMENT 'Từ chân ngực đến eo', \`waistToFloor\` int UNSIGNED NULL COMMENT 'Độ dài tùng váy', \`dressStyle\` varchar(200) CHARACTER SET "utf8mb4" COLLATE "utf8mb4_unicode_ci" NULL COMMENT 'Kiểu dáng váy', \`curtainNeckline\` varchar(200) CHARACTER SET "utf8mb4" COLLATE "utf8mb4_unicode_ci" NULL COMMENT 'Dạng cổ váy', \`sleeveStyle\` varchar(200) CHARACTER SET "utf8mb4" COLLATE "utf8mb4_unicode_ci" NULL COMMENT 'Dạng tay váy', \`material\` varchar(200) CHARACTER SET "utf8mb4" COLLATE "utf8mb4_unicode_ci" NULL COMMENT 'Chất liệu', \`color\` varchar(200) CHARACTER SET "utf8mb4" COLLATE "utf8mb4_unicode_ci" NULL COMMENT 'Màu sắc', \`specialElement\` varchar(200) CHARACTER SET "utf8mb4" COLLATE "utf8mb4_unicode_ci" NULL COMMENT 'Yếu tố đặc biệt', \`coverage\` varchar(200) CHARACTER SET "utf8mb4" COLLATE "utf8mb4_unicode_ci" NULL COMMENT 'Độ che phủ', \`description\` varchar(200) CHARACTER SET "utf8mb4" COLLATE "utf8mb4_unicode_ci" NULL COMMENT 'Mô tả thêm', \`price\` decimal(10,2) UNSIGNED NOT NULL COMMENT 'Phí phụ thu cho yêu cầu cập nhật' DEFAULT '0.00', \`order_service_detail_id\` varchar(36) NOT NULL, \`update_request_id\` varchar(36) NOT NULL, UNIQUE INDEX \`REL_870a22184ad38002baeb10c148\` (\`update_request_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(`ALTER TABLE \`order_service_details\` DROP COLUMN \`version\``);
    await queryRunner.query(`ALTER TABLE \`requests\` DROP COLUMN \`version\``);
    await queryRunner.query(
      `ALTER TABLE \`orders\` ADD \`return_date\` date NULL COMMENT 'Ngày trả hàng (nếu là đơn thuê)'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`orders\` ADD \`is_buy_back\` tinyint NOT NULL COMMENT 'Cửa hàng có mua lại váy cưới sau khi may cho khách không' DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE \`update_requests\` ADD CONSTRAINT \`fk_request_update_request\` FOREIGN KEY (\`request_id\`) REFERENCES \`requests\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`update_order_service_details\` ADD CONSTRAINT \`fk_order_service_detail_update_order_service_detail\` FOREIGN KEY (\`order_service_detail_id\`) REFERENCES \`order_service_details\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`update_order_service_details\` ADD CONSTRAINT \`fk_update_request_update_order_service_detail\` FOREIGN KEY (\`update_request_id\`) REFERENCES \`update_requests\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`update_order_service_details\` DROP FOREIGN KEY \`fk_update_request_update_order_service_detail\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`update_order_service_details\` DROP FOREIGN KEY \`fk_order_service_detail_update_order_service_detail\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`update_requests\` DROP FOREIGN KEY \`fk_request_update_request\``,
    );
    await queryRunner.query(`ALTER TABLE \`orders\` DROP COLUMN \`is_buy_back\``);
    await queryRunner.query(`ALTER TABLE \`orders\` DROP COLUMN \`return_date\``);
    await queryRunner.query(
      `ALTER TABLE \`requests\` ADD \`version\` int UNSIGNED NOT NULL COMMENT 'Phiên bản yêu cầu' DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_service_details\` ADD \`version\` int UNSIGNED NOT NULL COMMENT 'Phiên bản dịch vụ' DEFAULT '1'`,
    );
    await queryRunner.query(
      `DROP INDEX \`REL_870a22184ad38002baeb10c148\` ON \`update_order_service_details\``,
    );
    await queryRunner.query(`DROP TABLE \`update_order_service_details\``);
    await queryRunner.query(`DROP TABLE \`update_requests\``);
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_e89260419bc2817dd3edc4cc25\` ON \`order_service_details\` (\`order_id\`)`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_a18aeabef54c39a7a5a4b4d9aa\` ON \`order_dress_details\` (\`order_id\`)`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_bb9c758dcc60137e56f6fee72f\` ON \`shops\` (\`user_id\`)`,
    );
  }
}
