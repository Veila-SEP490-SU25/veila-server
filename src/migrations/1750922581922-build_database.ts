import { MigrationInterface, QueryRunner } from 'typeorm';

export class BuildDatabase1750922581922 implements MigrationInterface {
  name = 'BuildDatabase1750922581922';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`users\` (\`id\` varchar(36) NOT NULL, \`images\` text NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`username\` varchar(32) NOT NULL COMMENT 'Tên người dùng, chỉ cho phép chữ cái, số và dấu gạch dưới', \`email\` varchar(64) NOT NULL COMMENT 'Email của người dùng, định dạng chuẩn email', \`password\` varchar(72) NOT NULL COMMENT 'Mật khẩu đã được mã hóa bằng bcrypt (72 ký tự)', \`first_name\` varchar(30) NOT NULL COMMENT 'Tên của người dùng', \`middle_name\` varchar(30) NULL COMMENT 'Tên đệm của người dùng', \`last_name\` varchar(30) NOT NULL COMMENT 'Họ của người dùng', \`phone\` varchar(15) NULL COMMENT 'Số điện thoại của người dùng', \`address\` varchar(255) NULL COMMENT 'Địa chỉ của người dùng', \`birth_date\` date NULL COMMENT 'Ngày sinh của người dùng (YYYY-MM-DD)', \`avatar_url\` varchar(512) NULL COMMENT 'URL ảnh đại diện của người dùng', \`cover_url\` varchar(512) NULL COMMENT 'URL ảnh bìa của người dùng', \`role\` enum ('SUPER_ADMIN', 'ADMIN', 'STAFF', 'SHOP', 'CUSTOMER') NOT NULL COMMENT 'Vai trò của người dùng trong hệ thống (SUPER_ADMIN/ADMIN/STAFF/SHOP/CUSTOMER)' DEFAULT 'CUSTOMER', \`status\` enum ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'BANNED') NOT NULL COMMENT 'Trạng thái tài khoản (ACTIVE/INACTIVE/SUSPENDED/BANNED)' DEFAULT 'ACTIVE', \`is_verified\` tinyint NOT NULL COMMENT 'Đánh dấu người dùng đã xác thực email hay chưa' DEFAULT 0, \`is_identified\` tinyint NOT NULL COMMENT 'Đánh dấu người dùng đã xác thực danh tính (CCCD/CMND) hay chưa' DEFAULT 0, UNIQUE INDEX \`IDX_fe0bb3f6520ee0469504521e71\` (\`username\`), UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`identifiers\` (\`id\` varchar(36) NOT NULL, \`images\` text NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`identifier_type\` enum ('CCCD', 'PASSPORT', 'DRIVER_LICENSE', 'BUSINESS_LICENSE', 'OTHER') NOT NULL COMMENT 'Loại giấy tờ tùy thân', \`status\` enum ('PENDING', 'APPROVED', 'REJECTED', 'EXPIRED', 'SUSPENDED', 'RESUBMIT') NOT NULL COMMENT 'Trạng thái xác thực của giấy tờ' DEFAULT 'PENDING', \`reject_reason\` varchar(255) NULL COMMENT 'Lý do từ chối xác thực (nếu có)', \`user_id\` varchar(36) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`shops\` (\`id\` varchar(36) NOT NULL, \`images\` text NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`name\` varchar(100) NOT NULL COMMENT 'Tên shop', \`tax_code\` varchar(20) NULL COMMENT 'Mã số thuế', \`phone\` varchar(15) NOT NULL COMMENT 'Số điện thoại liên hệ', \`email\` varchar(64) NULL COMMENT 'Email liên hệ', \`address\` varchar(255) NOT NULL COMMENT 'Địa chỉ shop', \`description\` text NULL COMMENT 'Mô tả về shop', \`logo_url\` varchar(512) NULL COMMENT 'URL logo của shop', \`cover_url\` varchar(512) NULL COMMENT 'URL ảnh bìa của shop', \`status\` enum ('PENDING', 'ACTIVE', 'INACTIVE', 'SUSPENDED', 'BANNED') NOT NULL COMMENT 'Trạng thái hoạt động của shop' DEFAULT 'PENDING', \`is_verified\` tinyint NOT NULL COMMENT 'Trạng thái xác thực shop (đã xác minh giấy phép kinh doanh)' DEFAULT 0, \`user_id\` varchar(36) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`licenses\` (\`id\` varchar(36) NOT NULL, \`images\` text NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`license_number\` varchar(50) NOT NULL COMMENT 'Số giấy phép kinh doanh', \`title\` varchar(200) NOT NULL COMMENT 'Tên giấy phép', \`description\` text NULL COMMENT 'Mô tả giấy phép', \`status\` enum ('PENDING', 'APPROVED', 'REJECTED', 'EXPIRED', 'SUSPENDED', 'RESUBMIT') NOT NULL COMMENT 'Trạng thái giấy phép' DEFAULT 'PENDING', \`reject_reason\` varchar(500) NULL COMMENT 'Lý do từ chối (nếu có)', \`shop_id\` varchar(36) NOT NULL, UNIQUE INDEX \`REL_3090f3b0829deac1c2ce2e1efd\` (\`shop_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`policies\` (\`id\` varchar(36) NOT NULL, \`images\` text NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`title\` varchar(255) NOT NULL COMMENT 'Tiêu đề của chính sách', \`content\` text NOT NULL COMMENT 'Nội dung chi tiết của chính sách', \`is_signed\` tinyint NOT NULL COMMENT 'Xác định xem chính sách người dùng ký xác nhận hay chưa' DEFAULT 0, \`shop_id\` varchar(36) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`payment_infos\` (\`id\` varchar(36) NOT NULL, \`images\` text NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`account_number\` varchar(50) NOT NULL COMMENT 'Số tài khoản ngân hàng hoặc ví điện tử', \`account_name\` varchar(100) NOT NULL COMMENT 'Tên chủ tài khoản ngân hàng hoặc ví điện tử', \`user_id\` varchar(36) NOT NULL, \`bank_id\` varchar(36) NOT NULL, UNIQUE INDEX \`IDX_c1cc3413c8dad4b41d9240f600\` (\`account_number\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`transactions\` (\`id\` varchar(36) NOT NULL, \`images\` text NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`from\` varchar(64) NOT NULL COMMENT 'Nguồn chuyển tiền (có thể là user, ví, hệ thống, v.v.)', \`to\` varchar(64) NOT NULL COMMENT 'Nơi nhận tiền (có thể là user, ví, hệ thống, v.v.)', \`from_type_balance\` enum ('available', 'locked') NOT NULL COMMENT 'Loại số dư nguồn chuyển (AVAILABLE/LOCKED)', \`to_type_balance\` enum ('available', 'locked') NOT NULL COMMENT 'Loại số dư nơi nhận (AVAILABLE/LOCKED)', \`amount\` decimal(18,2) UNSIGNED NOT NULL COMMENT 'Số tiền giao dịch (VNĐ)', \`type\` enum ('deposit', 'withdraw', 'transfer', 'payment', 'refund', 'other') NOT NULL COMMENT 'Loại giao dịch', \`status\` enum ('pending', 'completed', 'failed', 'cancelled', 'refunded', 'disputed') NOT NULL COMMENT 'Trạng thái giao dịch' DEFAULT 'pending', \`note\` varchar(255) NULL COMMENT 'Ghi chú giao dịch (nếu có)', \`wallet_id\` varchar(36) NOT NULL, \`order_id\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`wallets\` (\`id\` varchar(36) NOT NULL, \`images\` text NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`available_balance\` decimal(18,2) UNSIGNED NOT NULL COMMENT 'Số dư khả dụng (có thể sử dụng) trong ví, đơn vị VNĐ' DEFAULT '0.00', \`locked_balance\` decimal(18,2) UNSIGNED NOT NULL COMMENT 'Số dư đang bị khóa (không thể sử dụng), đơn vị VNĐ' DEFAULT '0.00', \`user_id\` varchar(36) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`categories\` (\`id\` varchar(36) NOT NULL, \`images\` text NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`name\` varchar(50) NOT NULL COMMENT 'Tên danh mục sản phẩm', \`description\` varchar(255) NOT NULL COMMENT 'Mô tả ngắn gọn về danh mục sản phẩm', \`type\` enum ('BLOG', 'DRESS', 'ACCESSORY', 'SERVICE') NOT NULL COMMENT 'Loại danh mục sản phẩm', \`user_id\` varchar(36) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`blogs\` (\`id\` varchar(36) NOT NULL, \`images\` text NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`title\` varchar(100) NOT NULL COMMENT 'Tiêu đề của blog', \`content\` text NOT NULL COMMENT 'Nội dung của blog', \`is_verified\` tinyint NOT NULL COMMENT 'Trạng thái xác minh của blog' DEFAULT 0, \`status\` enum ('draft', 'published') NOT NULL COMMENT 'Trạng thái của blog' DEFAULT 'draft', \`user_id\` varchar(36) NOT NULL, \`category_id\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`dresses\` (\`id\` varchar(36) NOT NULL, \`images\` text NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`name\` varchar(100) NOT NULL COMMENT 'Tên sản phẩm', \`description\` text NULL COMMENT 'Mô tả sản phẩm', \`quantity\` int UNSIGNED NOT NULL COMMENT 'Số lượng sản phẩm có sẵn' DEFAULT '0', \`sell_price\` decimal(10,2) UNSIGNED NOT NULL COMMENT 'Giá bán sản phẩm' DEFAULT '0.00', \`rental_price\` decimal(10,2) UNSIGNED NOT NULL COMMENT 'Giá cho thuê sản phẩm' DEFAULT '0.00', \`is_sellable\` tinyint NOT NULL COMMENT 'Sản phẩm có thể bán được hay không' DEFAULT 1, \`is_rentable\` tinyint NOT NULL COMMENT 'Sản phẩm có thể cho thuê hay không' DEFAULT 0, \`rating_average\` decimal(3,2) UNSIGNED NOT NULL COMMENT 'Điểm đánh giá trung bình của sản phẩm' DEFAULT '0.00', \`rating_count\` int UNSIGNED NOT NULL COMMENT 'Số lượng đánh giá của sản phẩm' DEFAULT '0', \`status\` enum ('AVAILABLE', 'UNAVAILABLE', 'OUT_OF_STOCK') NOT NULL COMMENT 'Trạng thái của sản phẩm' DEFAULT 'AVAILABLE', \`user_id\` varchar(36) NOT NULL, \`category_id\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`services\` (\`id\` varchar(36) NOT NULL, \`images\` text NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`name\` varchar(100) NOT NULL COMMENT 'Tên của dịch vụ', \`description\` text NULL COMMENT 'Mô tả dịch vụ', \`rating_average\` decimal(3,2) UNSIGNED NOT NULL COMMENT 'Điểm đánh giá trung bình của dịch vụ (từ 0.00 đến 5.00)' DEFAULT '0.00', \`rating_count\` int UNSIGNED NOT NULL COMMENT 'Số lượng đánh giá mà dịch vụ đã nhận được' DEFAULT '0', \`status\` enum ('ACTIVE', 'INACTIVE', 'PENDING', 'SUSPENDED') NOT NULL COMMENT 'Trạng thái dịch vụ' DEFAULT 'INACTIVE', \`user_id\` varchar(36) NOT NULL, \`category_id\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`accessories\` (\`id\` varchar(36) NOT NULL, \`images\` text NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`name\` varchar(100) NOT NULL COMMENT 'Tên của phụ kiện', \`description\` text NULL COMMENT 'Mô tả chi tiết về phụ kiện', \`quantity\` int UNSIGNED NOT NULL COMMENT 'Số lượng phụ kiện có sẵn' DEFAULT '0', \`sell_price\` decimal(10,2) UNSIGNED NOT NULL COMMENT 'Giá bán của phụ kiện' DEFAULT '0.00', \`retail_price\` decimal(10,2) UNSIGNED NOT NULL COMMENT 'Giá bán lẻ của phụ kiện' DEFAULT '0.00', \`is_sellable\` tinyint NOT NULL COMMENT 'Phụ kiện có thể bán hay không' DEFAULT 1, \`is_rentable\` tinyint NOT NULL COMMENT 'Phụ kiện có thể cho thuê hay không' DEFAULT 0, \`status\` enum ('AVAILABLE', 'UNAVAILABLE', 'OUT_OF_STOCK') NOT NULL COMMENT 'Trạng thái của phụ kiện' DEFAULT 'AVAILABLE', \`user_id\` varchar(36) NOT NULL, \`category_id\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`complaints\` (\`id\` varchar(36) NOT NULL, \`images\` text NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`title\` varchar(200) NOT NULL COMMENT 'Tiêu đề khiếu nại', \`description\` text NOT NULL COMMENT 'Mô tả chi tiết khiếu nại', \`status\` enum ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REJECTED', 'CANCELLED') NOT NULL COMMENT 'Trạng thái khiếu nại' DEFAULT 'OPEN', \`sender_id\` varchar(36) NOT NULL, \`order_id\` varchar(36) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`feedbacks\` (\`id\` varchar(36) NOT NULL, \`images\` text NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`content\` text NOT NULL COMMENT 'Nội dung đánh giá', \`rating\` decimal(2,1) UNSIGNED NOT NULL COMMENT 'Điểm đánh giá (từ 0.0 đến 5.0)', \`customer_id\` varchar(36) NOT NULL, \`order_id\` varchar(36) NOT NULL, \`dress_id\` varchar(36) NULL, \`service_id\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`milestones\` (\`id\` varchar(36) NOT NULL, \`images\` text NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`title\` varchar(200) NOT NULL COMMENT 'Tiêu đề ngắn gọn của mốc công việc', \`description\` text NULL COMMENT 'Mô tả chi tiết mốc công việc (có thể để trống)', \`status\` enum ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED') NOT NULL COMMENT 'Trạng thái của mốc công việc' DEFAULT 'PENDING', \`due_date\` datetime NOT NULL COMMENT 'Hạn hoàn thành mốc công việc', \`order_id\` varchar(36) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`orders\` (\`id\` varchar(36) NOT NULL, \`images\` text NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`amount\` decimal(12,2) UNSIGNED NOT NULL COMMENT 'Tổng số tiền của đơn hàng' DEFAULT '0.00', \`type\` enum ('SELL', 'RENT', 'CUSTOM') NOT NULL COMMENT 'Loại đơn hàng', \`status\` enum ('PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED') NOT NULL COMMENT 'Trạng thái đơn hàng' DEFAULT 'PENDING', \`isRated\` tinyint NOT NULL COMMENT 'Đơn hàng đã được đánh giá hay chưa' DEFAULT 0, \`customer_id\` varchar(36) NOT NULL, \`shop_id\` varchar(36) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`order_dress_details\` (\`id\` varchar(36) NOT NULL, \`images\` text NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`assizes\` varchar(50) NOT NULL COMMENT 'Kích cỡ hoặc thông số váy', \`quantity\` int UNSIGNED NOT NULL COMMENT 'Số lượng đặt' DEFAULT '1', \`price\` decimal(10,2) UNSIGNED NOT NULL COMMENT 'Giá váy/phụ kiện tại thời điểm đặt' DEFAULT '0.00', \`order_id\` varchar(36) NOT NULL, \`dress_id\` varchar(36) NULL, \`accessory_id\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`order_service_details\` (\`id\` varchar(36) NOT NULL, \`images\` text NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`price\` decimal(10,2) UNSIGNED NOT NULL COMMENT 'Giá dịch vụ tại thời điểm đặt' DEFAULT '0.00', \`version\` int UNSIGNED NOT NULL COMMENT 'Phiên bản dịch vụ' DEFAULT '1', \`order_id\` varchar(36) NOT NULL, \`request_id\` varchar(36) NULL, \`service_id\` varchar(36) NOT NULL, UNIQUE INDEX \`REL_a5c3c620552ecb20634305ea86\` (\`request_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`requests\` (\`id\` varchar(36) NOT NULL, \`images\` text NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`title\` varchar(200) NOT NULL COMMENT 'Tiêu đề yêu cầu', \`description\` text NOT NULL COMMENT 'Mô tả chi tiết yêu cầu', \`status\` enum ('PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED', 'CANCELLED') NOT NULL COMMENT 'Trạng thái yêu cầu' DEFAULT 'PENDING', \`isPrivate\` tinyint NOT NULL COMMENT 'Yêu cầu này có riêng tư không' DEFAULT 0, \`version\` int UNSIGNED NOT NULL COMMENT 'Phiên bản yêu cầu' DEFAULT '1', \`user_id\` varchar(36) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`tasks\` (\`id\` varchar(36) NOT NULL, \`images\` text NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`title\` varchar(200) NOT NULL COMMENT 'Tiêu đề ngắn gọn của công việc', \`description\` text NULL COMMENT 'Mô tả chi tiết công việc (có thể để trống)', \`status\` enum ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED') NOT NULL COMMENT 'Trạng thái của công việc' DEFAULT 'PENDING', \`due_date\` datetime NOT NULL COMMENT 'Hạn hoàn thành công việc', \`milestone_id\` varchar(36) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`banks\` (\`id\` varchar(36) NOT NULL, \`images\` text NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`name\` varchar(100) NOT NULL COMMENT 'Tên ngân hàng', \`short_name\` varchar(50) NOT NULL COMMENT 'Tên viết tắt của ngân hàng', \`bin\` varchar(20) NOT NULL COMMENT 'Mã BIN của ngân hàng', \`logo_url\` varchar(512) NOT NULL COMMENT 'Đường dẫn URL của logo ngân hàng', \`transfer_support\` tinyint NOT NULL COMMENT 'Hỗ trợ chuyển khoản ngân hàng' DEFAULT 1, \`lookup_support\` tinyint NOT NULL COMMENT 'Hỗ trợ tra cứu thông tin giao dịch' DEFAULT 1, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`identifiers\` ADD CONSTRAINT \`fk_identifier_user\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`shops\` ADD CONSTRAINT \`fk_shop_user\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`licenses\` ADD CONSTRAINT \`fk_license_shop\` FOREIGN KEY (\`shop_id\`) REFERENCES \`shops\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`policies\` ADD CONSTRAINT \`fk_policy_shop\` FOREIGN KEY (\`shop_id\`) REFERENCES \`shops\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`payment_infos\` ADD CONSTRAINT \`fk_payment_info_user\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`payment_infos\` ADD CONSTRAINT \`fk_payment_info_bank\` FOREIGN KEY (\`bank_id\`) REFERENCES \`banks\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`transactions\` ADD CONSTRAINT \`fk_wallet_transaction\` FOREIGN KEY (\`wallet_id\`) REFERENCES \`wallets\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`transactions\` ADD CONSTRAINT \`fk_order_transaction\` FOREIGN KEY (\`order_id\`) REFERENCES \`orders\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`wallets\` ADD CONSTRAINT \`fk_user_wallet\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`categories\` ADD CONSTRAINT \`fk_category_user\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`blogs\` ADD CONSTRAINT \`fk_blog_user\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`blogs\` ADD CONSTRAINT \`fk_blog_category\` FOREIGN KEY (\`category_id\`) REFERENCES \`categories\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`dresses\` ADD CONSTRAINT \`fk_dress_user\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`dresses\` ADD CONSTRAINT \`fk_dress_category\` FOREIGN KEY (\`category_id\`) REFERENCES \`categories\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`services\` ADD CONSTRAINT \`fk_service_user\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`services\` ADD CONSTRAINT \`fk_service_category\` FOREIGN KEY (\`category_id\`) REFERENCES \`categories\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`accessories\` ADD CONSTRAINT \`fk_accessory_user\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`accessories\` ADD CONSTRAINT \`fk_accessory_category\` FOREIGN KEY (\`category_id\`) REFERENCES \`categories\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`complaints\` ADD CONSTRAINT \`fk_sender_complaint\` FOREIGN KEY (\`sender_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`complaints\` ADD CONSTRAINT \`fk_order_complaint\` FOREIGN KEY (\`order_id\`) REFERENCES \`orders\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`feedbacks\` ADD CONSTRAINT \`fk_customer_feedback\` FOREIGN KEY (\`customer_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`feedbacks\` ADD CONSTRAINT \`fk_order_feedback\` FOREIGN KEY (\`order_id\`) REFERENCES \`orders\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`feedbacks\` ADD CONSTRAINT \`fk_dress_feedback\` FOREIGN KEY (\`dress_id\`) REFERENCES \`dresses\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`feedbacks\` ADD CONSTRAINT \`fk_service_feedback\` FOREIGN KEY (\`service_id\`) REFERENCES \`services\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`milestones\` ADD CONSTRAINT \`fk_order_milestone\` FOREIGN KEY (\`order_id\`) REFERENCES \`orders\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`orders\` ADD CONSTRAINT \`fk_customer_order\` FOREIGN KEY (\`customer_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`orders\` ADD CONSTRAINT \`fk_shop_order\` FOREIGN KEY (\`shop_id\`) REFERENCES \`shops\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_dress_details\` ADD CONSTRAINT \`fk_order_order_dress_detail\` FOREIGN KEY (\`order_id\`) REFERENCES \`orders\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_dress_details\` ADD CONSTRAINT \`fk_dress_order_dress_detail\` FOREIGN KEY (\`dress_id\`) REFERENCES \`dresses\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_dress_details\` ADD CONSTRAINT \`fk_accessory_order_dress_detail\` FOREIGN KEY (\`accessory_id\`) REFERENCES \`accessories\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_service_details\` ADD CONSTRAINT \`fk_order_order_service_detail\` FOREIGN KEY (\`order_id\`) REFERENCES \`orders\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_service_details\` ADD CONSTRAINT \`fk_request_order_service_detail\` FOREIGN KEY (\`request_id\`) REFERENCES \`requests\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_service_details\` ADD CONSTRAINT \`fk_service_order_service_detail\` FOREIGN KEY (\`service_id\`) REFERENCES \`services\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`requests\` ADD CONSTRAINT \`fk_user_request\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`tasks\` ADD CONSTRAINT \`fk_milestone_task\` FOREIGN KEY (\`milestone_id\`) REFERENCES \`milestones\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``);
    await queryRunner.query(`DROP INDEX \`IDX_78a916df40e02a9deb1c4b75ed\` ON \`user\``);
    await queryRunner.query(`DROP TABLE \`user\``);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`tasks\` DROP FOREIGN KEY \`fk_milestone_task\``);
    await queryRunner.query(`ALTER TABLE \`requests\` DROP FOREIGN KEY \`fk_user_request\``);
    await queryRunner.query(
      `ALTER TABLE \`order_service_details\` DROP FOREIGN KEY \`fk_service_order_service_detail\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_service_details\` DROP FOREIGN KEY \`fk_request_order_service_detail\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_service_details\` DROP FOREIGN KEY \`fk_order_order_service_detail\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_dress_details\` DROP FOREIGN KEY \`fk_accessory_order_dress_detail\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_dress_details\` DROP FOREIGN KEY \`fk_dress_order_dress_detail\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_dress_details\` DROP FOREIGN KEY \`fk_order_order_dress_detail\``,
    );
    await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`fk_shop_order\``);
    await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`fk_customer_order\``);
    await queryRunner.query(`ALTER TABLE \`milestones\` DROP FOREIGN KEY \`fk_order_milestone\``);
    await queryRunner.query(`ALTER TABLE \`feedbacks\` DROP FOREIGN KEY \`fk_service_feedback\``);
    await queryRunner.query(`ALTER TABLE \`feedbacks\` DROP FOREIGN KEY \`fk_dress_feedback\``);
    await queryRunner.query(`ALTER TABLE \`feedbacks\` DROP FOREIGN KEY \`fk_order_feedback\``);
    await queryRunner.query(`ALTER TABLE \`feedbacks\` DROP FOREIGN KEY \`fk_customer_feedback\``);
    await queryRunner.query(`ALTER TABLE \`complaints\` DROP FOREIGN KEY \`fk_order_complaint\``);
    await queryRunner.query(`ALTER TABLE \`complaints\` DROP FOREIGN KEY \`fk_sender_complaint\``);
    await queryRunner.query(
      `ALTER TABLE \`accessories\` DROP FOREIGN KEY \`fk_accessory_category\``,
    );
    await queryRunner.query(`ALTER TABLE \`accessories\` DROP FOREIGN KEY \`fk_accessory_user\``);
    await queryRunner.query(`ALTER TABLE \`services\` DROP FOREIGN KEY \`fk_service_category\``);
    await queryRunner.query(`ALTER TABLE \`services\` DROP FOREIGN KEY \`fk_service_user\``);
    await queryRunner.query(`ALTER TABLE \`dresses\` DROP FOREIGN KEY \`fk_dress_category\``);
    await queryRunner.query(`ALTER TABLE \`dresses\` DROP FOREIGN KEY \`fk_dress_user\``);
    await queryRunner.query(`ALTER TABLE \`blogs\` DROP FOREIGN KEY \`fk_blog_category\``);
    await queryRunner.query(`ALTER TABLE \`blogs\` DROP FOREIGN KEY \`fk_blog_user\``);
    await queryRunner.query(`ALTER TABLE \`categories\` DROP FOREIGN KEY \`fk_category_user\``);
    await queryRunner.query(`ALTER TABLE \`wallets\` DROP FOREIGN KEY \`fk_user_wallet\``);
    await queryRunner.query(
      `ALTER TABLE \`transactions\` DROP FOREIGN KEY \`fk_order_transaction\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`transactions\` DROP FOREIGN KEY \`fk_wallet_transaction\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`payment_infos\` DROP FOREIGN KEY \`fk_payment_info_bank\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`payment_infos\` DROP FOREIGN KEY \`fk_payment_info_user\``,
    );
    await queryRunner.query(`ALTER TABLE \`policies\` DROP FOREIGN KEY \`fk_policy_shop\``);
    await queryRunner.query(`ALTER TABLE \`licenses\` DROP FOREIGN KEY \`fk_license_shop\``);
    await queryRunner.query(`ALTER TABLE \`shops\` DROP FOREIGN KEY \`fk_shop_user\``);
    await queryRunner.query(`ALTER TABLE \`identifiers\` DROP FOREIGN KEY \`fk_identifier_user\``);
    await queryRunner.query(`DROP TABLE \`banks\``);
    await queryRunner.query(`DROP TABLE \`tasks\``);
    await queryRunner.query(`DROP TABLE \`requests\``);
    await queryRunner.query(
      `DROP INDEX \`REL_a5c3c620552ecb20634305ea86\` ON \`order_service_details\``,
    );
    await queryRunner.query(`DROP TABLE \`order_service_details\``);
    await queryRunner.query(`DROP TABLE \`order_dress_details\``);
    await queryRunner.query(`DROP TABLE \`orders\``);
    await queryRunner.query(`DROP TABLE \`milestones\``);
    await queryRunner.query(`DROP TABLE \`feedbacks\``);
    await queryRunner.query(`DROP TABLE \`complaints\``);
    await queryRunner.query(`DROP TABLE \`accessories\``);
    await queryRunner.query(`DROP TABLE \`services\``);
    await queryRunner.query(`DROP TABLE \`dresses\``);
    await queryRunner.query(`DROP TABLE \`blogs\``);
    await queryRunner.query(`DROP TABLE \`categories\``);
    await queryRunner.query(`DROP TABLE \`wallets\``);
    await queryRunner.query(`DROP TABLE \`transactions\``);
    await queryRunner.query(`DROP INDEX \`IDX_c1cc3413c8dad4b41d9240f600\` ON \`payment_infos\``);
    await queryRunner.query(`DROP TABLE \`payment_infos\``);
    await queryRunner.query(`DROP TABLE \`policies\``);
    await queryRunner.query(`DROP INDEX \`REL_3090f3b0829deac1c2ce2e1efd\` ON \`licenses\``);
    await queryRunner.query(`DROP TABLE \`licenses\``);
    await queryRunner.query(`DROP TABLE \`shops\``);
    await queryRunner.query(`DROP TABLE \`identifiers\``);
    await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
    await queryRunner.query(`DROP INDEX \`IDX_fe0bb3f6520ee0469504521e71\` ON \`users\``);
    await queryRunner.query(`DROP TABLE \`users\``);
    await queryRunner.query(
      `CREATE TABLE \`user\` (\`id\` varchar(36) NOT NULL, \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`username\` varchar(50) NOT NULL, \`email\` varchar(100) NOT NULL, \`password\` varchar(100) NOT NULL, \`firstName\` varchar(50) CHARACTER SET "utf8mb4" COLLATE "utf8mb4_unicode_ci" NOT NULL, \`middleName\` varchar(50) CHARACTER SET "utf8mb4" COLLATE "utf8mb4_unicode_ci" NULL, \`lastName\` varchar(50) CHARACTER SET "utf8mb4" COLLATE "utf8mb4_unicode_ci" NOT NULL, \`phone\` varchar(12) NULL, \`address\` varchar(100) CHARACTER SET "utf8mb4" COLLATE "utf8mb4_unicode_ci" NULL, \`birthDate\` datetime(6) NULL, \`avatarUrl\` varchar(100) NULL, \`coverUrl\` varchar(100) NULL, \`isVerified\` tinyint NOT NULL DEFAULT 0, \`role\` enum ('customer', 'supplier', 'system_operator', 'admin', 'super_admin') NOT NULL DEFAULT 'customer', \`status\` enum ('active', 'inactive', 'suspended', 'deleted', 'banned') NOT NULL DEFAULT 'active', UNIQUE INDEX \`IDX_78a916df40e02a9deb1c4b75ed\` (\`username\`), UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }
}
