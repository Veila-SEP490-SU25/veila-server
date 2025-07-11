import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateStatusAndOrderAndSubscription1751973245717 implements MigrationInterface {
  name = 'UpdateStatusAndOrderAndSubscription1751973245717';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`order_dress_details\` DROP FOREIGN KEY \`fk_accessory_order_dress_detail\``,
    );
    await queryRunner.query(
      `CREATE TABLE \`contracts\` (\`id\` varchar(36) NOT NULL, \`images\` text NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`title\` varchar(255) NOT NULL COMMENT 'Tiêu đề của điều khoản', \`content\` text NOT NULL COMMENT 'Nội dung chi tiết của điều khoản', \`is_signed\` tinyint NOT NULL COMMENT 'Xác định xem điều khoản người dùng ký xác nhận hay chưa' DEFAULT 0, \`shop_id\` varchar(36) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`subscriptions\` (\`id\` varchar(36) NOT NULL, \`images\` text NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`name\` varchar(100) NOT NULL COMMENT 'Tiêu đề của gói thành viên', \`description\` varchar(100) CHARACTER SET "utf8mb4" COLLATE "utf8mb4_unicode_ci" NOT NULL COMMENT 'Mô tả chi tiết gói', \`duration\` varchar(255) CHARACTER SET "utf8mb4" COLLATE "utf8mb4_unicode_ci" NOT NULL COMMENT 'Thời gian hiệu lực của gói', \`amount\` decimal(10,2) UNSIGNED NOT NULL COMMENT 'Giá bán của gói' DEFAULT '0.00', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`memberships\` (\`id\` varchar(36) NOT NULL, \`images\` text NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`start_date\` date NOT NULL COMMENT 'Thời gian bắt đầu của gói', \`end_date\` date NOT NULL COMMENT 'Thời hạn hết hiệu lực của gói', \`status\` enum ('ACTIVE', 'INACTIVE') NOT NULL COMMENT 'Trạng thái hoạt động của gói' DEFAULT 'ACTIVE', \`shop_id\` varchar(36) NOT NULL, \`subscription_id\` varchar(36) NOT NULL, \`transaction_id\` varchar(36) NULL, UNIQUE INDEX \`REL_2a12450268aac7e51ce4f4c031\` (\`transaction_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`order_accessory_details\` (\`id\` varchar(36) NOT NULL, \`images\` text NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`quantity\` int UNSIGNED NOT NULL COMMENT 'Số lượng đặt' DEFAULT '1', \`description\` varchar(200) CHARACTER SET "utf8mb4" COLLATE "utf8mb4_unicode_ci" NULL COMMENT 'Mô tả thêm', \`price\` decimal(10,2) UNSIGNED NOT NULL COMMENT 'Giá phụ kiện tại thời điểm đặt' DEFAULT '0.00', \`isRated\` tinyint NOT NULL COMMENT 'phụ kiện đã được đánh giá hay chưa' DEFAULT 0, \`order_id\` varchar(36) NOT NULL, \`accessory_id\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(`ALTER TABLE \`shops\` DROP COLUMN \`tax_code\``);
    await queryRunner.query(`ALTER TABLE \`orders\` DROP COLUMN \`isRated\``);
    await queryRunner.query(`ALTER TABLE \`order_dress_details\` DROP COLUMN \`assizes\``);
    await queryRunner.query(`ALTER TABLE \`order_dress_details\` DROP COLUMN \`quantity\``);
    await queryRunner.query(`ALTER TABLE \`order_dress_details\` DROP COLUMN \`accessory_id\``);
    await queryRunner.query(
      `ALTER TABLE \`accessories\` ADD \`rating_average\` decimal(3,2) UNSIGNED NOT NULL COMMENT 'Điểm đánh giá trung bình của phụ kiện (từ 0.00 đến 5.00)' DEFAULT '0.00'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`accessories\` ADD \`rating_count\` int UNSIGNED NOT NULL COMMENT 'Số lượng đánh giá mà phụ kiện đã nhận được' DEFAULT '0'`,
    );
    await queryRunner.query(`ALTER TABLE \`feedbacks\` ADD \`accessory_id\` varchar(36) NULL`);
    await queryRunner.query(
      `ALTER TABLE \`milestones\` ADD \`index\` int NOT NULL COMMENT 'Số thứ tự các milestone'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`orders\` ADD \`phone\` varchar(15) NOT NULL COMMENT 'Số điện thoại liên hệ'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`orders\` ADD \`email\` varchar(64) NULL COMMENT 'Email liên hệ'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`orders\` ADD \`address\` varchar(255) CHARACTER SET "utf8mb4" COLLATE "utf8mb4_unicode_ci" NOT NULL COMMENT 'Địa chỉ shop'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`orders\` ADD \`due_date\` date NOT NULL COMMENT 'Hạn giao hàng cho khách'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_dress_details\` ADD \`high\` int UNSIGNED NULL COMMENT 'Chiều cao của cô dâu'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_dress_details\` ADD \`weight\` int UNSIGNED NULL COMMENT 'Cân nặng'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_dress_details\` ADD \`bust\` int UNSIGNED NULL COMMENT 'Vòng ngực'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_dress_details\` ADD \`waist\` int UNSIGNED NULL COMMENT 'Vòng eo'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_dress_details\` ADD \`hip\` int UNSIGNED NULL COMMENT 'Vòng mông'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_dress_details\` ADD \`armpit\` int UNSIGNED NULL COMMENT 'Vòng nách'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_dress_details\` ADD \`bicep\` int UNSIGNED NULL COMMENT 'Vòng bắp tay'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_dress_details\` ADD \`neck\` int UNSIGNED NULL COMMENT 'Vòng cổ'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_dress_details\` ADD \`shoulderWidth\` int UNSIGNED NULL COMMENT 'Chiều rộng vai'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_dress_details\` ADD \`sleeveLength\` int UNSIGNED NULL COMMENT 'Chiều dài tay'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_dress_details\` ADD \`backLength\` int UNSIGNED NULL COMMENT 'Chiều dài lưng, từ chân cổ đến eo'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_dress_details\` ADD \`lowerWaist\` int UNSIGNED NULL COMMENT 'Từ chân ngực đến eo'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_dress_details\` ADD \`waistToFloor\` int UNSIGNED NULL COMMENT 'Độ dài tùng váy'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_dress_details\` ADD \`description\` varchar(200) CHARACTER SET "utf8mb4" COLLATE "utf8mb4_unicode_ci" NULL COMMENT 'Mô tả thêm'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_dress_details\` ADD \`isRated\` tinyint NOT NULL COMMENT 'Váy cưới/phụ kiện đã được đánh giá hay chưa' DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_service_details\` ADD \`high\` int UNSIGNED NULL COMMENT 'Chiều cao của cô dâu'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_service_details\` ADD \`weight\` int UNSIGNED NULL COMMENT 'Cân nặng'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_service_details\` ADD \`bust\` int UNSIGNED NULL COMMENT 'Vòng ngực'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_service_details\` ADD \`waist\` int UNSIGNED NULL COMMENT 'Vòng eo'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_service_details\` ADD \`hip\` int UNSIGNED NULL COMMENT 'Vòng mông'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_service_details\` ADD \`armpit\` int UNSIGNED NULL COMMENT 'Vòng nách'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_service_details\` ADD \`bicep\` int UNSIGNED NULL COMMENT 'Vòng bắp tay'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_service_details\` ADD \`neck\` int UNSIGNED NULL COMMENT 'Vòng cổ'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_service_details\` ADD \`shoulderWidth\` int UNSIGNED NULL COMMENT 'Chiều rộng vai'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_service_details\` ADD \`sleeveLength\` int UNSIGNED NULL COMMENT 'Chiều dài tay'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_service_details\` ADD \`backLength\` int UNSIGNED NULL COMMENT 'Chiều dài lưng, từ chân cổ đến eo'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_service_details\` ADD \`lowerWaist\` int UNSIGNED NULL COMMENT 'Từ chân ngực đến eo'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_service_details\` ADD \`waistToFloor\` int UNSIGNED NULL COMMENT 'Độ dài tùng váy'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_service_details\` ADD \`dressStyle\` varchar(200) CHARACTER SET "utf8mb4" COLLATE "utf8mb4_unicode_ci" NULL COMMENT 'Kiểu dáng váy'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_service_details\` ADD \`curtainNeckline\` varchar(200) CHARACTER SET "utf8mb4" COLLATE "utf8mb4_unicode_ci" NULL COMMENT 'Dạng cổ váy'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_service_details\` ADD \`sleeveStyle\` varchar(200) CHARACTER SET "utf8mb4" COLLATE "utf8mb4_unicode_ci" NULL COMMENT 'Dạng tay váy'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_service_details\` ADD \`material\` varchar(200) CHARACTER SET "utf8mb4" COLLATE "utf8mb4_unicode_ci" NULL COMMENT 'Chất liệu'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_service_details\` ADD \`color\` varchar(200) CHARACTER SET "utf8mb4" COLLATE "utf8mb4_unicode_ci" NULL COMMENT 'Màu sắc'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_service_details\` ADD \`specialElement\` varchar(200) CHARACTER SET "utf8mb4" COLLATE "utf8mb4_unicode_ci" NULL COMMENT 'Yếu tố đặc biệt'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_service_details\` ADD \`coverage\` varchar(200) CHARACTER SET "utf8mb4" COLLATE "utf8mb4_unicode_ci" NULL COMMENT 'Độ che phủ'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_service_details\` ADD \`description\` varchar(200) CHARACTER SET "utf8mb4" COLLATE "utf8mb4_unicode_ci" NULL COMMENT 'Mô tả thêm'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_service_details\` ADD \`isRated\` tinyint NOT NULL COMMENT 'Dịch vụ đã được đánh giá hay chưa' DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE \`tasks\` ADD \`index\` int NOT NULL COMMENT 'Số thứ tự các task'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` CHANGE \`is_identified\` \`is_identified\` tinyint NOT NULL COMMENT 'Đánh dấu người dùng đã xác thực danh tính (SDT) hay chưa' DEFAULT 0`,
    );
    await queryRunner.query(`ALTER TABLE \`shops\` DROP FOREIGN KEY \`fk_shop_user\``);
    await queryRunner.query(
      `ALTER TABLE \`shops\` CHANGE \`address\` \`address\` varchar(255) CHARACTER SET "utf8mb4" COLLATE "utf8mb4_unicode_ci" NOT NULL COMMENT 'Địa chỉ shop'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`shops\` CHANGE \`is_verified\` \`is_verified\` tinyint NOT NULL COMMENT 'Trạng thái xác thực shop (đã xác minh giấy phép kinh doanh và ký kết điều khoản)' DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE \`shops\` ADD UNIQUE INDEX \`IDX_bb9c758dcc60137e56f6fee72f\` (\`user_id\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`licenses\` CHANGE \`status\` \`status\` enum ('PENDING', 'APPROVED', 'REJECTED', 'RESUBMIT') NOT NULL COMMENT 'Trạng thái giấy phép' DEFAULT 'PENDING'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`blogs\` CHANGE \`status\` \`status\` enum ('DRAFT', 'PUBLISHED') NOT NULL COMMENT 'Trạng thái của blog' DEFAULT 'DRAFT'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`services\` CHANGE \`status\` \`status\` enum ('ACTIVE', 'INACTIVE') NOT NULL COMMENT 'Trạng thái dịch vụ' DEFAULT 'INACTIVE'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`complaints\` CHANGE \`status\` \`status\` enum ('DRAFT', 'IN_PROGRESS', 'APPROVED', 'REJECTED') NOT NULL COMMENT 'Trạng thái khiếu nại' DEFAULT 'DRAFT'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`orders\` CHANGE \`status\` \`status\` enum ('PENDING', 'IN_PROCESS', 'COMPLETED', 'CANCELLED') NOT NULL COMMENT 'Trạng thái đơn hàng' DEFAULT 'PENDING'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_dress_details\` DROP FOREIGN KEY \`fk_order_order_dress_detail\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_dress_details\` ADD UNIQUE INDEX \`IDX_a18aeabef54c39a7a5a4b4d9aa\` (\`order_id\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_service_details\` DROP FOREIGN KEY \`fk_order_order_service_detail\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_service_details\` ADD UNIQUE INDEX \`IDX_e89260419bc2817dd3edc4cc25\` (\`order_id\`)`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`REL_bb9c758dcc60137e56f6fee72f\` ON \`shops\` (\`user_id\`)`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`REL_a18aeabef54c39a7a5a4b4d9aa\` ON \`order_dress_details\` (\`order_id\`)`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`REL_e89260419bc2817dd3edc4cc25\` ON \`order_service_details\` (\`order_id\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`shops\` ADD CONSTRAINT \`fk_shop_user\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`contracts\` ADD CONSTRAINT \`fk_contract_shop\` FOREIGN KEY (\`shop_id\`) REFERENCES \`shops\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`memberships\` ADD CONSTRAINT \`fk_membership_shop\` FOREIGN KEY (\`shop_id\`) REFERENCES \`shops\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`memberships\` ADD CONSTRAINT \`fk_membership_subscription\` FOREIGN KEY (\`subscription_id\`) REFERENCES \`subscriptions\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`memberships\` ADD CONSTRAINT \`fk_membership_transaction\` FOREIGN KEY (\`transaction_id\`) REFERENCES \`transactions\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`feedbacks\` ADD CONSTRAINT \`fk_accessory_feedback\` FOREIGN KEY (\`accessory_id\`) REFERENCES \`accessories\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_dress_details\` ADD CONSTRAINT \`fk_order_order_dress_detail\` FOREIGN KEY (\`order_id\`) REFERENCES \`orders\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_service_details\` ADD CONSTRAINT \`fk_order_order_service_detail\` FOREIGN KEY (\`order_id\`) REFERENCES \`orders\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_accessory_details\` ADD CONSTRAINT \`fk_order_order_accessory_detail\` FOREIGN KEY (\`order_id\`) REFERENCES \`orders\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_accessory_details\` ADD CONSTRAINT \`fk_accessory_order_accessory_detail\` FOREIGN KEY (\`accessory_id\`) REFERENCES \`accessories\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`order_accessory_details\` DROP FOREIGN KEY \`fk_accessory_order_accessory_detail\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_accessory_details\` DROP FOREIGN KEY \`fk_order_order_accessory_detail\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_service_details\` DROP FOREIGN KEY \`fk_order_order_service_detail\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_dress_details\` DROP FOREIGN KEY \`fk_order_order_dress_detail\``,
    );
    await queryRunner.query(`ALTER TABLE \`feedbacks\` DROP FOREIGN KEY \`fk_accessory_feedback\``);
    await queryRunner.query(
      `ALTER TABLE \`memberships\` DROP FOREIGN KEY \`fk_membership_transaction\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`memberships\` DROP FOREIGN KEY \`fk_membership_subscription\``,
    );
    await queryRunner.query(`ALTER TABLE \`memberships\` DROP FOREIGN KEY \`fk_membership_shop\``);
    await queryRunner.query(`ALTER TABLE \`contracts\` DROP FOREIGN KEY \`fk_contract_shop\``);
    await queryRunner.query(`ALTER TABLE \`shops\` DROP FOREIGN KEY \`fk_shop_user\``);
    await queryRunner.query(
      `DROP INDEX \`REL_e89260419bc2817dd3edc4cc25\` ON \`order_service_details\``,
    );
    await queryRunner.query(
      `DROP INDEX \`REL_a18aeabef54c39a7a5a4b4d9aa\` ON \`order_dress_details\``,
    );
    await queryRunner.query(`DROP INDEX \`REL_bb9c758dcc60137e56f6fee72f\` ON \`shops\``);
    await queryRunner.query(
      `ALTER TABLE \`order_service_details\` DROP INDEX \`IDX_e89260419bc2817dd3edc4cc25\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_service_details\` ADD CONSTRAINT \`fk_order_order_service_detail\` FOREIGN KEY (\`order_id\`) REFERENCES \`orders\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_dress_details\` DROP INDEX \`IDX_a18aeabef54c39a7a5a4b4d9aa\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_dress_details\` ADD CONSTRAINT \`fk_order_order_dress_detail\` FOREIGN KEY (\`order_id\`) REFERENCES \`orders\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`orders\` CHANGE \`status\` \`status\` enum ('PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED') NOT NULL COMMENT 'Trạng thái đơn hàng' DEFAULT 'PENDING'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`complaints\` CHANGE \`status\` \`status\` enum ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REJECTED', 'CANCELLED') NOT NULL COMMENT 'Trạng thái khiếu nại' DEFAULT 'OPEN'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`services\` CHANGE \`status\` \`status\` enum ('ACTIVE', 'INACTIVE', 'PENDING', 'SUSPENDED') NOT NULL COMMENT 'Trạng thái dịch vụ' DEFAULT 'INACTIVE'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`blogs\` CHANGE \`status\` \`status\` enum ('draft', 'published') NOT NULL COMMENT 'Trạng thái của blog' DEFAULT 'draft'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`licenses\` CHANGE \`status\` \`status\` enum ('PENDING', 'APPROVED', 'REJECTED', 'EXPIRED', 'SUSPENDED', 'RESUBMIT') NOT NULL COMMENT 'Trạng thái giấy phép' DEFAULT 'PENDING'`,
    );
    await queryRunner.query(`ALTER TABLE \`shops\` DROP INDEX \`IDX_bb9c758dcc60137e56f6fee72f\``);
    await queryRunner.query(
      `ALTER TABLE \`shops\` CHANGE \`is_verified\` \`is_verified\` tinyint NOT NULL COMMENT 'Trạng thái xác thực shop (đã xác minh giấy phép kinh doanh)' DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`shops\` CHANGE \`address\` \`address\` varchar(255) COLLATE "utf8mb4_unicode_ci" NOT NULL COMMENT 'Địa chỉ của người dùng'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`shops\` ADD CONSTRAINT \`fk_shop_user\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` CHANGE \`is_identified\` \`is_identified\` tinyint NOT NULL COMMENT 'Đánh dấu người dùng đã xác thực danh tính (CCCD/CMND) hay chưa' DEFAULT '0'`,
    );
    await queryRunner.query(`ALTER TABLE \`tasks\` DROP COLUMN \`index\``);
    await queryRunner.query(`ALTER TABLE \`order_service_details\` DROP COLUMN \`isRated\``);
    await queryRunner.query(`ALTER TABLE \`order_service_details\` DROP COLUMN \`description\``);
    await queryRunner.query(`ALTER TABLE \`order_service_details\` DROP COLUMN \`coverage\``);
    await queryRunner.query(`ALTER TABLE \`order_service_details\` DROP COLUMN \`specialElement\``);
    await queryRunner.query(`ALTER TABLE \`order_service_details\` DROP COLUMN \`color\``);
    await queryRunner.query(`ALTER TABLE \`order_service_details\` DROP COLUMN \`material\``);
    await queryRunner.query(`ALTER TABLE \`order_service_details\` DROP COLUMN \`sleeveStyle\``);
    await queryRunner.query(
      `ALTER TABLE \`order_service_details\` DROP COLUMN \`curtainNeckline\``,
    );
    await queryRunner.query(`ALTER TABLE \`order_service_details\` DROP COLUMN \`dressStyle\``);
    await queryRunner.query(`ALTER TABLE \`order_service_details\` DROP COLUMN \`waistToFloor\``);
    await queryRunner.query(`ALTER TABLE \`order_service_details\` DROP COLUMN \`lowerWaist\``);
    await queryRunner.query(`ALTER TABLE \`order_service_details\` DROP COLUMN \`backLength\``);
    await queryRunner.query(`ALTER TABLE \`order_service_details\` DROP COLUMN \`sleeveLength\``);
    await queryRunner.query(`ALTER TABLE \`order_service_details\` DROP COLUMN \`shoulderWidth\``);
    await queryRunner.query(`ALTER TABLE \`order_service_details\` DROP COLUMN \`neck\``);
    await queryRunner.query(`ALTER TABLE \`order_service_details\` DROP COLUMN \`bicep\``);
    await queryRunner.query(`ALTER TABLE \`order_service_details\` DROP COLUMN \`armpit\``);
    await queryRunner.query(`ALTER TABLE \`order_service_details\` DROP COLUMN \`hip\``);
    await queryRunner.query(`ALTER TABLE \`order_service_details\` DROP COLUMN \`waist\``);
    await queryRunner.query(`ALTER TABLE \`order_service_details\` DROP COLUMN \`bust\``);
    await queryRunner.query(`ALTER TABLE \`order_service_details\` DROP COLUMN \`weight\``);
    await queryRunner.query(`ALTER TABLE \`order_service_details\` DROP COLUMN \`high\``);
    await queryRunner.query(`ALTER TABLE \`order_dress_details\` DROP COLUMN \`isRated\``);
    await queryRunner.query(`ALTER TABLE \`order_dress_details\` DROP COLUMN \`description\``);
    await queryRunner.query(`ALTER TABLE \`order_dress_details\` DROP COLUMN \`waistToFloor\``);
    await queryRunner.query(`ALTER TABLE \`order_dress_details\` DROP COLUMN \`lowerWaist\``);
    await queryRunner.query(`ALTER TABLE \`order_dress_details\` DROP COLUMN \`backLength\``);
    await queryRunner.query(`ALTER TABLE \`order_dress_details\` DROP COLUMN \`sleeveLength\``);
    await queryRunner.query(`ALTER TABLE \`order_dress_details\` DROP COLUMN \`shoulderWidth\``);
    await queryRunner.query(`ALTER TABLE \`order_dress_details\` DROP COLUMN \`neck\``);
    await queryRunner.query(`ALTER TABLE \`order_dress_details\` DROP COLUMN \`bicep\``);
    await queryRunner.query(`ALTER TABLE \`order_dress_details\` DROP COLUMN \`armpit\``);
    await queryRunner.query(`ALTER TABLE \`order_dress_details\` DROP COLUMN \`hip\``);
    await queryRunner.query(`ALTER TABLE \`order_dress_details\` DROP COLUMN \`waist\``);
    await queryRunner.query(`ALTER TABLE \`order_dress_details\` DROP COLUMN \`bust\``);
    await queryRunner.query(`ALTER TABLE \`order_dress_details\` DROP COLUMN \`weight\``);
    await queryRunner.query(`ALTER TABLE \`order_dress_details\` DROP COLUMN \`high\``);
    await queryRunner.query(`ALTER TABLE \`orders\` DROP COLUMN \`due_date\``);
    await queryRunner.query(`ALTER TABLE \`orders\` DROP COLUMN \`address\``);
    await queryRunner.query(`ALTER TABLE \`orders\` DROP COLUMN \`email\``);
    await queryRunner.query(`ALTER TABLE \`orders\` DROP COLUMN \`phone\``);
    await queryRunner.query(`ALTER TABLE \`milestones\` DROP COLUMN \`index\``);
    await queryRunner.query(`ALTER TABLE \`feedbacks\` DROP COLUMN \`accessory_id\``);
    await queryRunner.query(`ALTER TABLE \`accessories\` DROP COLUMN \`rating_count\``);
    await queryRunner.query(`ALTER TABLE \`accessories\` DROP COLUMN \`rating_average\``);
    await queryRunner.query(
      `ALTER TABLE \`order_dress_details\` ADD \`accessory_id\` varchar(36) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_dress_details\` ADD \`quantity\` int UNSIGNED NOT NULL COMMENT 'Số lượng đặt' DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_dress_details\` ADD \`assizes\` varchar(50) NOT NULL COMMENT 'Kích cỡ hoặc thông số váy'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`orders\` ADD \`isRated\` tinyint NOT NULL COMMENT 'Đơn hàng đã được đánh giá hay chưa' DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`shops\` ADD \`tax_code\` varchar(20) NULL COMMENT 'Mã số thuế'`,
    );
    await queryRunner.query(`DROP TABLE \`order_accessory_details\``);
    await queryRunner.query(`DROP INDEX \`REL_2a12450268aac7e51ce4f4c031\` ON \`memberships\``);
    await queryRunner.query(`DROP TABLE \`memberships\``);
    await queryRunner.query(`DROP TABLE \`subscriptions\``);
    await queryRunner.query(`DROP TABLE \`contracts\``);
    await queryRunner.query(
      `ALTER TABLE \`order_dress_details\` ADD CONSTRAINT \`fk_accessory_order_dress_detail\` FOREIGN KEY (\`accessory_id\`) REFERENCES \`accessories\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
