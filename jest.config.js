export default {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testMatch: ['**/tests/**/*.test.js'],
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  transformIgnorePatterns: [],
  testPathIgnorePatterns: ['/node_modules/', '/client/', '/flutter_client/'],
  collectCoverageFrom: [
    'server/**/*.js',
    '!server/**/*.test.js',
    '!**/node_modules/**',
    '!server/server.js', // <-- Add this line to exclude server.js
  ],
  testTimeout: 30000,
  moduleDirectories: ['node_modules', '<rootDir>'],
  moduleFileExtensions: ['js'],
  resolver: undefined,
  clearMocks: true,
  verbose: true,
};