module.exports = {
  // Test environment
  testEnvironment: 'node',
  
  // Test file patterns
  testMatch: [
    '**/__tests__/**/*.js',
    '**/?(*.)+(spec|test).js',
    '**/?(*.)+(spec|test).ts'
  ],
  
  // Coverage configuration
  collectCoverageFrom: [
    'src/**/*.{js,ts}',
    '!src/**/*.d.ts',
    '!src/**/*.test.{js,ts}',
    '!src/**/*.spec.{js,ts}',
    '!src/**/__tests__/**',
    '!src/**/coverage/**'
  ],
  
  // Coverage thresholds
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
  
  // Coverage reporters
  coverageReporters: [
    'text',
    'lcov',
    'html'
  ],
  
  // Coverage directory
  coverageDirectory: 'coverage',
  
  // Clear mocks between tests
  clearMocks: true,
  
  // Restore mocks between tests
  restoreMocks: true,
  
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  
  // Module name mapping
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/config/(.*)$': '<rootDir>/src/config/$1',
    '^@/routes/(.*)$': '<rootDir>/src/routes/$1',
    '^@/middleware/(.*)$': '<rootDir>/src/middleware/$1',
    '^@/utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@/models/(.*)$': '<rootDir>/src/models/$1'
  },
  
  // Transform configuration
  transform: {
    '^.+\\.ts$': 'ts-jest',
    '^.+\\.js$': 'babel-jest'
  },
  
  // Transform ignore patterns
  transformIgnorePatterns: [
    '/node_modules/',
    '\\.pnp\\.[^\\/]+$'
  ],
  
  // Module file extensions
  moduleFileExtensions: ['ts', 'js', 'json'],
  
  // Test path ignore patterns
  testPathIgnorePatterns: [
    '/node_modules/',
    '/coverage/',
    '/logs/',
    '/uploads/',
    '/public/'
  ],
  
  // Watch plugins
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname'
  ],
  
  // Global setup and teardown
  globalSetup: '<rootDir>/jest.global-setup.js',
  globalTeardown: '<rootDir>/jest.global-teardown.js',
  
  // Test timeout
  testTimeout: 30000,
  
  // Verbose output
  verbose: true,
  
  // Force exit after tests
  forceExit: true,
  
  // Detect open handles
  detectOpenHandles: true
}; 