require('./loadenv');

const isProductionEnv = process.env.ENVIRONMENT === 'prod';

module.exports = {
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: 5432,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: [isProductionEnv ? 'dist/entities/**/*.js' : 'src/entities/**/*.ts'],
    migrations: [isProductionEnv ? 'dist/migrations/**/*.js' : 'src/migrations/**/*.ts'],
    cli: {
        migrationsDir: 'src/migrations',
    },
};
