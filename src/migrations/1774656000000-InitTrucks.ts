import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitTrucks1774656000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "trucks" (
        "code"   varchar NOT NULL,
        "name"   varchar NOT NULL,
        "status" varchar NOT NULL DEFAULT 'Out Of Service',
        CONSTRAINT "PK_trucks" PRIMARY KEY ("code")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "trucks"`);
  }
}
