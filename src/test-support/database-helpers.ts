import { Client } from 'pg';
import { Connection, createConnection } from 'typeorm';
import ormConfig from '../../ormconfig';

export const TEST_DATABASE_NAME = ormConfig.database + '_test';

export function useTestDatabase(): void {
    let connection: Connection;

    beforeAll(async () => {
        connection = await createConnection({ ...ormConfig, database: TEST_DATABASE_NAME });
    });

    beforeEach(async () => {
        await clearDatabaseTables(connection);
    });

    afterAll(async () => {
        await connection.close();
    });
}

async function clearDatabaseTables(connection: Connection): Promise<void> {
    await Promise.all(
        connection.entityMetadatas.map(async (entity) => {
            const repository = connection.getRepository(entity.name);
            await repository.query(`TRUNCATE TABLE ${entity.tableName} CASCADE`);
        })
    );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function makePgClient(): Promise<any> {
    const client = new Client({
        user: ormConfig.username,
        host: ormConfig.host,
        password: ormConfig.password,
        port: ormConfig.port,
        database: ormConfig.database,
    });
    await client.connect();
    return client;
}
