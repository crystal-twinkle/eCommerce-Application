module.exports = {
  globals: {
    NODE_ENV: 'test',
  },
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleDirectories: ['node_modules', 'src'],
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  verbose: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  reporters: [
    'default',
    [
      'jest-html-reporter',
      {
        outputPath: 'test-report.html',
      },
    ],
  ],
};
