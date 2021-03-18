const baseConfig = {
    testEnvironment: 'node',
    coveragePathIgnorePatterns: ['/node_modules/'],
    moduleFileExtensions: ['ts', 'js'],
    moduleDirectories: ['node_modules', 'src'],
    setupFiles: ['dotenv/config'],
    rootDir: './src/',
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
};

module.exports = {
    projects: [
        {
            ...baseConfig,
            displayName: 'integration-tests',
            testRegex: ['integration-test.ts'],
            runner: '<rootDir>/../jest-serial-runner.js',
            globalSetup: '<rootDir>/test-support/integration-tests-global-setup.ts',
            globalTeardown: '<rootDir>/test-support/integration-tests-global-teardown.ts',
        },
        {
            ...baseConfig,
            displayName: 'unit-tests',
            testPathIgnorePatterns: ['integration-test.ts'],
        },
    ],
};
