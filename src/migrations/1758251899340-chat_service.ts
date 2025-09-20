import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChatService1758251899340 implements MigrationInterface {
  name = 'ChatService1758251899340';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`conversations\` (\`id\` varchar(36) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`user1_id\` varchar(36) NOT NULL, \`user2_id\` varchar(36) NOT NULL, UNIQUE INDEX \`IDX_1a69b7033f6df8cc487802f34f\` (\`user1_id\`, \`user2_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`messages\` (\`id\` varchar(36) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`content\` text CHARACTER SET "utf8mb4" COLLATE "utf8mb4_unicode_ci" NOT NULL, \`images\` text NULL, \`conversation_id\` varchar(36) NOT NULL, \`sender_id\` varchar(36) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`conversations\` ADD CONSTRAINT \`fk_conversation_user1\` FOREIGN KEY (\`user1_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`conversations\` ADD CONSTRAINT \`fk_conversation_user2\` FOREIGN KEY (\`user2_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`messages\` ADD CONSTRAINT \`fk_message_conversation\` FOREIGN KEY (\`conversation_id\`) REFERENCES \`conversations\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`messages\` ADD CONSTRAINT \`fk_message_sender\` FOREIGN KEY (\`sender_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`messages\` DROP FOREIGN KEY \`fk_message_sender\``);
    await queryRunner.query(
      `ALTER TABLE \`messages\` DROP FOREIGN KEY \`fk_message_conversation\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`conversations\` DROP FOREIGN KEY \`fk_conversation_user2\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`conversations\` DROP FOREIGN KEY \`fk_conversation_user1\``,
    );
    await queryRunner.query(`DROP TABLE \`messages\``);
    await queryRunner.query(`DROP INDEX \`IDX_1a69b7033f6df8cc487802f34f\` ON \`conversations\``);
    await queryRunner.query(`DROP TABLE \`conversations\``);
  }
}
