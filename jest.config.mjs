/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

/** @type {import('jest').Config} */
const config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['src'],
    transform: {
        '^.+\\.ts$': 'ts-jest',
        '^.+\\.js$': 'ts-jest',
        '^.+\\.tsx$': 'ts-jest',
        '^.+\\.jsx$': 'ts-jest',
    },
    resetMocks: false,
    setupFilesAfterEnv: ['jest-localstorage-mock'],
    collectCoverage: true,
    coverageProvider: 'v8',
    verbose: true,
}

export default config
