import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\..*spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': '@swc/jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '.interface.ts',
    '-interface.ts',
    'shared-module/testing',
    'shared-module-module/testing',
    'validator-rules.ts',
    '-fixture.ts',
    '.input.ts',
    '.d.ts',
  ],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
  testEnvironment: 'node',
  moduleNameMapper: {
    '@core/(.*)': '<rootDir>/src/$1',
    '@nest/(.*)': '<rootDir>/src/$1',
  },
  clearMocks: true,
  coverageProvider: 'v8',
  setupFilesAfterEnv: [
    './core/shared/infra/testing/expect-helpers.ts',
    './core/shared/infra/testing/global-helpers.ts',
  ],
};

export default config;
