import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTruckDescription1774828800000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "trucks"
      ADD COLUMN "description" text DEFAULT NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "trucks"
      DROP COLUMN "description"
    `);
  }
}
