import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveUnusedFieldAndFixTypoAndAddBankBin1755072778361 implements MigrationInterface {
  name = 'RemoveUnusedFieldAndFixTypoAndAddBankBin1755072778361';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`notifications\` (\`id\` varchar(36) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`images\``);
    await queryRunner.query(`ALTER TABLE \`contracts\` DROP COLUMN \`images\``);
    await queryRunner.query(`ALTER TABLE \`shops\` DROP COLUMN \`images\``);
    await queryRunner.query(`ALTER TABLE \`wallets\` DROP COLUMN \`images\``);
    await queryRunner.query(`ALTER TABLE \`memberships\` DROP COLUMN \`images\``);
    await queryRunner.query(`ALTER TABLE \`categories\` DROP COLUMN \`images\``);
    await queryRunner.query(`ALTER TABLE \`categories\` DROP COLUMN \`description\``);
    await queryRunner.query(`ALTER TABLE \`milestones\` DROP COLUMN \`images\``);
    await queryRunner.query(`ALTER TABLE \`orders\` DROP COLUMN \`images\``);
    await queryRunner.query(`ALTER TABLE \`orders\` DROP COLUMN \`is_buy_back\``);
    await queryRunner.query(`ALTER TABLE \`order_dress_details\` DROP COLUMN \`images\``);
    await queryRunner.query(`ALTER TABLE \`order_dress_details\` DROP COLUMN \`high\``);
    await queryRunner.query(`ALTER TABLE \`order_service_details\` DROP COLUMN \`images\``);
    await queryRunner.query(`ALTER TABLE \`requests\` DROP COLUMN \`high\``);
    await queryRunner.query(`ALTER TABLE \`requests\` DROP COLUMN \`dressStyle\``);
    await queryRunner.query(`ALTER TABLE \`requests\` DROP COLUMN \`curtainNeckline\``);
    await queryRunner.query(`ALTER TABLE \`requests\` DROP COLUMN \`sleeveStyle\``);
    await queryRunner.query(`ALTER TABLE \`requests\` DROP COLUMN \`material\``);
    await queryRunner.query(`ALTER TABLE \`requests\` DROP COLUMN \`color\``);
    await queryRunner.query(`ALTER TABLE \`requests\` DROP COLUMN \`specialElement\``);
    await queryRunner.query(`ALTER TABLE \`requests\` DROP COLUMN \`coverage\``);
    await queryRunner.query(`ALTER TABLE \`tasks\` DROP COLUMN \`images\``);
    await queryRunner.query(`ALTER TABLE \`order_accessory_details\` DROP COLUMN \`images\``);
    await queryRunner.query(`ALTER TABLE \`update_requests\` DROP COLUMN \`high\``);
    await queryRunner.query(`ALTER TABLE \`update_requests\` DROP COLUMN \`dressStyle\``);
    await queryRunner.query(`ALTER TABLE \`update_requests\` DROP COLUMN \`curtainNeckline\``);
    await queryRunner.query(`ALTER TABLE \`update_requests\` DROP COLUMN \`sleeveStyle\``);
    await queryRunner.query(`ALTER TABLE \`update_requests\` DROP COLUMN \`material\``);
    await queryRunner.query(`ALTER TABLE \`update_requests\` DROP COLUMN \`color\``);
    await queryRunner.query(`ALTER TABLE \`update_requests\` DROP COLUMN \`specialElement\``);
    await queryRunner.query(`ALTER TABLE \`update_requests\` DROP COLUMN \`coverage\``);
    await queryRunner.query(`ALTER TABLE \`update_order_service_details\` DROP COLUMN \`images\``);
    await queryRunner.query(`ALTER TABLE \`transactions\` DROP COLUMN \`images\``);
    await queryRunner.query(`ALTER TABLE \`wallets\` ADD \`bin\` varchar(6) NULL`);
    await queryRunner.query(`ALTER TABLE \`wallets\` ADD \`bankNumber\` varchar(20) NULL`);
    await queryRunner.query(
      `ALTER TABLE \`order_dress_details\` ADD \`height\` int UNSIGNED NULL COMMENT 'Chiều cao của cô dâu'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`requests\` ADD \`height\` int UNSIGNED NULL COMMENT 'Chiều cao của cô dâu'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`update_requests\` ADD \`height\` int UNSIGNED NULL COMMENT 'Chiều cao của cô dâu'`,
    );
    await queryRunner.query(`ALTER TABLE \`wallets\` DROP FOREIGN KEY \`fk_user_wallet\``);
    await queryRunner.query(
      `ALTER TABLE \`wallets\` ADD UNIQUE INDEX \`IDX_92558c08091598f7a4439586cd\` (\`user_id\`)`,
    );
    await queryRunner.query(`ALTER TABLE \`services\` DROP FOREIGN KEY \`fk_service_user\``);
    await queryRunner.query(`ALTER TABLE \`services\` DROP FOREIGN KEY \`fk_service_category\``);
    await queryRunner.query(
      `ALTER TABLE \`services\` ADD UNIQUE INDEX \`IDX_421b94f0ef1cdb407654e67c59\` (\`user_id\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`services\` ADD UNIQUE INDEX \`IDX_1f8d1173481678a035b4a81a4e\` (\`category_id\`)`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`REL_92558c08091598f7a4439586cd\` ON \`wallets\` (\`user_id\`)`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`REL_421b94f0ef1cdb407654e67c59\` ON \`services\` (\`user_id\`)`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`REL_1f8d1173481678a035b4a81a4e\` ON \`services\` (\`category_id\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`wallets\` ADD CONSTRAINT \`fk_user_wallet\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`services\` ADD CONSTRAINT \`fk_service_user\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`services\` ADD CONSTRAINT \`fk_service_category\` FOREIGN KEY (\`category_id\`) REFERENCES \`categories\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`services\` DROP FOREIGN KEY \`fk_service_category\``);
    await queryRunner.query(`ALTER TABLE \`services\` DROP FOREIGN KEY \`fk_service_user\``);
    await queryRunner.query(`ALTER TABLE \`wallets\` DROP FOREIGN KEY \`fk_user_wallet\``);
    await queryRunner.query(`DROP INDEX \`REL_1f8d1173481678a035b4a81a4e\` ON \`services\``);
    await queryRunner.query(`DROP INDEX \`REL_421b94f0ef1cdb407654e67c59\` ON \`services\``);
    await queryRunner.query(`DROP INDEX \`REL_92558c08091598f7a4439586cd\` ON \`wallets\``);
    await queryRunner.query(
      `ALTER TABLE \`services\` DROP INDEX \`IDX_1f8d1173481678a035b4a81a4e\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`services\` DROP INDEX \`IDX_421b94f0ef1cdb407654e67c59\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`services\` ADD CONSTRAINT \`fk_service_category\` FOREIGN KEY (\`category_id\`) REFERENCES \`categories\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`services\` ADD CONSTRAINT \`fk_service_user\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`wallets\` DROP INDEX \`IDX_92558c08091598f7a4439586cd\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`wallets\` ADD CONSTRAINT \`fk_user_wallet\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`ALTER TABLE \`update_requests\` DROP COLUMN \`height\``);
    await queryRunner.query(`ALTER TABLE \`requests\` DROP COLUMN \`height\``);
    await queryRunner.query(`ALTER TABLE \`order_dress_details\` DROP COLUMN \`height\``);
    await queryRunner.query(`ALTER TABLE \`wallets\` DROP COLUMN \`bankNumber\``);
    await queryRunner.query(`ALTER TABLE \`wallets\` DROP COLUMN \`bin\``);
    await queryRunner.query(`ALTER TABLE \`transactions\` ADD \`images\` text NULL`);
    await queryRunner.query(
      `ALTER TABLE \`update_order_service_details\` ADD \`images\` text NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`update_requests\` ADD \`coverage\` varchar(200) COLLATE "utf8mb4_unicode_ci" NULL COMMENT 'Độ che phủ'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`update_requests\` ADD \`specialElement\` varchar(200) COLLATE "utf8mb4_unicode_ci" NULL COMMENT 'Yếu tố đặc biệt'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`update_requests\` ADD \`color\` varchar(200) COLLATE "utf8mb4_unicode_ci" NULL COMMENT 'Màu sắc'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`update_requests\` ADD \`material\` varchar(200) COLLATE "utf8mb4_unicode_ci" NULL COMMENT 'Chất liệu'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`update_requests\` ADD \`sleeveStyle\` varchar(200) COLLATE "utf8mb4_unicode_ci" NULL COMMENT 'Dạng tay váy'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`update_requests\` ADD \`curtainNeckline\` varchar(200) COLLATE "utf8mb4_unicode_ci" NULL COMMENT 'Dạng cổ váy'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`update_requests\` ADD \`dressStyle\` varchar(200) COLLATE "utf8mb4_unicode_ci" NULL COMMENT 'Kiểu dáng váy'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`update_requests\` ADD \`high\` int UNSIGNED NULL COMMENT 'Chiều cao của cô dâu'`,
    );
    await queryRunner.query(`ALTER TABLE \`order_accessory_details\` ADD \`images\` text NULL`);
    await queryRunner.query(`ALTER TABLE \`tasks\` ADD \`images\` text NULL`);
    await queryRunner.query(
      `ALTER TABLE \`requests\` ADD \`coverage\` varchar(200) COLLATE "utf8mb4_unicode_ci" NULL COMMENT 'Độ che phủ'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`requests\` ADD \`specialElement\` varchar(200) COLLATE "utf8mb4_unicode_ci" NULL COMMENT 'Yếu tố đặc biệt'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`requests\` ADD \`color\` varchar(200) COLLATE "utf8mb4_unicode_ci" NULL COMMENT 'Màu sắc'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`requests\` ADD \`material\` varchar(200) COLLATE "utf8mb4_unicode_ci" NULL COMMENT 'Chất liệu'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`requests\` ADD \`sleeveStyle\` varchar(200) COLLATE "utf8mb4_unicode_ci" NULL COMMENT 'Dạng tay váy'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`requests\` ADD \`curtainNeckline\` varchar(200) COLLATE "utf8mb4_unicode_ci" NULL COMMENT 'Dạng cổ váy'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`requests\` ADD \`dressStyle\` varchar(200) COLLATE "utf8mb4_unicode_ci" NULL COMMENT 'Kiểu dáng váy'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`requests\` ADD \`high\` int UNSIGNED NULL COMMENT 'Chiều cao của cô dâu'`,
    );
    await queryRunner.query(`ALTER TABLE \`order_service_details\` ADD \`images\` text NULL`);
    await queryRunner.query(
      `ALTER TABLE \`order_dress_details\` ADD \`high\` int UNSIGNED NULL COMMENT 'Chiều cao của cô dâu'`,
    );
    await queryRunner.query(`ALTER TABLE \`order_dress_details\` ADD \`images\` text NULL`);
    await queryRunner.query(
      `ALTER TABLE \`orders\` ADD \`is_buy_back\` tinyint NOT NULL COMMENT 'Cửa hàng có mua lại váy cưới sau khi may cho khách không' DEFAULT '0'`,
    );
    await queryRunner.query(`ALTER TABLE \`orders\` ADD \`images\` text NULL`);
    await queryRunner.query(`ALTER TABLE \`milestones\` ADD \`images\` text NULL`);
    await queryRunner.query(
      `ALTER TABLE \`categories\` ADD \`description\` varchar(255) COLLATE "utf8mb4_unicode_ci" NOT NULL COMMENT 'Mô tả ngắn gọn về danh mục sản phẩm'`,
    );
    await queryRunner.query(`ALTER TABLE \`categories\` ADD \`images\` text NULL`);
    await queryRunner.query(`ALTER TABLE \`memberships\` ADD \`images\` text NULL`);
    await queryRunner.query(`ALTER TABLE \`wallets\` ADD \`images\` text NULL`);
    await queryRunner.query(`ALTER TABLE \`shops\` ADD \`images\` text NULL`);
    await queryRunner.query(`ALTER TABLE \`contracts\` ADD \`images\` text NULL`);
    await queryRunner.query(`ALTER TABLE \`users\` ADD \`images\` text NULL`);
    await queryRunner.query(`DROP TABLE \`notifications\``);
  }
}
