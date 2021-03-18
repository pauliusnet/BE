import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatedTrick1616009564041 implements MigrationInterface {
    name = 'CreatedTrick1616009564041';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "trick" ("id" SERIAL NOT NULL, "videoURL" character varying NOT NULL, "level" integer NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_772aef630203cf32866efaaefd1" PRIMARY KEY ("id"))`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "trick"`);
    }
}
