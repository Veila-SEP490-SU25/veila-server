import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigration1750922326359 implements MigrationInterface {
    name = 'InitMigration1750922326359'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` varchar(36) NOT NULL, \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`username\` varchar(50) NOT NULL, \`email\` varchar(100) NOT NULL, \`password\` varchar(100) NOT NULL, \`firstName\` varchar(50) CHARACTER SET "utf8mb4" COLLATE "utf8mb4_unicode_ci" NOT NULL, \`middleName\` varchar(50) CHARACTER SET "utf8mb4" COLLATE "utf8mb4_unicode_ci" NULL, \`lastName\` varchar(50) CHARACTER SET "utf8mb4" COLLATE "utf8mb4_unicode_ci" NOT NULL, \`phone\` varchar(12) NULL, \`address\` varchar(100) CHARACTER SET "utf8mb4" COLLATE "utf8mb4_unicode_ci" NULL, \`birthDate\` datetime(6) NULL, \`avatarUrl\` varchar(100) NULL, \`coverUrl\` varchar(100) NULL, \`isVerified\` tinyint NOT NULL DEFAULT 0, \`role\` enum ('customer', 'supplier', 'system_operator', 'admin', 'super_admin') NOT NULL DEFAULT 'customer', \`status\` enum ('active', 'inactive', 'suspended', 'deleted', 'banned') NOT NULL DEFAULT 'active', UNIQUE INDEX \`IDX_78a916df40e02a9deb1c4b75ed\` (\`username\`), UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``);
        await queryRunner.query(`DROP INDEX \`IDX_78a916df40e02a9deb1c4b75ed\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
    }

}
