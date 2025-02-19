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
  transform: {
    '^.+\\.(t|j)s$': [
      '@swc/jest',
      {
        jsc: {
          parser: {
            syntax: 'typescript',
            tsx: false,
            decorators: true,
          },
          transform: {
            decoratorMetadata: true,
          },
          experimental: {
            plugins: [
              [
                '@lingui/swc-plugin',
                {
                  stripNonEssentialFields: false,
                },
              ],
            ],
          },
        },
      },
    ],
  },
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
  globals: {
    APP_PORT: 4000,
    ADMIN_ACCESS_TOKEN:
      '***REMOVED***',
    EXPIRED_ACCESS_TOKEN:
      '***REMOVED***',
    MEMBER_ACCESS_TOKEN:
      '***REMOVED***',
    GUEST_ACCESS_TOKEN:
      '***REMOVED***',
  },
};

export default jestConfig;
