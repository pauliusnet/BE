require('dotenv');

const isProductionEnv = process.env.ENVIRONMENT === 'prod';
const sslEnabled = process.env.DATABASE_SSL === 'true';

module.exports = {
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: 5432,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: [isProductionEnv ? 'dist/entities/**/*.js' : 'src/entities/**/*.ts'],
    migrations: [isProductionEnv ? 'dist/migrations/**/*.js' : 'src/migrations/**/*.ts'],
    ssl: sslEnabled,
    extra: {
        ssl: sslEnabled ? { rejectUnauthorized: false } : undefined,
    },

    cli: {
        migrationsDir: 'src/migrations',
    },
};
