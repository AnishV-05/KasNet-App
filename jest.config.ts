import type { Config } from "jest";

import tsConfigPath from "./.jest/jest.utils";
import tsConfig from "./tsconfig.json";

const config: Config = {
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!**/node_modules/**',
    '!src/**/layout/**',
    '!src/**/bootstrap.ts',
    '!src/**/screens.tsx',
    '!src/**/index.ts',
  ],
  coverageDirectory: '.jest/reports/coverage',
  coverageReporters: ['json', 'text', 'lcov', 'html'],
  moduleNameMapper: {
    '\\.(css|scss)$': 'identity-obj-proxy',
    '^.+\\.svg$': '<rootDir>/.jest/__mocks__/dom.mock.ts',
    jose: require.resolve('jose'),
    ...tsConfigPath(tsConfig),
  },
  preset: 'ts-jest',
  reporters: [
    'default',
    [
      'jest-html-reporters',
      {
        filename: 'result.html',
        pageTitle: 'Unit Test',
        publicPath: '.jest/reports/unit',
      },
    ],
    [
      'jest-sonar',
      {
        outputDirectory: '.jest/reports/sonar',
        outputName: 'unit.xml',
      },
    ],
  ],
  setupFilesAfterEnv: ['<rootDir>/.jest/jest.envs.ts', '<rootDir>/.jest/jest.setup.ts', 'jest-canvas-mock'],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$|axios)/'],
}
export default config;
