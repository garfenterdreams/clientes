import { JestConfigWithTsJest, pathsToModuleNameMapper } from 'ts-jest';

const isBillingEnabled = process.env.IS_BILLING_ENABLED === 'true';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const tsConfig = require('./tsconfig.json');

const jestConfig: JestConfigWithTsJest = {
  silent: false,
  verbose: true,
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testEnvironment: 'node',
  testRegex: isBillingEnabled
    ? 'integration-spec.ts'
    : '^(?!.*billing).*\\.integration-spec\\.ts$',
  modulePathIgnorePatterns: ['<rootDir>/dist'],
  globalSetup: '<rootDir>/test/integration/utils/setup-test.ts',
  globalTeardown: '<rootDir>/test/integration/utils/teardown-test.ts',
  testTimeout: 15000,
  maxWorkers: 1,
  moduleNameMapper: {
    ...pathsToModuleNameMapper(tsConfig.compilerOptions.paths, {
      prefix: '<rootDir>/../..',
    }),
    '^test/(.*)$': '<rootDir>/test/$1',
    'twenty-emails': '<rootDir>/../twenty-emails/dist/index.js',
    'twenty-shared': '<rootDir>/../twenty-shared/dist/index.js',
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
