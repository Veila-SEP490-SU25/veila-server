import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixContractRelationshipAndRequestFieldMapping1752833089412
  implements MigrationInterface
{
  name = 'FixContractRelationshipAndRequestFieldMapping1752833089412';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX \`IDX_d25630554850cb7a2ae2bb10d6\` ON \`contracts\``);
    await queryRunner.query(`ALTER TABLE \`contracts\` DROP COLUMN \`version\``);
    await queryRunner.query(`ALTER TABLE \`order_service_details\` DROP COLUMN \`high\``);
    await queryRunner.query(`ALTER TABLE \`order_service_details\` DROP COLUMN \`weight\``);
    await queryRunner.query(`ALTER TABLE \`order_service_details\` DROP COLUMN \`bust\``);
    await queryRunner.query(`ALTER TABLE \`order_service_details\` DROP COLUMN \`waist\``);
    await queryRunner.query(`ALTER TABLE \`order_service_details\` DROP COLUMN \`hip\``);
    await queryRunner.query(`ALTER TABLE \`order_service_details\` DROP COLUMN \`armpit\``);
    await queryRunner.query(`ALTER TABLE \`order_service_details\` DROP COLUMN \`bicep\``);
    await queryRunner.query(`ALTER TABLE \`order_service_details\` DROP COLUMN \`neck\``);
    await queryRunner.query(`ALTER TABLE \`order_service_details\` DROP COLUMN \`shoulderWidth\``);
    await queryRunner.query(`ALTER TABLE \`order_service_details\` DROP COLUMN \`sleeveLength\``);
    await queryRunner.query(`ALTER TABLE \`order_service_details\` DROP COLUMN \`backLength\``);
    await queryRunner.query(`ALTER TABLE \`order_service_details\` DROP COLUMN \`lowerWaist\``);
    await queryRunner.query(`ALTER TABLE \`order_service_details\` DROP COLUMN \`waistToFloor\``);
    await queryRunner.query(`ALTER TABLE \`order_service_details\` DROP COLUMN \`dressStyle\``);
    await queryRunner.query(
      `ALTER TABLE \`order_service_details\` DROP COLUMN \`curtainNeckline\``,
    );
    await queryRunner.query(`ALTER TABLE \`order_service_details\` DROP COLUMN \`sleeveStyle\``);
    await queryRunner.query(`ALTER TABLE \`order_service_details\` DROP COLUMN \`material\``);
    await queryRunner.query(`ALTER TABLE \`order_service_details\` DROP COLUMN \`color\``);
    await queryRunner.query(`ALTER TABLE \`order_service_details\` DROP COLUMN \`specialElement\``);
    await queryRunner.query(`ALTER TABLE \`order_service_details\` DROP COLUMN \`coverage\``);
    await queryRunner.query(`ALTER TABLE \`order_service_details\` DROP COLUMN \`description\``);
    await queryRunner.query(`ALTER TABLE \`update_order_service_details\` DROP COLUMN \`high\``);
    await queryRunner.query(`ALTER TABLE \`update_order_service_details\` DROP COLUMN \`weight\``);
    await queryRunner.query(`ALTER TABLE \`update_order_service_details\` DROP COLUMN \`bust\``);
    await queryRunner.query(`ALTER TABLE \`update_order_service_details\` DROP COLUMN \`waist\``);
    await queryRunner.query(`ALTER TABLE \`update_order_service_details\` DROP COLUMN \`hip\``);
    await queryRunner.query(`ALTER TABLE \`update_order_service_details\` DROP COLUMN \`armpit\``);
    await queryRunner.query(`ALTER TABLE \`update_order_service_details\` DROP COLUMN \`bicep\``);
    await queryRunner.query(`ALTER TABLE \`update_order_service_details\` DROP COLUMN \`neck\``);
    await queryRunner.query(
      `ALTER TABLE \`update_order_service_details\` DROP COLUMN \`shoulderWidth\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`update_order_service_details\` DROP COLUMN \`sleeveLength\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`update_order_service_details\` DROP COLUMN \`backLength\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`update_order_service_details\` DROP COLUMN \`lowerWaist\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`update_order_service_details\` DROP COLUMN \`waistToFloor\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`update_order_service_details\` DROP COLUMN \`dressStyle\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`update_order_service_details\` DROP COLUMN \`curtainNeckline\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`update_order_service_details\` DROP COLUMN \`sleeveStyle\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`update_order_service_details\` DROP COLUMN \`material\``,
    );
    await queryRunner.query(`ALTER TABLE \`update_order_service_details\` DROP COLUMN \`color\``);
    await queryRunner.query(
      `ALTER TABLE \`update_order_service_details\` DROP COLUMN \`specialElement\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`update_order_service_details\` DROP COLUMN \`coverage\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`update_order_service_details\` DROP COLUMN \`description\``,
    );
    await queryRunner.query(`ALTER TABLE \`shops\` ADD \`contract_id\` varchar(36) NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE \`requests\` ADD \`high\` int UNSIGNED NULL COMMENT 'Chiều cao của cô dâu'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`requests\` ADD \`weight\` int UNSIGNED NULL COMMENT 'Cân nặng'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`requests\` ADD \`bust\` int UNSIGNED NULL COMMENT 'Vòng ngực'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`requests\` ADD \`waist\` int UNSIGNED NULL COMMENT 'Vòng eo'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`requests\` ADD \`hip\` int UNSIGNED NULL COMMENT 'Vòng mông'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`requests\` ADD \`armpit\` int UNSIGNED NULL COMMENT 'Vòng nách'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`requests\` ADD \`bicep\` int UNSIGNED NULL COMMENT 'Vòng bắp tay'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`requests\` ADD \`neck\` int UNSIGNED NULL COMMENT 'Vòng cổ'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`requests\` ADD \`shoulderWidth\` int UNSIGNED NULL COMMENT 'Chiều rộng vai'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`requests\` ADD \`sleeveLength\` int UNSIGNED NULL COMMENT 'Chiều dài tay'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`requests\` ADD \`backLength\` int UNSIGNED NULL COMMENT 'Chiều dài lưng, từ chân cổ đến eo'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`requests\` ADD \`lowerWaist\` int UNSIGNED NULL COMMENT 'Từ chân ngực đến eo'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`requests\` ADD \`waistToFloor\` int UNSIGNED NULL COMMENT 'Độ dài tùng váy'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`requests\` ADD \`dressStyle\` varchar(200) CHARACTER SET "utf8mb4" COLLATE "utf8mb4_unicode_ci" NULL COMMENT 'Kiểu dáng váy'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`requests\` ADD \`curtainNeckline\` varchar(200) CHARACTER SET "utf8mb4" COLLATE "utf8mb4_unicode_ci" NULL COMMENT 'Dạng cổ váy'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`requests\` ADD \`sleeveStyle\` varchar(200) CHARACTER SET "utf8mb4" COLLATE "utf8mb4_unicode_ci" NULL COMMENT 'Dạng tay váy'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`requests\` ADD \`material\` varchar(200) CHARACTER SET "utf8mb4" COLLATE "utf8mb4_unicode_ci" NULL COMMENT 'Chất liệu'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`requests\` ADD \`color\` varchar(200) CHARACTER SET "utf8mb4" COLLATE "utf8mb4_unicode_ci" NULL COMMENT 'Màu sắc'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`requests\` ADD \`specialElement\` varchar(200) CHARACTER SET "utf8mb4" COLLATE "utf8mb4_unicode_ci" NULL COMMENT 'Yếu tố đặc biệt'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`requests\` ADD \`coverage\` varchar(200) CHARACTER SET "utf8mb4" COLLATE "utf8mb4_unicode_ci" NULL COMMENT 'Độ che phủ'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`update_requests\` ADD \`high\` int UNSIGNED NULL COMMENT 'Chiều cao của cô dâu'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`update_requests\` ADD \`weight\` int UNSIGNED NULL COMMENT 'Cân nặng'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`update_requests\` ADD \`bust\` int UNSIGNED NULL COMMENT 'Vòng ngực'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`update_requests\` ADD \`waist\` int UNSIGNED NULL COMMENT 'Vòng eo'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`update_requests\` ADD \`hip\` int UNSIGNED NULL COMMENT 'Vòng mông'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`update_requests\` ADD \`armpit\` int UNSIGNED NULL COMMENT 'Vòng nách'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`update_requests\` ADD \`bicep\` int UNSIGNED NULL COMMENT 'Vòng bắp tay'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`update_requests\` ADD \`neck\` int UNSIGNED NULL COMMENT 'Vòng cổ'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`update_requests\` ADD \`shoulderWidth\` int UNSIGNED NULL COMMENT 'Chiều rộng vai'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`update_requests\` ADD \`sleeveLength\` int UNSIGNED NULL COMMENT 'Chiều dài tay'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`update_requests\` ADD \`backLength\` int UNSIGNED NULL COMMENT 'Chiều dài lưng, từ chân cổ đến eo'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`update_requests\` ADD \`lowerWaist\` int UNSIGNED NULL COMMENT 'Từ chân ngực đến eo'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`update_requests\` ADD \`waistToFloor\` int UNSIGNED NULL COMMENT 'Độ dài tùng váy'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`update_requests\` ADD \`dressStyle\` varchar(200) CHARACTER SET "utf8mb4" COLLATE "utf8mb4_unicode_ci" NULL COMMENT 'Kiểu dáng váy'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`update_requests\` ADD \`curtainNeckline\` varchar(200) CHARACTER SET "utf8mb4" COLLATE "utf8mb4_unicode_ci" NULL COMMENT 'Dạng cổ váy'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`update_requests\` ADD \`sleeveStyle\` varchar(200) CHARACTER SET "utf8mb4" COLLATE "utf8mb4_unicode_ci" NULL COMMENT 'Dạng tay váy'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`update_requests\` ADD \`material\` varchar(200) CHARACTER SET "utf8mb4" COLLATE "utf8mb4_unicode_ci" NULL COMMENT 'Chất liệu'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`update_requests\` ADD \`color\` varchar(200) CHARACTER SET "utf8mb4" COLLATE "utf8mb4_unicode_ci" NULL COMMENT 'Màu sắc'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`update_requests\` ADD \`specialElement\` varchar(200) CHARACTER SET "utf8mb4" COLLATE "utf8mb4_unicode_ci" NULL COMMENT 'Yếu tố đặc biệt'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`update_requests\` ADD \`coverage\` varchar(200) CHARACTER SET "utf8mb4" COLLATE "utf8mb4_unicode_ci" NULL COMMENT 'Độ che phủ'`,
    );
    await queryRunner.query(`ALTER TABLE \`users\` ADD \`contract_id\` varchar(36) NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE \`shops\` ADD CONSTRAINT \`fk_shop_contract\` FOREIGN KEY (\`contract_id\`) REFERENCES \`contracts\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD CONSTRAINT \`fk_user_contract\` FOREIGN KEY (\`contract_id\`) REFERENCES \`contracts\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`fk_user_contract\``);
    await queryRunner.query(`ALTER TABLE \`shops\` DROP FOREIGN KEY \`fk_shop_contract\``);
    await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`contract_id\``);
    await queryRunner.query(`ALTER TABLE \`update_requests\` DROP COLUMN \`coverage\``);
    await queryRunner.query(`ALTER TABLE \`update_requests\` DROP COLUMN \`specialElement\``);
    await queryRunner.query(`ALTER TABLE \`update_requests\` DROP COLUMN \`color\``);
    await queryRunner.query(`ALTER TABLE \`update_requests\` DROP COLUMN \`material\``);
    await queryRunner.query(`ALTER TABLE \`update_requests\` DROP COLUMN \`sleeveStyle\``);
    await queryRunner.query(`ALTER TABLE \`update_requests\` DROP COLUMN \`curtainNeckline\``);
    await queryRunner.query(`ALTER TABLE \`update_requests\` DROP COLUMN \`dressStyle\``);
    await queryRunner.query(`ALTER TABLE \`update_requests\` DROP COLUMN \`waistToFloor\``);
    await queryRunner.query(`ALTER TABLE \`update_requests\` DROP COLUMN \`lowerWaist\``);
    await queryRunner.query(`ALTER TABLE \`update_requests\` DROP COLUMN \`backLength\``);
    await queryRunner.query(`ALTER TABLE \`update_requests\` DROP COLUMN \`sleeveLength\``);
    await queryRunner.query(`ALTER TABLE \`update_requests\` DROP COLUMN \`shoulderWidth\``);
    await queryRunner.query(`ALTER TABLE \`update_requests\` DROP COLUMN \`neck\``);
    await queryRunner.query(`ALTER TABLE \`update_requests\` DROP COLUMN \`bicep\``);
    await queryRunner.query(`ALTER TABLE \`update_requests\` DROP COLUMN \`armpit\``);
    await queryRunner.query(`ALTER TABLE \`update_requests\` DROP COLUMN \`hip\``);
    await queryRunner.query(`ALTER TABLE \`update_requests\` DROP COLUMN \`waist\``);
    await queryRunner.query(`ALTER TABLE \`update_requests\` DROP COLUMN \`bust\``);
    await queryRunner.query(`ALTER TABLE \`update_requests\` DROP COLUMN \`weight\``);
    await queryRunner.query(`ALTER TABLE \`update_requests\` DROP COLUMN \`high\``);
    await queryRunner.query(`ALTER TABLE \`requests\` DROP COLUMN \`coverage\``);
    await queryRunner.query(`ALTER TABLE \`requests\` DROP COLUMN \`specialElement\``);
    await queryRunner.query(`ALTER TABLE \`requests\` DROP COLUMN \`color\``);
    await queryRunner.query(`ALTER TABLE \`requests\` DROP COLUMN \`material\``);
    await queryRunner.query(`ALTER TABLE \`requests\` DROP COLUMN \`sleeveStyle\``);
    await queryRunner.query(`ALTER TABLE \`requests\` DROP COLUMN \`curtainNeckline\``);
    await queryRunner.query(`ALTER TABLE \`requests\` DROP COLUMN \`dressStyle\``);
    await queryRunner.query(`ALTER TABLE \`requests\` DROP COLUMN \`waistToFloor\``);
    await queryRunner.query(`ALTER TABLE \`requests\` DROP COLUMN \`lowerWaist\``);
    await queryRunner.query(`ALTER TABLE \`requests\` DROP COLUMN \`backLength\``);
    await queryRunner.query(`ALTER TABLE \`requests\` DROP COLUMN \`sleeveLength\``);
    await queryRunner.query(`ALTER TABLE \`requests\` DROP COLUMN \`shoulderWidth\``);
    await queryRunner.query(`ALTER TABLE \`requests\` DROP COLUMN \`neck\``);
    await queryRunner.query(`ALTER TABLE \`requests\` DROP COLUMN \`bicep\``);
    await queryRunner.query(`ALTER TABLE \`requests\` DROP COLUMN \`armpit\``);
    await queryRunner.query(`ALTER TABLE \`requests\` DROP COLUMN \`hip\``);
    await queryRunner.query(`ALTER TABLE \`requests\` DROP COLUMN \`waist\``);
    await queryRunner.query(`ALTER TABLE \`requests\` DROP COLUMN \`bust\``);
    await queryRunner.query(`ALTER TABLE \`requests\` DROP COLUMN \`weight\``);
    await queryRunner.query(`ALTER TABLE \`requests\` DROP COLUMN \`high\``);
    await queryRunner.query(`ALTER TABLE \`shops\` DROP COLUMN \`contract_id\``);
    await queryRunner.query(
      `ALTER TABLE \`update_order_service_details\` ADD \`description\` varchar(200) COLLATE "utf8mb4_unicode_ci" NULL COMMENT 'Mô tả thêm'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`update_order_service_details\` ADD \`coverage\` varchar(200) COLLATE "utf8mb4_unicode_ci" NULL COMMENT 'Độ che phủ'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`update_order_service_details\` ADD \`specialElement\` varchar(200) COLLATE "utf8mb4_unicode_ci" NULL COMMENT 'Yếu tố đặc biệt'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`update_order_service_details\` ADD \`color\` varchar(200) COLLATE "utf8mb4_unicode_ci" NULL COMMENT 'Màu sắc'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`update_order_service_details\` ADD \`material\` varchar(200) COLLATE "utf8mb4_unicode_ci" NULL COMMENT 'Chất liệu'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`update_order_service_details\` ADD \`sleeveStyle\` varchar(200) COLLATE "utf8mb4_unicode_ci" NULL COMMENT 'Dạng tay váy'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`update_order_service_details\` ADD \`curtainNeckline\` varchar(200) COLLATE "utf8mb4_unicode_ci" NULL COMMENT 'Dạng cổ váy'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`update_order_service_details\` ADD \`dressStyle\` varchar(200) COLLATE "utf8mb4_unicode_ci" NULL COMMENT 'Kiểu dáng váy'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`update_order_service_details\` ADD \`waistToFloor\` int UNSIGNED NULL COMMENT 'Độ dài tùng váy'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`update_order_service_details\` ADD \`lowerWaist\` int UNSIGNED NULL COMMENT 'Từ chân ngực đến eo'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`update_order_service_details\` ADD \`backLength\` int UNSIGNED NULL COMMENT 'Chiều dài lưng, từ chân cổ đến eo'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`update_order_service_details\` ADD \`sleeveLength\` int UNSIGNED NULL COMMENT 'Chiều dài tay'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`update_order_service_details\` ADD \`shoulderWidth\` int UNSIGNED NULL COMMENT 'Chiều rộng vai'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`update_order_service_details\` ADD \`neck\` int UNSIGNED NULL COMMENT 'Vòng cổ'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`update_order_service_details\` ADD \`bicep\` int UNSIGNED NULL COMMENT 'Vòng bắp tay'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`update_order_service_details\` ADD \`armpit\` int UNSIGNED NULL COMMENT 'Vòng nách'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`update_order_service_details\` ADD \`hip\` int UNSIGNED NULL COMMENT 'Vòng mông'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`update_order_service_details\` ADD \`waist\` int UNSIGNED NULL COMMENT 'Vòng eo'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`update_order_service_details\` ADD \`bust\` int UNSIGNED NULL COMMENT 'Vòng ngực'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`update_order_service_details\` ADD \`weight\` int UNSIGNED NULL COMMENT 'Cân nặng'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`update_order_service_details\` ADD \`high\` int UNSIGNED NULL COMMENT 'Chiều cao của cô dâu'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_service_details\` ADD \`description\` varchar(200) COLLATE "utf8mb4_unicode_ci" NULL COMMENT 'Mô tả thêm'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_service_details\` ADD \`coverage\` varchar(200) COLLATE "utf8mb4_unicode_ci" NULL COMMENT 'Độ che phủ'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_service_details\` ADD \`specialElement\` varchar(200) COLLATE "utf8mb4_unicode_ci" NULL COMMENT 'Yếu tố đặc biệt'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_service_details\` ADD \`color\` varchar(200) COLLATE "utf8mb4_unicode_ci" NULL COMMENT 'Màu sắc'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_service_details\` ADD \`material\` varchar(200) COLLATE "utf8mb4_unicode_ci" NULL COMMENT 'Chất liệu'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_service_details\` ADD \`sleeveStyle\` varchar(200) COLLATE "utf8mb4_unicode_ci" NULL COMMENT 'Dạng tay váy'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_service_details\` ADD \`curtainNeckline\` varchar(200) COLLATE "utf8mb4_unicode_ci" NULL COMMENT 'Dạng cổ váy'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_service_details\` ADD \`dressStyle\` varchar(200) COLLATE "utf8mb4_unicode_ci" NULL COMMENT 'Kiểu dáng váy'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_service_details\` ADD \`waistToFloor\` int UNSIGNED NULL COMMENT 'Độ dài tùng váy'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_service_details\` ADD \`lowerWaist\` int UNSIGNED NULL COMMENT 'Từ chân ngực đến eo'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_service_details\` ADD \`backLength\` int UNSIGNED NULL COMMENT 'Chiều dài lưng, từ chân cổ đến eo'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_service_details\` ADD \`sleeveLength\` int UNSIGNED NULL COMMENT 'Chiều dài tay'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_service_details\` ADD \`shoulderWidth\` int UNSIGNED NULL COMMENT 'Chiều rộng vai'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_service_details\` ADD \`neck\` int UNSIGNED NULL COMMENT 'Vòng cổ'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_service_details\` ADD \`bicep\` int UNSIGNED NULL COMMENT 'Vòng bắp tay'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_service_details\` ADD \`armpit\` int UNSIGNED NULL COMMENT 'Vòng nách'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_service_details\` ADD \`hip\` int UNSIGNED NULL COMMENT 'Vòng mông'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_service_details\` ADD \`waist\` int UNSIGNED NULL COMMENT 'Vòng eo'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_service_details\` ADD \`bust\` int UNSIGNED NULL COMMENT 'Vòng ngực'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_service_details\` ADD \`weight\` int UNSIGNED NULL COMMENT 'Cân nặng'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_service_details\` ADD \`high\` int UNSIGNED NULL COMMENT 'Chiều cao của cô dâu'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`contracts\` ADD \`version\` int NOT NULL COMMENT 'Phiên bản của điều khoản' DEFAULT '1'`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_d25630554850cb7a2ae2bb10d6\` ON \`contracts\` (\`version\`)`,
    );
  }
}
