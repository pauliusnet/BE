const { TEST_DATABASE_NAME, makePgClient } = require('./database-helpers');

async function globalIntegrationTestsTeardown(): Promise<void> {
    console.log(`Global teardown: Destroying test database ${TEST_DATABASE_NAME}...`);
    await destroyTestDatabase();
}

export async function destroyTestDatabase(): Promise<void> {
    const client = await makePgClient();
    await client.query(`DROP DATABASE IF EXISTS ${TEST_DATABASE_NAME};`);
    await client.end();
}

export default globalIntegrationTestsTeardown;
