const { createConnection } = require('typeorm');
require('ts-node/register');
const { TEST_DATABASE_NAME, makePgClient } = require('./database-helpers');
const ormConfig = require('../../ormconfig');

async function globalIntegrationTestsSetup(): Promise<void> {
    console.log(`Global setup: Creating test database ${TEST_DATABASE_NAME}...`);
    await createTestDatabase();
    await runDatabaseMigrations();
}

async function createTestDatabase(): Promise<void> {
    const client = await makePgClient();
    await client.query(`DROP DATABASE IF EXISTS ${TEST_DATABASE_NAME}`);
    await client.query(`CREATE DATABASE ${TEST_DATABASE_NAME}`);
    await client.end();
}

async function runDatabaseMigrations(): Promise<void> {
    const connection = await createConnection({
        ...ormConfig,
        database: TEST_DATABASE_NAME,
        migrationsRun: true,
    });
    await connection.close();
}

export default globalIntegrationTestsSetup;
