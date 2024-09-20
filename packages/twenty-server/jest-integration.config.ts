import { JestConfigWithTsJest, pathsToModuleNameMapper } from 'ts-jest';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const tsConfig = require('./tsconfig.json');

const jestConfig: JestConfigWithTsJest = {
  silent: false,
  verbose: true,
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testEnvironment: 'node',
  testRegex: '.integration-spec.ts$',
  modulePathIgnorePatterns: ['<rootDir>/dist'],
  globalSetup: '<rootDir>/test/utils/setup-test.ts',
  globalTeardown: '<rootDir>/test/utils/teardown-test.ts',
  testTimeout: 15000,
  moduleNameMapper: {
    ...pathsToModuleNameMapper(tsConfig.compilerOptions.paths),
    'twenty-emails': '<rootDir>/../twenty-emails/dist/index.js',
  },
  fakeTimers: {
    enableGlobally: true,
  },
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  globals: {
    APP_PORT: 4000,
    ACCESS_TOKEN:
      '***REMOVED***',
  },
};

export default jestConfig;
