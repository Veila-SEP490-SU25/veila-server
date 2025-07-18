import { MigrationInterface, QueryRunner } from 'typeorm';

export class DeleteTableUnused1752812933589 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('payment_infos', true, true, true);
    await queryRunner.dropTable('banks', true, true, true);
    await queryRunner.dropTable('identifiers', true, true, true);
    await queryRunner.dropTable('policies', true, true, true);
    await queryRunner.dropTable('contract_acceptances', true, true, true);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
