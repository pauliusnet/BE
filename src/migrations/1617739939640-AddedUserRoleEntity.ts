import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedUserRoleEntity1617739939640 implements MigrationInterface {
    name = 'AddedUserRoleEntity1617739939640';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "role_type_enum" AS ENUM('ADMIN', 'CUSTOMER', 'REFEREE', 'INSTRUCTOR')`);
        await queryRunner.query(
            `CREATE TABLE "role" ("id" SERIAL NOT NULL, "type" "role_type_enum" NOT NULL, CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(`ALTER TABLE "user" ADD "roleId" integer`);
        await queryRunner.query(
            `ALTER TABLE "user" ADD CONSTRAINT "FK_c28e52f758e7bbc53828db92194" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(`INSERT INTO "role" (type) VALUES ('ADMIN')`);
        await queryRunner.query(`INSERT INTO "role" (type) VALUES ('CUSTOMER')`);
        await queryRunner.query(`INSERT INTO "role" (type) VALUES ('REFEREE')`);
        await queryRunner.query(`INSERT INTO "role" (type) VALUES ('INSTRUCTOR')`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_c28e52f758e7bbc53828db92194"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "roleId"`);
        await queryRunner.query(`DROP TABLE "role"`);
        await queryRunner.query(`DROP TYPE "role_type_enum"`);
    }
}
